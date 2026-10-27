import type { Mock } from 'vitest';
import {v7} from 'uuid';
import {call} from './ClientHTTP.service.ts';
import {getOAuthToken, removeTokenFromStorage} from './Auth.service.ts';

vi.mock('uuid', () => ({
    v7: vi.fn()
}));

vi.mock('./Auth.service.ts', () => ({
    getOAuthToken: vi.fn(),
    removeTokenFromStorage: vi.fn()
}));

describe('ClientHTTP.service', () => {

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

    beforeEach(() => {
        vi.clearAllMocks();
        (v7 as Mock).mockReturnValue('12345678-abcd-4ef0-9012-3456789abcde');
        (getOAuthToken as Mock).mockReturnValue('token-test');
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
            .toThrow('Error: Erreur serveur');

        expect(removeTokenFromStorage).not.toHaveBeenCalled();
    });

    test('déconnecte sur un statut 403', async () => {
        (globalThis.fetch as Mock).mockResolvedValue({
            status: 403,
            statusText: 'Forbidden'
        });

        await expect(call('GET', 'https://api.exemple.fr', '/resource')).resolves.toBeUndefined();

        expect(removeTokenFromStorage).toHaveBeenCalledTimes(1);
        expect(globalThis.location.href).toBe('/');
    });

    test("préserve l'erreur d'origine dans cause (erreur réseau)", async () => {
        const original = new TypeError('Failed to fetch');
        const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
        (globalThis.fetch as Mock).mockRejectedValue(original);

        const error = await call('GET', 'https://api.exemple.fr', '/resource').catch(e => e);

        expect(error).toBeInstanceOf(Error);
        expect(error.message).toBe('TypeError: Failed to fetch');
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
