import type { Mock } from 'vitest';


vi.mock('uuid', () => ({
    v7: vi.fn()
}));

vi.mock('./Auth.service.ts', () => ({
    getOAuthToken: vi.fn(),
    marquerSessionExpiree: vi.fn(),
    removeTokenFromStorage: vi.fn()
}));

describe('ClientHTTP.service', () => {

    // Modules réimportés à chaque test (vi.resetModules) : la garde de déconnexion unique du client repart de zéro
    let v7: Mock;
    let getOAuthToken: Mock;
    let removeTokenFromStorage: Mock;
    let call: typeof import('./ClientHTTP.service.ts').call;
    let setGestionnaireDeconnexion: typeof import('./ClientHTTP.service.ts').setGestionnaireDeconnexion;
    let HttpError: typeof import('./HttpError.ts').HttpError;

    const originalLocation = globalThis.location;

    beforeAll(() => {
        Object.defineProperty(globalThis, 'location', {
            value: {href: 'http://localhost/'} as Location,
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
        vi.resetModules();
        vi.clearAllMocks();
        ({v7} = await import('uuid') as unknown as {v7: Mock});
        ({getOAuthToken, removeTokenFromStorage} = await import('./Auth.service.ts') as unknown as {getOAuthToken: Mock, removeTokenFromStorage: Mock});
        ({call, setGestionnaireDeconnexion} = await import('./ClientHTTP.service.ts'));
        ({HttpError} = await import('./HttpError.ts'));
        v7.mockReturnValue('12345678-abcd-4ef0-9012-3456789abcde');
        getOAuthToken.mockReturnValue('token-test');
        globalThis.fetch = vi.fn();
    });

    test('retourne le JSON en cas de succès 2xx', async () => {
        const json = vi.fn().mockResolvedValue({ok: true});
        (globalThis.fetch as Mock).mockResolvedValue({
            status: 200,
            json
        });

        await expect(call('POST', 'https://api.exemple.fr', '/resource/{{}}', ['42'], {a: 1}))
            .resolves.toEqual({ok: true});

        expect(globalThis.fetch).toHaveBeenCalledTimes(1);
        expect(globalThis.fetch).toHaveBeenCalledWith(
            'https://api.exemple.fr/resource/42',
            expect.objectContaining({
                method: 'POST',
                mode: 'cors',
                body: '{"a":1}'
            })
        );

        const options = (globalThis.fetch as Mock).mock.calls[0][1];
        const headers = options.headers as Headers;
        expect(headers.get('Content-Type')).toBe('application/json');
        expect(headers.get('X-Api-Key')).toBeTruthy();
        expect(headers.get('Authorization')).toBe('Bearer token-test');
    });

    test('jette une erreur sur un statut non 2xx et différent de 403', async () => {
        (globalThis.fetch as Mock).mockResolvedValue({
            status: 500,
            statusText: 'Erreur serveur'
        });

        await expect(call('GET', 'https://api.exemple.fr', '/resource'))
            .rejects
            .toMatchObject({name: 'HttpError', status: 500, statusText: 'Erreur serveur'});

        expect(removeTokenFromStorage).not.toHaveBeenCalled();
    });

    test('déconnecte sur un statut 403', async () => {
        (globalThis.fetch as Mock).mockResolvedValue({
            status: 403,
            statusText: 'Forbidden'
        });

        await expect(call('GET', 'https://api.exemple.fr', '/resource')).rejects.toBeInstanceOf(HttpError);

        expect(removeTokenFromStorage).toHaveBeenCalledTimes(1);
        expect(globalThis.location.href).toBe('/');
    });

    test('déconnecte sur un statut 401', async () => {
        (globalThis.fetch as Mock).mockResolvedValue({
            status: 401,
            statusText: 'Unauthorized'
        });

        await expect(call('GET', 'https://api.exemple.fr', '/resource'))
            .rejects
            .toMatchObject({name: 'HttpError', status: 401, statusText: 'Unauthorized'});

        expect(removeTokenFromStorage).toHaveBeenCalledTimes(1);
        expect(globalThis.location.href).toBe('/');
    });

    test('3 × 401 en parallèle → une seule déconnexion (garde anti-réentrance)', async () => {
        (globalThis.fetch as Mock).mockResolvedValue({
            status: 401,
            statusText: 'Unauthorized'
        });

        const resultats = await Promise.allSettled([
            call('GET', 'https://api.exemple.fr', '/a'),
            call('GET', 'https://api.exemple.fr', '/b'),
            call('GET', 'https://api.exemple.fr', '/c')
        ]);

        expect(resultats.every(r => r.status === 'rejected')).toBe(true);
        expect(removeTokenFromStorage).toHaveBeenCalledTimes(1);
    });

    test('sans jeton : aucun en-tête Authorization, et pas de déconnexion sur 401', async () => {
        getOAuthToken.mockReturnValue(null);
        (globalThis.fetch as Mock).mockResolvedValue({
            status: 401,
            statusText: 'Unauthorized'
        });

        await expect(call('GET', 'https://api.exemple.fr', '/resource')).rejects.toBeInstanceOf(HttpError);

        const options = (globalThis.fetch as Mock).mock.calls[0][1];
        const headers = options.headers as Headers;
        expect(headers.has('Authorization')).toBe(false);
        expect(removeTokenFromStorage).not.toHaveBeenCalled();
    });

    test('jeton renouvelé entre l\'envoi et la réponse : pas de déconnexion (401 dû à l\'ancien jeton)', async () => {
        getOAuthToken.mockReturnValueOnce('token-ancien').mockReturnValueOnce('token-renouvele');
        (globalThis.fetch as Mock).mockResolvedValue({
            status: 401,
            statusText: 'Unauthorized'
        });

        await expect(call('GET', 'https://api.exemple.fr', '/resource')).rejects.toBeInstanceOf(HttpError);

        expect(removeTokenFromStorage).not.toHaveBeenCalled();
    });

    test('setGestionnaireDeconnexion : le gestionnaire personnalisé est appelé sur un 401/403', async () => {
        const gestionnairePerso = vi.fn();
        setGestionnaireDeconnexion(gestionnairePerso);
        (globalThis.fetch as Mock).mockResolvedValue({status: 403, statusText: 'Forbidden'});

        await expect(call('GET', 'https://api.exemple.fr', '/resource')).rejects.toBeInstanceOf(HttpError);

        expect(gestionnairePerso).toHaveBeenCalledTimes(1);
        expect(removeTokenFromStorage).not.toHaveBeenCalled();
    });

    test('setGestionnaireDeconnexion() sans argument : retour au repli (logOut)', async () => {
        const gestionnairePerso = vi.fn();
        setGestionnaireDeconnexion(gestionnairePerso);
        setGestionnaireDeconnexion();
        (globalThis.fetch as Mock).mockResolvedValue({status: 403, statusText: 'Forbidden'});

        await expect(call('GET', 'https://api.exemple.fr', '/resource')).rejects.toBeInstanceOf(HttpError);

        expect(gestionnairePerso).not.toHaveBeenCalled();
        expect(removeTokenFromStorage).toHaveBeenCalledTimes(1);
    });

    test.each([404, 503])('jette une HttpError avec le statut %i', async (status) => {
        (globalThis.fetch as Mock).mockResolvedValue({
            status,
            statusText: 'peu importe'
        });

        await expect(call('GET', 'https://api.exemple.fr', '/resource'))
            .rejects
            .toMatchObject({name: 'HttpError', status});

        expect(removeTokenFromStorage).not.toHaveBeenCalled();
    });

    test('réponse 2xx avec JSON invalide : rejette avec une HttpError', async () => {
        const original = new SyntaxError('Unexpected token');
        const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
        (globalThis.fetch as Mock).mockResolvedValue({
            status: 200,
            statusText: 'OK',
            json: vi.fn().mockRejectedValue(original)
        });

        const error = await call('GET', 'https://api.exemple.fr', '/resource').catch(e => e);

        expect(error).toBeInstanceOf(HttpError);
        expect(error.status).toBe(200);
        expect(error.cause).toBe(original);
        expect(spy).toHaveBeenCalled();
        spy.mockRestore();
    });

    test("préserve l'erreur d'origine dans cause (erreur réseau)", async () => {
        const original = new TypeError('Failed to fetch');
        const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
        (globalThis.fetch as Mock).mockRejectedValue(original);

        const error = await call('GET', 'https://api.exemple.fr', '/resource').catch(e => e);

        expect(error).toBeInstanceOf(HttpError);
        expect(error.status).toBeUndefined();
        expect(error.cause).toBe(original);
        expect(spy).toHaveBeenCalled();
        spy.mockRestore();
    });

    describe("construction de l'URL ({{}} + encodage des paramètres)", () => {

        /** URL réellement passée à fetch pour un appel GET réussi */
        async function urlAppelee(path: string, params?: string[]): Promise<string> {
            (globalThis.fetch as Mock).mockResolvedValue({status: 200, json: vi.fn().mockResolvedValue({})});
            await call('GET', 'https://api.exemple.fr', path, params);
            return (globalThis.fetch as Mock).mock.calls[0][0] as string;
        }

        test.each([
            ['a/b?c', 'a%2Fb%3Fc'],
            ['x&y=1', 'x%26y%3D1'],
            ['id#frag', 'id%23frag'],
            ['avec espace', 'avec%20espace'],
            ['../admin', '..%2Fadmin'],
        ])("paramètre '%s' encodé en '%s' (pas d'injection de chemin / requête)", async (param, attendu) => {
            await expect(urlAppelee('/r/{{}}', [param])).resolves.toBe('https://api.exemple.fr/r/' + attendu);
        });

        test.each(['$&', '$1', "$'", '$`', '$$'])('motif spécial de replace "%s" conservé littéral', async (param) => {
            const url = await urlAppelee('/r/{{}}/fin', [param]);

            expect(url).toBe('https://api.exemple.fr/r/' + encodeURIComponent(param) + '/fin');
            expect(url).not.toContain('{{}}');
        });

        test.each(['550e8400-e29b-41d4-a716-446655440000', 'compte_2024_03', 'A-b_c.d~e'])('identifiant courant "%s" inchangé', async (id) => {
            await expect(urlAppelee('/r/{{}}', [id])).resolves.toBe('https://api.exemple.fr/r/' + id);
        });

        test("plusieurs {{}} remplacés dans l'ordre, chaque paramètre encodé", async () => {
            await expect(urlAppelee('/{{}}/operations/{{}}', ['c/1', 'o 2'])).resolves
                .toBe('https://api.exemple.fr/c%2F1/operations/o%202');
        });

        test("un paramètre contenant {{}} est encodé et n'est pas consommé par le remplacement suivant", async () => {
            await expect(urlAppelee('/{{}}/x/{{}}', ['{{}}', 'b'])).resolves
                .toBe('https://api.exemple.fr/%7B%7B%7D%7D/x/b');
        });

        test('moins de paramètres que de {{}} : les {{}} restants sont conservés (comportement actuel)', async () => {
            await expect(urlAppelee('/{{}}/operations/{{}}', ['c1'])).resolves
                .toBe('https://api.exemple.fr/c1/operations/{{}}');
        });

        test('plus de paramètres que de {{}} : paramètres excédentaires ignorés', async () => {
            await expect(urlAppelee('/r/{{}}', ['a', 'b'])).resolves.toBe('https://api.exemple.fr/r/a');
        });

        test('sans paramètres : chemin inchangé', async () => {
            await expect(urlAppelee('/r/liste')).resolves.toBe('https://api.exemple.fr/r/liste');
        });
    });
});
