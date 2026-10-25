import type { Mock } from 'vitest';
import {saveOperation, saveOperationIntercompte, fetchLibellesOperationsCompte} from './OperationDetailPage.extservices.ts';
import {call} from '../../../../../Services/ClientHTTP.service.ts';
import {toast} from 'react-toastify';
import {v7 as uuid} from 'uuid';

vi.mock('../../../../../Services/ClientHTTP.service.ts', () => ({
    call: vi.fn()
}));

vi.mock('uuid', () => ({
    v7: vi.fn()
}));

vi.mock('react-toastify', () => ({
    toast: {
        success: vi.fn(),
        error: vi.fn(),
        warn: vi.fn()
    }
}));

const flushPromises = () => new Promise(resolve => setTimeout(resolve, 0));

describe('OperationDetailPage.extservices', () => {

    beforeEach(() => {
        vi.clearAllMocks();
        (uuid as Mock).mockReturnValue('op-created-id');
    });

    test('crée une opération sur budget actif', async () => {
        const onOperationUpdate = vi.fn();
        const operation = {id: '-1', etat: 'REALISEE'} as any;
        const budget = {id: 'b1', actif: true} as any;
        (call as Mock).mockResolvedValue({id: 'b1-updated'});

        saveOperation(operation, budget, onOperationUpdate);
        await flushPromises();

        expect(operation.id).toBe('op-created-id');
        expect(call).toHaveBeenCalledTimes(1);
        expect(onOperationUpdate).toHaveBeenCalledWith({id: 'b1-updated'});
        expect(toast.success).toHaveBeenCalledTimes(1);
    });

    test('refuse la sauvegarde sur budget clos', () => {
        saveOperation({id: 'op-1', etat: 'REALISEE'} as any, {id: 'b1', actif: false} as any, vi.fn());

        expect(call).not.toHaveBeenCalled();
        expect(toast.warn).toHaveBeenCalledTimes(1);
    });

    test('retourne une erreur si compte cible absent pour intercompte', () => {
        saveOperationIntercompte({id: 'op-1'} as any, {id: 'b1', actif: true} as any, null, vi.fn());

        expect(call).not.toHaveBeenCalled();
        expect(toast.error).toHaveBeenCalledTimes(1);
    });

    test('charge, trie et déduplique les libellés d opérations', async () => {
        const duplicate = {libelle: 'Alpha'};
        (call as Mock).mockResolvedValue([
            {libelle: 'Zulu'},
            duplicate,
            duplicate,
            {libelle: 'Beta'}
        ]);

        await expect(fetchLibellesOperationsCompte('c1')).resolves.toEqual([
            {libelle: 'Alpha'},
            {libelle: 'Beta'},
            {libelle: 'Zulu'}
        ]);
        expect((call as Mock).mock.calls[0][3]).toEqual(['c1']);
    });

    test('libellés : log puis rejet en cas d erreur', async () => {
        const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
        (call as Mock).mockRejectedValue(new Error('ko'));

        await expect(fetchLibellesOperationsCompte('c1')).rejects.toThrow('ko');
        expect(spy).toHaveBeenCalled();
        spy.mockRestore();
    });
});
