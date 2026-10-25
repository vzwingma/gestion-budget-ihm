import type { Mock } from 'vitest';
import {fetchLastAccessDateUtilisateur} from './ProfileInfos.extservices.ts';
import {call} from '../../Services/ClientHTTP.service.ts';

vi.mock('../../Services/ClientHTTP.service.ts', () => ({
    call: vi.fn()
}));

describe('ProfileInfos.extservices', () => {

    beforeEach(() => {
        vi.clearAllMocks();
    });

    test('résout avec la date de dernière connexion formatée (date - heure)', async () => {
        (call as Mock).mockResolvedValue({lastAccessTime: 1700000000});
        const date = new Date(1700000000 * 1000);

        await expect(fetchLastAccessDateUtilisateur())
            .resolves.toBe(date.toLocaleDateString() + " - " + date.toLocaleTimeString());
        expect(call).toHaveBeenCalledTimes(1);
    });

    test('log puis rejette en cas d erreur', async () => {
        const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
        (call as Mock).mockRejectedValue(new Error('ko'));

        await expect(fetchLastAccessDateUtilisateur()).rejects.toThrow('ko');
        expect(spy).toHaveBeenCalled();
        spy.mockRestore();
    });
});
