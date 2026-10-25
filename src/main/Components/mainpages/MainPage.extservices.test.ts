import type { Mock } from 'vitest';
import {comptesLoaded, fetchComptes} from './MainPage.extservices.ts';
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

    test('fetchComptes résout avec les comptes triés', async () => {
        (ClientHTTP.call as Mock).mockResolvedValue([{id: '2', ordre: 2}, {id: '1', ordre: 1}]);

        await expect(fetchComptes()).resolves.toEqual([{id: '1', ordre: 1}, {id: '2', ordre: 2}]);
        expect(ClientHTTP.call).toHaveBeenCalledTimes(1);
        expect(toast.error).not.toHaveBeenCalled();
    });

    test('fetchComptes résout avec une liste vide si le back renvoie []', async () => {
        (ClientHTTP.call as Mock).mockResolvedValue([]);

        await expect(fetchComptes()).resolves.toEqual([]);
    });

    test('fetchComptes en erreur : toast + rejet', async () => {
        const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
        (ClientHTTP.call as Mock).mockRejectedValue(new Error('ko'));

        await expect(fetchComptes()).rejects.toThrow('ko');
        expect(toast.error).toHaveBeenCalledTimes(1);
        spy.mockRestore();
    });
});
