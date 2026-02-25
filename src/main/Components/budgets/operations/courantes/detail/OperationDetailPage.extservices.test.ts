import {saveOperation, saveOperationIntercompte, getLibellesOperationsCompte} from './OperationDetailPage.extservices.ts';
import {call} from '../../../../../Services/ClientHTTP.service.ts';
import {toast} from 'react-toastify';
import {v7 as uuid} from 'uuid';

jest.mock('../../../../../Services/ClientHTTP.service.ts', () => ({
    call: jest.fn()
}));

jest.mock('uuid', () => ({
    v7: jest.fn()
}));

jest.mock('react-toastify', () => ({
    toast: {
        success: jest.fn(),
        error: jest.fn(),
        warn: jest.fn()
    }
}));

const flushPromises = () => new Promise(resolve => setTimeout(resolve, 0));

describe('OperationDetailPage.extservices', () => {

    beforeEach(() => {
        jest.clearAllMocks();
        (uuid as jest.Mock).mockReturnValue('op-created-id');
    });

    test('crée une opération sur budget actif', async () => {
        const onOperationUpdate = jest.fn();
        const operation = {id: '-1', etat: 'REALISEE'} as any;
        const budget = {id: 'b1', actif: true} as any;
        (call as jest.Mock).mockResolvedValue({id: 'b1-updated'});

        saveOperation(operation, budget, onOperationUpdate);
        await flushPromises();

        expect(operation.id).toBe('op-created-id');
        expect(call).toHaveBeenCalledTimes(1);
        expect(onOperationUpdate).toHaveBeenCalledWith({id: 'b1-updated'});
        expect(toast.success).toHaveBeenCalledTimes(1);
    });

    test('refuse la sauvegarde sur budget clos', () => {
        saveOperation({id: 'op-1', etat: 'REALISEE'} as any, {id: 'b1', actif: false} as any, jest.fn());

        expect(call).not.toHaveBeenCalled();
        expect(toast.warn).toHaveBeenCalledTimes(1);
    });

    test('retourne une erreur si compte cible absent pour intercompte', () => {
        saveOperationIntercompte({id: 'op-1'} as any, {id: 'b1', actif: true} as any, null, jest.fn());

        expect(call).not.toHaveBeenCalled();
        expect(toast.error).toHaveBeenCalledTimes(1);
    });

    test('charge, trie et déduplique les libellés d opérations', async () => {
        const setListeLibellesOperation = jest.fn();
        const duplicate = {libelle: 'Alpha'};
        (call as jest.Mock).mockResolvedValue([
            {libelle: 'Zulu'},
            duplicate,
            duplicate,
            {libelle: 'Beta'}
        ]);

        getLibellesOperationsCompte('c1', setListeLibellesOperation as any);
        await flushPromises();

        expect(setListeLibellesOperation).toHaveBeenCalledTimes(1);
        expect(setListeLibellesOperation).toHaveBeenCalledWith([
            {libelle: 'Alpha'},
            {libelle: 'Beta'},
            {libelle: 'Zulu'}
        ]);
    });
});
