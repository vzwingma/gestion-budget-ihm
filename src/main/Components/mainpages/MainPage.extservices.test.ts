import {comptesLoaded, loadComptes} from './MainPage.extservices.ts';
import * as ClientHTTP from '../../Services/ClientHTTP.service.ts';
import {toast} from 'react-toastify';

jest.mock('../../Services/ClientHTTP.service.ts', () => ({
    call: jest.fn()
}));

jest.mock('react-toastify', () => ({
    toast: {
        error: jest.fn()
    }
}));

const flushPromises = () => new Promise(resolve => setTimeout(resolve, 0));

describe('MainPage.extservices', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('trie les comptes par ordre croissant', () => {
        const setComptes = jest.fn();
        const comptes = [{id: '2', ordre: 2}, {id: '1', ordre: 1}] as any[];

        comptesLoaded(comptes as any, setComptes);

        expect(setComptes).toHaveBeenCalledWith([{id: '1', ordre: 1}, {id: '2', ordre: 2}]);
    });

    test('charge les comptes puis applique le tri', async () => {
        const setComptes = jest.fn();
        (ClientHTTP.call as jest.Mock).mockResolvedValue([{id: '2', ordre: 2}, {id: '1', ordre: 1}]);

        loadComptes(setComptes as any);
        await flushPromises();

        expect(ClientHTTP.call).toHaveBeenCalledTimes(1);
        expect(setComptes).toHaveBeenCalledWith([{id: '1', ordre: 1}, {id: '2', ordre: 2}]);
    });

    test('affiche un toast en cas d erreur de chargement', async () => {
        const setComptes = jest.fn();
        (ClientHTTP.call as jest.Mock).mockRejectedValue(new Error('ko'));

        loadComptes(setComptes as any);
        await flushPromises();

        expect(toast.error).toHaveBeenCalledTimes(1);
    });
});
