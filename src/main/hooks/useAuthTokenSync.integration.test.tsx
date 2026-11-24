import React from 'react';
import {act, fireEvent, render, screen} from '@testing-library/react';
import {useAuth} from 'react-oidc-context';

vi.mock('react-oidc-context', () => ({useAuth: vi.fn()}));

describe('useAuthTokenSync — événements réels et services de session réels', () => {
    const maintenant = Date.UTC(2026, 10, 24, 12);
    const jwt = (exp: number) => `e30.${btoa(JSON.stringify({exp})).replace(/=+$/, '')}.c2ln`;
    const tokenInitial = jwt(maintenant / 1000 + 60);
    const originalLocation = globalThis.location;
    let AuthTokenSync: typeof import('../Components/shared/AuthTokenSync.component.tsx').default;
    let authService: typeof import('../Services/Auth.service.ts');
    let client: typeof import('../Services/ClientHTTP.service.ts');
    let loaded: (user: {id_token: string}) => void;
    let silentRenewError: (error: Error) => void;
    let desabonner: ReturnType<typeof vi.fn>[];
    let removeUser: ReturnType<typeof vi.fn>;
    let auth: ReturnType<typeof useAuth>;

    beforeAll(() => {
        // Même façade Location que les tests unitaires existants : aucune navigation jsdom réelle.
        Object.defineProperty(globalThis, 'location', {
            value: {href: 'http://localhost/budgets'},
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

    beforeEach(async () => {
        // Seule la garde persistante du client doit repartir de zéro. Garder la même instance
        // React que le renderer statiquement importé évite les erreurs « invalid hook call ».
        vi.resetModules();
        vi.doMock('react', () => ({...React, default: React}));
        vi.clearAllMocks();
        vi.useFakeTimers({toFake: ['Date']});
        vi.setSystemTime(maintenant);
        localStorage.clear();
        sessionStorage.clear();
        globalThis.location.href = 'http://localhost/budgets';
        authService = await import('../Services/Auth.service.ts');
        client = await import('../Services/ClientHTTP.service.ts');
        ({default: AuthTokenSync} = await import('../Components/shared/AuthTokenSync.component.tsx'));
        desabonner = [vi.fn(), vi.fn(), vi.fn()];
        removeUser = vi.fn().mockResolvedValue(undefined);
        auth = {
            isAuthenticated: true,
            isLoading: false,
            activeNavigator: undefined,
            user: {id_token: tokenInitial},
            removeUser,
            events: {
                addUserLoaded: vi.fn((cb: typeof loaded) => { loaded = cb; return desabonner[0]; }),
                addUserUnloaded: vi.fn(() => desabonner[1]),
                addSilentRenewError: vi.fn((cb: typeof silentRenewError) => { silentRenewError = cb; return desabonner[2]; })
            }
        } as unknown as ReturnType<typeof useAuth>;
        vi.mocked(useAuth).mockReturnValue(auth);
    });

    afterEach(() => {
        vi.useRealTimers();
        vi.restoreAllMocks();
        vi.doUnmock('react');
        localStorage.clear();
        sessionStorage.clear();
    });

    function page(action = vi.fn()) {
        return <><AuthTokenSync /><button onClick={action} onKeyDown={action}>Action métier</button></>;
    }

    test.each(['click', 'keydown'])('premier %s expiré : capture avant le handler enfant et annulation native', type => {
        const action = vi.fn();
        render(page(action));
        expect(authService.getOAuthToken()).toBe(tokenInitial);
        vi.setSystemTime(maintenant + 60_000); // Frontière exp exacte, sans rerender.
        const event = type === 'click'
            ? new MouseEvent(type, {bubbles: true, cancelable: true})
            : new KeyboardEvent(type, {key: 'Enter', bubbles: true, cancelable: true});

        fireEvent(screen.getByRole('button', {name: 'Action métier'}), event);

        expect(event.defaultPrevented).toBe(true);
        expect(action).not.toHaveBeenCalled();
        expect(removeUser).toHaveBeenCalledTimes(1);
        expect(authService.getOAuthToken()).toBeNull();
        expect(authService.consommerSessionExpiree()).toBe(true);
    });

    test.each(['focus', 'visibilitychange'])('retour %s : contrôle après avance de l’horloge sans rerender', type => {
        render(page());
        vi.setSystemTime(maintenant + 61_000);

        if (type === 'visibilitychange') {
            vi.spyOn(document, 'visibilityState', 'get').mockReturnValue('hidden');
            fireEvent(document, new Event(type));
            expect(removeUser).not.toHaveBeenCalled();
            vi.spyOn(document, 'visibilityState', 'get').mockReturnValue('visible');
            fireEvent(document, new Event(type));
        } else {
            fireEvent(window, new Event(type));
        }

        expect(removeUser).toHaveBeenCalledTimes(1);
        expect(client.estDeconnexionEnCours()).toBe(true);
    });

    test('session valide : interactions et retour focus ne déconnectent pas', () => {
        const action = vi.fn();
        render(page(action));

        fireEvent.click(screen.getByRole('button'));
        fireEvent.keyDown(screen.getByRole('button'), {key: 'Enter'});
        fireEvent(window, new Event('focus'));

        expect(action).toHaveBeenCalledTimes(2);
        expect(removeUser).not.toHaveBeenCalled();
        expect(authService.getOAuthToken()).toBe(tokenInitial);
    });

    test('renouvellement userLoaded : première interaction utilise le token courant, pas le token OIDC capturé', () => {
        const action = vi.fn();
        render(page(action));
        const tokenRenouvele = jwt(maintenant / 1000 + 600);
        act(() => loaded({id_token: tokenRenouvele}));
        vi.setSystemTime(maintenant + 61_000);

        fireEvent.click(screen.getByRole('button'));
        fireEvent(window, new Event('focus'));

        expect(authService.getOAuthToken()).toBe(tokenRenouvele);
        expect(action).toHaveBeenCalledTimes(1);
        expect(removeUser).not.toHaveBeenCalled();
    });

    test('removeUser pending : déconnexion unique, aucune réécriture du token, redirection seulement après résolution', async () => {
        let terminer!: () => void;
        const attente = new Promise<void>(resolve => { terminer = resolve; });
        removeUser.mockReturnValue(attente);
        const action = vi.fn();
        render(page(action));
        vi.setSystemTime(maintenant + 61_000);

        fireEvent.click(screen.getByRole('button'));
        fireEvent.keyDown(screen.getByRole('button'), {key: 'Enter'});
        fireEvent(window, new Event('focus'));
        act(() => loaded({id_token: jwt(maintenant / 1000 + 600)}));

        expect(removeUser).toHaveBeenCalledTimes(1);
        expect(action).not.toHaveBeenCalled();
        expect(authService.getOAuthToken()).toBeNull();
        expect(globalThis.location.href).toBe('http://localhost/budgets');

        await act(async () => { terminer(); await attente; });

        expect(globalThis.location.href).toBe('/');
    });

    test('restauration OIDC : attend la fin du chargement avant de conclure à l’expiration', () => {
        auth = {...auth, isLoading: true, user: {id_token: jwt(0)}} as ReturnType<typeof useAuth>;
        vi.mocked(useAuth).mockReturnValue(auth);
        const {rerender} = render(page());
        fireEvent(window, new Event('focus'));
        expect(removeUser).not.toHaveBeenCalled();

        vi.mocked(useAuth).mockReturnValue({...auth, isLoading: false});
        rerender(page());

        expect(removeUser).toHaveBeenCalledTimes(1);
    });

    test('échec isolé de renouvellement : avertit sans déconnecter une session encore valide', () => {
        const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
        render(page());
        const erreur = new Error('échec synthétique');

        act(() => silentRenewError(erreur));
        fireEvent(window, new Event('focus'));

        expect(warn).toHaveBeenCalledWith('Échec du renouvellement silencieux de la session', erreur);
        expect(removeUser).not.toHaveBeenCalled();
        expect(authService.getOAuthToken()).toBe(tokenInitial);
    });

    test('démontage : retire tous les listeners capture, focus, visibilité et abonnements OIDC', () => {
        const enleverWindow = vi.spyOn(window, 'removeEventListener');
        const enleverDocument = vi.spyOn(document, 'removeEventListener');
        const {unmount} = render(page());

        unmount();
        vi.setSystemTime(maintenant + 61_000);
        const clic = new MouseEvent('click', {bubbles: true, cancelable: true});
        fireEvent(window, clic);
        fireEvent(window, new Event('focus'));
        vi.spyOn(document, 'visibilityState', 'get').mockReturnValue('visible');
        fireEvent(document, new Event('visibilitychange'));

        expect(clic.defaultPrevented).toBe(false);
        expect(removeUser).not.toHaveBeenCalled();
        for (const type of ['pointerdown', 'pointerup', 'mousedown', 'mouseup', 'click', 'dblclick',
            'contextmenu', 'keydown', 'keypress', 'keyup', 'submit']) {
            expect(enleverWindow).toHaveBeenCalledWith(type, expect.any(Function), true);
        }
        expect(enleverWindow).toHaveBeenCalledWith('focus', expect.any(Function));
        expect(enleverDocument).toHaveBeenCalledWith('visibilitychange', expect.any(Function));
        desabonner.forEach(fn => expect(fn).toHaveBeenCalledTimes(1));
    });
});
