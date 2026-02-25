import {getLastAccessDateUtilisateur} from './ProfileInfos.extservices.ts';
import {call} from '../../Services/ClientHTTP.service.ts';

jest.mock('../../Services/ClientHTTP.service.ts', () => ({
    call: jest.fn()
}));

const flushPromises = () => new Promise(resolve => setTimeout(resolve, 0));

describe('ProfileInfos.extservices', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('met à jour la date de dernière connexion', async () => {
        const setState = jest.fn();
        (call as jest.Mock).mockResolvedValue({lastAccessTime: 1700000000});

        getLastAccessDateUtilisateur(setState);
        await flushPromises();

        expect(call).toHaveBeenCalledTimes(1);
        expect(setState).toHaveBeenCalledTimes(1);
    });
});
