import {
    handleDateOperationFromAction,
    handleOperationRecurrenteEditionClick,
    handleValidateOperationForm,
    isInEditMode
} from './OperationRecurrenteDetailPage.controller.ts';
import {saveOperation} from '../../courantes/detail/OperationDetailPage.extservices.ts';

const mockCreateEmptyErrors = jest.fn();

jest.mock('./OperationRecurrenteDetailPage.constants.ts', () => ({
    OPERATION_RECURRENTE_EDITION_FORM: {
        INPUT: '_INPUT',
        DATE_FIN: 'OPERATION_DATE_FIN'
    },
    createEmptyErrors: () => mockCreateEmptyErrors()
}));

jest.mock('../../courantes/detail/OperationDetailPage.extservices.ts', () => ({
    saveOperation: jest.fn()
}));

jest.mock('./subcomponents/OperationRecurrenteDetailDateFin.component.tsx', () => ({
    validateFormDateFinPeriode: jest.fn()
}));

describe('OperationRecurrenteDetailPage.controller', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('gère la mise à jour de date via action', () => {
        const setEditOperation = jest.fn();
        const editOperation = {id: 'op1'};

        handleDateOperationFromAction(editOperation as any, setEditOperation as any);

        expect(setEditOperation).toHaveBeenCalledWith(editOperation);
    });

    test('ouvre le formulaire en cliquant sur DATE_FIN', () => {
        const editForm = {dateFin: false, formValidationEnabled: false};
        const openEditForm = jest.fn();

        handleOperationRecurrenteEditionClick(
            {target: {id: 'OPERATION_DATE_FIN'}, type: 'click'},
            {operation: {}, budget: {actif: true}} as any,
            {} as any,
            editForm as any,
            openEditForm,
            jest.fn() as any,
            jest.fn()
        );

        expect(openEditForm).toHaveBeenCalledTimes(1);
    });

    test('valide et sauvegarde si pas d erreurs', () => {
        mockCreateEmptyErrors.mockReturnValue({dateFin: null, libelle: null});

        handleValidateOperationForm(
            {id: 'op1'} as any,
            {id: 'b1'} as any,
            {} as any,
            {dateFin: true} as any,
            jest.fn() as any,
            jest.fn()
        );

        expect(saveOperation).toHaveBeenCalledTimes(1);
    });

    test('retourne true uniquement si le mode édition est actif', () => {
        expect(isInEditMode({dateFin: true} as any)).toBeTruthy();
        expect(isInEditMode({dateFin: false} as any)).toBeFalsy();
    });
});
