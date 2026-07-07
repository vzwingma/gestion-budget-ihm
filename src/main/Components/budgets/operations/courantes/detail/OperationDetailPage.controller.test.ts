import {
    handleDateOperationFromAction,
    handleOperationEditionClick,
    handleValidateOperationForm,
    isInCreateMode,
    isInEditMode
} from './OperationDetailPage.controller.ts';
import {BUSINESS_GUID} from '../../../../../Utils/AppBusinessEnums.constants.ts';
import {saveOperation, saveOperationIntercompte} from './OperationDetailPage.extservices.ts';

const mockCreateEmptyErrors = vi.fn();

vi.mock('./OperationDetailPage.constants.ts', () => ({
    OPERATION_EDITION_FORM: {
        INPUT: '_INPUT',
        VALUE: 'OPERATION_VALUE',
        LIBELLE: 'OPERATION_LIBELLE',
        CATEGORIE_TYPE: 'OPERATION_TYPE_CATEGORIE',
        DATE_OPERATION: 'OPERATION_DATE_OPERATION',
        MENSUALITE: 'OPERATION_MENSUALITE',
        DATE_FIN: 'OPERATION_DATE_FIN'
    },
    createEmptyErrors: () => mockCreateEmptyErrors()
}));

vi.mock('./OperationDetailPage.extservices.ts', () => ({
    saveOperation: vi.fn(),
    saveOperationIntercompte: vi.fn()
}));

vi.mock('../../recurrentes/details/subcomponents/OperationRecurrenteDetailDateFin.component.tsx', () => ({
    validateFormDateFinPeriode: vi.fn()
}));

vi.mock('./subcomponents/OperationDetailLibelle.controller.ts', () => ({
    validateDescription: vi.fn()
}));

vi.mock('./subcomponents/OperationDetailCategories.component.tsx', () => ({
    validateFormCategories: vi.fn()
}));

vi.mock('./subcomponents/OperationDetailIntercompte.component.tsx', () => ({
    validateFormTransfertIntercompte: vi.fn()
}));

vi.mock('./subcomponents/OperationDetailValeur.component.tsx', () => ({
    validateFormMontant: vi.fn()
}));

describe('OperationDetailPage.controller', () => {

    beforeEach(() => {
        vi.clearAllMocks();
    });

    test('ouvre le formulaire en click sur VALUE', () => {
        const editForm = {
            value: false,
            libelle: false,
            dateOperation: false,
            mensualite: false,
            dateFin: false,
            categorieType: false,
            formValidationEnabled: false
        };
        const openEditForm = vi.fn();

        handleOperationEditionClick(
            {target: {id: 'OPERATION_VALUE'}, type: 'click'},
            {operation: {}, budget: {actif: true}} as any,
            {} as any,
            editForm as any,
            openEditForm,
            vi.fn() as any,
            vi.fn()
        );

        expect(openEditForm).toHaveBeenCalledTimes(1);
    });

    test('met à jour la date via action', () => {
        const setEditOperation = vi.fn();
        const editOperation = {id: 'op1'};

        handleDateOperationFromAction(editOperation as any, setEditOperation as any);

        expect(setEditOperation).toHaveBeenCalledWith(editOperation);
    });

    test('sauvegarde une opération classique sans erreurs', () => {
        mockCreateEmptyErrors.mockReturnValue({libelle: null, montant: null});

        handleValidateOperationForm(
            {id: 'op1', autresInfos: {dateOperation: null}} as any,
            {id: 'b1'} as any,
            {ssCategorie: {id: 'ss-1'}, intercompte: null, autresInfos: {dateOperation: new Date('2026-02-01')}} as any,
            {
                value: true,
                libelle: true,
                dateOperation: true,
                mensualite: true,
                dateFin: false,
                categorieType: true
            } as any,
            vi.fn() as any,
            vi.fn()
        );

        expect(saveOperation).toHaveBeenCalledTimes(1);
        expect(saveOperationIntercompte).not.toHaveBeenCalled();
    });

    test('sauvegarde une opération intercompte en mode création', () => {
        mockCreateEmptyErrors.mockReturnValue({libelle: null, montant: null});

        handleValidateOperationForm(
            {id: 'op1', autresInfos: {dateOperation: null}} as any,
            {id: 'b1'} as any,
            {ssCategorie: {id: BUSINESS_GUID.SS_CAT_VIREMENT_INTERNE}, intercompte: 'c2', autresInfos: {dateOperation: new Date('2026-02-01')}} as any,
            {
                value: true,
                libelle: true,
                dateOperation: true,
                mensualite: true,
                dateFin: false,
                categorieType: true
            } as any,
            vi.fn() as any,
            vi.fn()
        );

        expect(saveOperationIntercompte).toHaveBeenCalledTimes(1);
    });

    test('expose les états create/edit mode', () => {
        expect(isInEditMode({value: true} as any)).toBeTruthy();
        expect(isInEditMode({value: false, libelle: false, dateOperation: false, mensualite: false, dateFin: false, categorieType: false} as any)).toBeFalsy();
        expect(isInCreateMode({value: true, libelle: true, dateOperation: true, mensualite: true, categorieType: true} as any)).toBeTruthy();
        expect(isInCreateMode({value: true, libelle: false, dateOperation: true, mensualite: true, categorieType: true} as any)).toBeFalsy();
    });
});
