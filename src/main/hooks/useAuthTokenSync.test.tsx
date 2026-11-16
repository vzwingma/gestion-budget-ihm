import React from 'react';
import { render } from '@testing-library/react';
import { describe, test, expect, vi, beforeEach, afterAll, beforeAll } from 'vitest';
import AuthTokenSync from '../Components/shared/AuthTokenSync.component.tsx';
import { useAuth } from 'react-oidc-context';
import { marquerSessionExpiree, putTokenInStorage, removeTokenFromStorage } from '../Services/Auth.service.ts';
import { setGestionnaireDeconnexion } from '../Services/ClientHTTP.service.ts';

vi.mock('react-oidc-context', () => ({ useAuth: vi.fn() }));
vi.mock('../Services/Auth.service.ts', () => ({
    putTokenInStorage: vi.fn(),
    removeTokenFromStorage: vi.fn(),
    marquerSessionExpiree: vi.fn()
}));
vi.mock('../Services/ClientHTTP.service.ts', () => ({
    setGestionnaireDeconnexion: vi.fn()
}));

describe('useAuthTokenSync / AuthTokenSync', () => {

    let loadedCb: ((user: any) => void) | undefined;
    let unloadedCb: (() => void) | undefined;
    let silentRenewErrorCb: ((error: unknown) => void) | undefined;
    const removeLoaded = vi.fn();
    const removeUnloaded = vi.fn();
    const removeSilentRenewError = vi.fn();
    let events: any;

    const originalLocation = globalThis.location;

    beforeAll(() => {
        Object.defineProperty(globalThis, 'location', {
            value: { href: 'http://localhost/budgets' } as Location,
            writable: true,
            configurable: true
        });
    });

    afterAll(() => {
        Object.defineProperty(globalThis, 'location', {
            value: originalLocation,
            writable: true,
            configurable: true
        });
    });

    function mockAuth(overrides: any = {}) {
        (useAuth as any).mockReturnValue({ isAuthenticated: false, user: null, events, removeUser: vi.fn().mockResolvedValue(undefined), ...overrides });
    }

    beforeEach(() => {
        vi.clearAllMocks();
        globalThis.location.href = 'http://localhost/budgets';
        loadedCb = undefined;
        unloadedCb = undefined;
        silentRenewErrorCb = undefined;
        events = {
            addUserLoaded: vi.fn((cb) => { loadedCb = cb; return removeLoaded; }),
            addUserUnloaded: vi.fn((cb) => { unloadedCb = cb; return removeUnloaded; }),
            addSilentRenewError: vi.fn((cb) => { silentRenewErrorCb = cb; return removeSilentRenewError; })
        };
    });

    test('ne rend rien (composant technique)', () => {
        mockAuth();
        const { container } = render(<AuthTokenSync />);
        expect(container).toBeEmptyDOMElement();
    });

    test('stocke immédiatement le token si session déjà active au montage', () => {
        mockAuth({ isAuthenticated: true, user: { id_token: 'tok-init' } });
        render(<AuthTokenSync />);
        expect(putTokenInStorage).toHaveBeenCalledWith('tok-init');
    });

    test('ne stocke rien si non authentifié', () => {
        mockAuth({ isAuthenticated: false, user: { id_token: 'x' } });
        render(<AuthTokenSync />);
        expect(putTokenInStorage).not.toHaveBeenCalled();
    });

    test('ne stocke rien si authentifié sans id_token', () => {
        mockAuth({ isAuthenticated: true, user: {} });
        render(<AuthTokenSync />);
        expect(putTokenInStorage).not.toHaveBeenCalled();
    });

    test('userLoaded (connexion / renouvellement silencieux) -> token stocké', () => {
        mockAuth();
        render(<AuthTokenSync />);
        loadedCb!({ id_token: 'tok-renew' });
        expect(putTokenInStorage).toHaveBeenCalledWith('tok-renew');
    });

    test('userUnloaded (déconnexion) -> token retiré', () => {
        mockAuth();
        render(<AuthTokenSync />);
        unloadedCb!();
        expect(removeTokenFromStorage).toHaveBeenCalledTimes(1);
    });

    test('désabonne les listeners au démontage', () => {
        mockAuth();
        const { unmount } = render(<AuthTokenSync />);
        expect(removeLoaded).not.toHaveBeenCalled();
        unmount();
        expect(removeLoaded).toHaveBeenCalledTimes(1);
        expect(removeUnloaded).toHaveBeenCalledTimes(1);
    });

    test('enregistre un gestionnaire de déconnexion auprès de ClientHTTP', () => {
        mockAuth();
        render(<AuthTokenSync />);
        expect(setGestionnaireDeconnexion).toHaveBeenCalledWith(expect.any(Function));
    });

    test('gestionnaire de déconnexion : marque la session expirée, retire le token, retire l\'utilisateur OIDC puis redirige', async () => {
        const removeUser = vi.fn().mockResolvedValue(undefined);
        mockAuth({ removeUser });
        render(<AuthTokenSync />);

        const gestionnaire = (setGestionnaireDeconnexion as any).mock.calls[0][0];
        gestionnaire();
        await vi.waitFor(() => expect(removeUser).toHaveBeenCalledTimes(1));

        expect(marquerSessionExpiree).toHaveBeenCalledTimes(1);
        expect(removeTokenFromStorage).toHaveBeenCalledTimes(1);
        await vi.waitFor(() => expect(globalThis.location.href).toBe('/'));
    });

    test('gestionnaire de déconnexion : redirige même si removeUser échoue', async () => {
        const spy = vi.spyOn(console, 'warn').mockImplementation(() => {});
        const removeUser = vi.fn().mockRejectedValue(new Error('oidc down'));
        mockAuth({ removeUser });
        render(<AuthTokenSync />);

        const gestionnaire = (setGestionnaireDeconnexion as any).mock.calls[0][0];
        gestionnaire();

        await vi.waitFor(() => expect(globalThis.location.href).toBe('/'));
        expect(spy).toHaveBeenCalledWith("Erreur lors de la suppression de l'utilisateur OIDC", expect.any(Error));
        spy.mockRestore();
    });

    test('désenregistre le gestionnaire au démontage (pas de réarmement de la garde)', () => {
        mockAuth();
        const { unmount } = render(<AuthTokenSync />);
        unmount();
        expect(setGestionnaireDeconnexion).toHaveBeenLastCalledWith();
    });

    test('échec du renouvellement silencieux (addSilentRenewError) : journalisé en console', () => {
        const spy = vi.spyOn(console, 'warn').mockImplementation(() => {});
        mockAuth();
        render(<AuthTokenSync />);

        const erreur = new Error('silent renew failed');
        silentRenewErrorCb!(erreur);

        expect(spy).toHaveBeenCalledWith('Échec du renouvellement silencieux de la session', erreur);
        spy.mockRestore();
    });
});
