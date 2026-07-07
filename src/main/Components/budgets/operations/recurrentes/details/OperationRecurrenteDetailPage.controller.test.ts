import {
    handleDateOperationFromAction,
    handleOperationRecurrenteEditionClick,
    handleValidateOperationForm,
    isInEditMode
} from './OperationRecurrenteDetailPage.controller.ts';
import {saveOperation} from '../../courantes/detail/OperationDetailPage.extservices.ts';

const mockCreateEmptyErrors = vi.fn();

vi.mock('./OperationRecurrenteDetailPage.constants.ts', () => ({
    OPERATION_RECURRENTE_EDITION_FORM: {
        INPUT: '_INPUT',
        DATE_FIN: 'OPERATION_DATE_FIN'
    },
    createEmptyErrors: () => mockCreateEmptyErrors()
}));

vi.mock('../../courantes/detail/OperationDetailPage.extservices.ts', () => ({
    saveOperation: vi.fn()
}));

vi.mock('./subcomponents/OperationRecurrenteDetailDateFin.component.tsx', () => ({
    validateFormDateFinPeriode: vi.fn()
}));

describe('OperationRecurrenteDetailPage.controller', () => {

    beforeEach(() => {
        vi.clearAllMocks();
    });

    test('gère la mise à jour de date via action', () => {
        const setEditOperation = vi.fn();
        const editOperation = {id: 'op1'};

        handleDateOperationFromAction(editOperation as any, setEditOperation as any);

        expect(setEditOperation).toHaveBeenCalledWith(editOperation);
    });

    test('ouvre le formulaire en cliquant sur DATE_FIN', () => {
        const editForm = {dateFin: false, formValidationEnabled: false};
        const openEditForm = vi.fn();

        handleOperationRecurrenteEditionClick(
            {target: {id: 'OPERATION_DATE_FIN'}, type: 'click'},
            {operation: {}, budget: {actif: true}} as any,
            {} as any,
            editForm as any,
            openEditForm,
            vi.fn() as any,
            vi.fn()
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
            vi.fn() as any,
            vi.fn()
        );

        expect(saveOperation).toHaveBeenCalledTimes(1);
    });

    test('retourne true uniquement si le mode édition est actif', () => {
        expect(isInEditMode({dateFin: true} as any)).toBeTruthy();
        expect(isInEditMode({dateFin: false} as any)).toBeFalsy();
    });
});
