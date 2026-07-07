import type { Mock } from 'vitest';
import {getLastAccessDateUtilisateur} from './ProfileInfos.extservices.ts';
import {call} from '../../Services/ClientHTTP.service.ts';

vi.mock('../../Services/ClientHTTP.service.ts', () => ({
    call: vi.fn()
}));

const flushPromises = () => new Promise(resolve => setTimeout(resolve, 0));

describe('ProfileInfos.extservices', () => {

    beforeEach(() => {
        vi.clearAllMocks();
    });

    test('met à jour la date de dernière connexion', async () => {
        const setState = vi.fn();
        (call as Mock).mockResolvedValue({lastAccessTime: 1700000000});

        getLastAccessDateUtilisateur(setState);
        await flushPromises();

        expect(call).toHaveBeenCalledTimes(1);
        expect(setState).toHaveBeenCalledTimes(1);
    });
});
