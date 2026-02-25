import {v7} from 'uuid';
import {call} from './ClientHTTP.service.ts';
import {getOAuthToken, removeTokenFromStorage} from './Auth.service.ts';

jest.mock('uuid', () => ({
    v7: jest.fn()
}));

jest.mock('./Auth.service.ts', () => ({
    getOAuthToken: jest.fn(),
    removeTokenFromStorage: jest.fn()
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
        jest.clearAllMocks();
        (v7 as jest.Mock).mockReturnValue('12345678-abcd-4ef0-9012-3456789abcde');
        (getOAuthToken as jest.Mock).mockReturnValue('token-test');
        globalThis.fetch = jest.fn();
    });

    test('retourne le JSON en cas de succès 2xx', async () => {
        const json = jest.fn().mockResolvedValue({ok: true});
        (globalThis.fetch as jest.Mock).mockResolvedValue({
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

        const options = (globalThis.fetch as jest.Mock).mock.calls[0][1];
        const headers = options.headers as Headers;
        expect(headers.get('Content-Type')).toBe('application/json');
        expect(headers.get('X-Api-Key')).toBeTruthy();
        expect(headers.get('Authorization')).toBe('Bearer token-test');
    });

    test('jette une erreur sur un statut non 2xx et différent de 403', async () => {
        (globalThis.fetch as jest.Mock).mockResolvedValue({
            status: 500,
            statusText: 'Erreur serveur'
        });

        await expect(call('GET', 'https://api.exemple.fr', '/resource'))
            .rejects
            .toThrow('Error: Erreur serveur');

        expect(removeTokenFromStorage).not.toHaveBeenCalled();
    });

    test('déconnecte sur un statut 403', async () => {
        (globalThis.fetch as jest.Mock).mockResolvedValue({
            status: 403,
            statusText: 'Forbidden'
        });

        await expect(call('GET', 'https://api.exemple.fr', '/resource')).resolves.toBeUndefined();

        expect(removeTokenFromStorage).toHaveBeenCalledTimes(1);
        expect(globalThis.location.href).toBe('/');
    });
});