import {consommerSessionExpiree, estTokenExpire, getOAuthToken, marquerSessionExpiree, putTokenInStorage, removeTokenFromStorage} from './Auth.service.ts';

describe('Auth.service', () => {

    beforeEach(() => {
        localStorage.clear();
        sessionStorage.clear();
        vi.restoreAllMocks();
    });

    describe('estTokenExpire — expiration du JWT transmis', () => {
        const maintenant = Date.UTC(2026, 10, 24, 12);
        // JWT synthétique non signé : aucun credential réel, seule la lecture de exp est testée.
        const jwt = (claims: unknown) =>
            `e30.${btoa(JSON.stringify(claims)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')}.c2ln`;

        beforeEach(() => {
            vi.spyOn(Date, 'now').mockReturnValue(maintenant);
        });

        afterEach(() => {
            vi.restoreAllMocks();
        });

        test.each([
            {nom: 'périmé', ecart: -1, attendu: true},
            {nom: 'exactement à expiration', ecart: 0, attendu: true},
            {nom: 'encore valide', ecart: 1, attendu: false}
        ])('jeton $nom : exp en secondes, sans marge implicite', ({ecart, attendu}) => {
            expect(estTokenExpire(jwt({exp: maintenant / 1000 + ecart}))).toBe(attendu);
        });

        test.each([null, undefined])('absence de jeton (%s) : aucune expiration confirmée', token => {
            const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});

            expect(estTokenExpire(token)).toBe(false);
            expect(warn).not.toHaveBeenCalled();
        });

        test.each([
            ['opaque', 'opaque-synthetique'],
            ['segment vide', 'e30..c2ln'],
            ['caractère interdit', 'e30.%.c2ln'],
            ['JSON invalide', 'e30.bm90LWpzb24.c2ln'],
            ['payload null', jwt(null)],
            ['sans exp', jwt({sub: 'synthetique'})],
            ['exp chaîne', jwt({exp: '0'})],
            ['exp null', jwt({exp: null})],
            ['exp non finie', 'e30.' + btoa('{"exp":1e400}').replace(/=+$/, '') + '.c2ln']
        ])('%s : laisse le serveur décider, avertissement sans contenu du jeton', (_nom, token) => {
            const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});

            expect(estTokenExpire(token)).toBe(false);
            expect(warn).toHaveBeenCalledTimes(1);
            // Un seul message constant, sans token, claims ni exception contenant le payload.
            expect(warn.mock.calls[0]).toHaveLength(1);
            expect(warn.mock.calls[0][0]).toMatch(/^Expiration de session indéterminée : /);
            expect(warn.mock.calls[0][0]).not.toContain(token);
            expect(warn.mock.calls[0][0]).not.toContain('synthetique');
        });
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