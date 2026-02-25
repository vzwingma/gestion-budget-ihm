import {getOAuthToken, putTokenInStorage, removeTokenFromStorage} from './Auth.service.ts';

describe('Auth.service', () => {

    beforeEach(() => {
        localStorage.clear();
        jest.restoreAllMocks();
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
        const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');

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
});