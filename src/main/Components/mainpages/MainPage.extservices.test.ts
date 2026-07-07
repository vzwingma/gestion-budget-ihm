import type { Mock } from 'vitest';
import {comptesLoaded, loadComptes} from './MainPage.extservices.ts';
import * as ClientHTTP from '../../Services/ClientHTTP.service.ts';
import {toast} from 'react-toastify';

vi.mock('../../Services/ClientHTTP.service.ts', () => ({
    call: vi.fn()
}));

vi.mock('react-toastify', () => ({
    toast: {
        error: vi.fn()
    }
}));

const flushPromises = () => new Promise(resolve => setTimeout(resolve, 0));

describe('MainPage.extservices', () => {

    beforeEach(() => {
        vi.clearAllMocks();
    });

    test('trie les comptes par ordre croissant', () => {
        const setComptes = vi.fn();
        const comptes = [{id: '2', ordre: 2}, {id: '1', ordre: 1}] as any[];

        comptesLoaded(comptes as any, setComptes);

        expect(setComptes).toHaveBeenCalledWith([{id: '1', ordre: 1}, {id: '2', ordre: 2}]);
    });

    test('charge les comptes puis applique le tri', async () => {
        const setComptes = vi.fn();
        (ClientHTTP.call as Mock).mockResolvedValue([{id: '2', ordre: 2}, {id: '1', ordre: 1}]);

        loadComptes(setComptes as any);
        await flushPromises();

        expect(ClientHTTP.call).toHaveBeenCalledTimes(1);
        expect(setComptes).toHaveBeenCalledWith([{id: '1', ordre: 1}, {id: '2', ordre: 2}]);
    });

    test('affiche un toast en cas d erreur de chargement', async () => {
        const setComptes = vi.fn();
        (ClientHTTP.call as Mock).mockRejectedValue(new Error('ko'));

        loadComptes(setComptes as any);
        await flushPromises();

        expect(toast.error).toHaveBeenCalledTimes(1);
    });
});
