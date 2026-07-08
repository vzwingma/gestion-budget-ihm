import {handleOperationAction} from './OperationDetailActions.controller.ts';
import {OPERATION_ETATS_ENUM} from '../../../../../../Utils/AppBusinessEnums.constants.ts';
import {saveOperation} from '../OperationDetailPage.extservices.ts';
import {toast} from 'react-toastify';

vi.mock('../OperationDetailPage.extservices.ts', () => ({
    saveOperation: vi.fn()
}));

vi.mock('react-toastify', () => ({
    toast: {
        warn: vi.fn()
    }
}));

describe('OperationDetailActions.controller', () => {

    beforeEach(() => {
        vi.clearAllMocks();
    });

    test('ignore le click si target absent', () => {
        handleOperationAction({target: null}, {} as any, {} as any, false, {} as any, vi.fn(), vi.fn(), vi.fn() as any);

        expect(saveOperation).not.toHaveBeenCalled();
    });

    test('ouvre la modale en suppression à confirmer', () => {
        const setShowModale = vi.fn();

        handleOperationAction(
            {target: {id: 'SUPPRIMEE_A_CONFIRMER'}},
            {} as any,
            {} as any,
            false,
            {} as any,
            vi.fn(),
            vi.fn(),
            setShowModale as any
        );

        expect(setShowModale).toHaveBeenCalledWith(true);
    });

    test('ferme la modale sur ANNULER', () => {
        const setShowModale = vi.fn();

        handleOperationAction(
            {target: {id: 'ANNULER'}},
            {} as any,
            {} as any,
            false,
            {} as any,
            vi.fn(),
            vi.fn(),
            setShowModale as any
        );

        expect(setShowModale).toHaveBeenCalledWith(false);
    });

    test('en mode création, met à jour la date et l état', () => {
        const operation = {etat: OPERATION_ETATS_ENUM.PREVUE, autresInfos: {dateOperation: null}} as any;
        const editOperation = {autresInfos: {dateOperation: new Date('2026-02-01')}} as any;
        const handleDateOperationFromAction = vi.fn();

        handleOperationAction(
            {target: {id: OPERATION_ETATS_ENUM.REALISEE}},
            operation,
            {actif: true} as any,
            true,
            editOperation,
            handleDateOperationFromAction,
            vi.fn(),
            vi.fn() as any
        );

        expect(operation.etat).toBe(OPERATION_ETATS_ENUM.REALISEE);
        expect(handleDateOperationFromAction).toHaveBeenCalledTimes(1);
    });

    test('en mode édition sauvegarde si budget actif et état différent', () => {
        const operation = {id: 'op1', etat: OPERATION_ETATS_ENUM.PREVUE, autresInfos: {dateOperation: null}} as any;

        handleOperationAction(
            {target: {id: OPERATION_ETATS_ENUM.REALISEE}},
            operation,
            {id: 'b1', actif: true} as any,
            false,
            {} as any,
            vi.fn(),
            vi.fn(),
            vi.fn() as any
        );

        expect(saveOperation).toHaveBeenCalledTimes(1);
    });

    test('en mode édition refuse la modification si budget clos', () => {
        const operation = {id: 'op1', etat: OPERATION_ETATS_ENUM.PREVUE, autresInfos: {dateOperation: null}} as any;

        handleOperationAction(
            {target: {id: OPERATION_ETATS_ENUM.REALISEE}},
            operation,
            {id: 'b1', actif: false} as any,
            false,
            {} as any,
            vi.fn(),
            vi.fn(),
            vi.fn() as any
        );

        expect(saveOperation).not.toHaveBeenCalled();
        expect(toast.warn).toHaveBeenCalledTimes(1);
    });
});
