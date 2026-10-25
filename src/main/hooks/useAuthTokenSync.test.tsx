import React from 'react';
import { render } from '@testing-library/react';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import AuthTokenSync from '../Components/shared/AuthTokenSync.component.tsx';
import { useAuth } from 'react-oidc-context';
import { putTokenInStorage, removeTokenFromStorage } from '../Services/Auth.service.ts';

vi.mock('react-oidc-context', () => ({ useAuth: vi.fn() }));
vi.mock('../Services/Auth.service.ts', () => ({
    putTokenInStorage: vi.fn(),
    removeTokenFromStorage: vi.fn()
}));

describe('useAuthTokenSync / AuthTokenSync', () => {

    let loadedCb: ((user: any) => void) | undefined;
    let unloadedCb: (() => void) | undefined;
    const removeLoaded = vi.fn();
    const removeUnloaded = vi.fn();
    let events: any;

    function mockAuth(overrides: any = {}) {
        (useAuth as any).mockReturnValue({ isAuthenticated: false, user: null, events, ...overrides });
    }

    beforeEach(() => {
        vi.clearAllMocks();
        loadedCb = undefined;
        unloadedCb = undefined;
        events = {
            addUserLoaded: vi.fn((cb) => { loadedCb = cb; return removeLoaded; }),
            addUserUnloaded: vi.fn((cb) => { unloadedCb = cb; return removeUnloaded; })
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
});
