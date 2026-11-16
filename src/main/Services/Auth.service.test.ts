import {consommerSessionExpiree, getOAuthToken, marquerSessionExpiree, putTokenInStorage, removeTokenFromStorage} from './Auth.service.ts';

describe('Auth.service', () => {

    beforeEach(() => {
        localStorage.clear();
        sessionStorage.clear();
        vi.restoreAllMocks();
    });

    test('retourne null si le token est absent', () => {
        expect(getOAuthToken()).toBeNull();
    });

    test('stocke le token quand une valeur est fournie', () => {
        putTokenInStorage('token-123');

        expect(localStorage.getItem('oauth2TokenKey')).toBe('token-123');
        expect(getOAuthToken()).toBe('token-123');
    });

    test('ne stocke pas de token quand la valeur est undefined', () => {
        const setItemSpy = vi.spyOn(Storage.prototype, 'setItem');

        putTokenInStorage(undefined);

        expect(setItemSpy).not.toHaveBeenCalled();
        expect(getOAuthToken()).toBeNull();
    });

    test('supprime le token du storage', () => {
        localStorage.setItem('oauth2TokenKey', 'token-123');

        removeTokenFromStorage();

        expect(localStorage.getItem('oauth2TokenKey')).toBeNull();
        expect(getOAuthToken()).toBeNull();
    });

    test('consommerSessionExpiree renvoie false quand le drapeau est absent', () => {
        expect(consommerSessionExpiree()).toBe(false);
    });

    test('marquerSessionExpiree pose le drapeau, consommerSessionExpiree le lit puis l\'efface', () => {
        marquerSessionExpiree();

        expect(sessionStorage.getItem('sessionExpiree')).toBe('true');
        expect(consommerSessionExpiree()).toBe(true);
        expect(sessionStorage.getItem('sessionExpiree')).toBeNull();
        expect(consommerSessionExpiree()).toBe(false);
    });
});