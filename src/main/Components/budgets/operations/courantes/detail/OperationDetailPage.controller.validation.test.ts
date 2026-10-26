import { beforeEach, describe, expect, test, vi } from 'vitest';

import {
    handleOperationEditionClick,
    handleValidateOperationForm,
    isInCreateMode,
    isInEditMode,
    validateForm
} from './OperationDetailPage.controller.ts';
import { createEmptyEditForm, createEmptyErrors, EditFormProps } from './OperationDetailPage.constants.ts';
import { saveOperation, saveOperationIntercompte } from './OperationDetailPage.extservices.ts';
import BudgetMensuelModel from '../../../../../Models/budgets/BudgetMensuel.model.ts';
import { createNewOperation } from '../../../../../Models/budgets/Operation.model.ts';
import { cloneOperation } from '../../../../../Models/budgets/OperationEdition.model.ts';
import { BUSINESS_GUID, TYPES_OPERATION_ENUM } from '../../../../../Utils/AppBusinessEnums.constants.ts';

/**
 * Compléments de OperationDetailPage.controller.test.ts : ici les validateurs des sous-composants sont RÉELS
 * (le fichier d'origine les mocke) ; seul `extservices` est mocké. Caractérise le gestionnaire de clic/clavier
 * et la validation du formulaire d'édition d'une opération.
 */
vi.mock('./OperationDetailPage.extservices.ts', () => ({
    saveOperation: vi.fn(),
    saveOperationIntercompte: vi.fn()
}));

function budget(actif = true) {
    const b = new BudgetMensuelModel('compte-1_2026_10', 'Budget');
    b.actif = actif;
    return b;
}

/** Opération en cours + son clone d'édition (valeur saisie en chaîne) */
function operations(overrides: { libelle?: string; valeur?: number; ssCategorieId?: string | null } = {}) {
    const operation = createNewOperation();
    operation.id = 'op-1';
    operation.libelle = overrides.libelle ?? 'Courses';
    operation.valeur = overrides.valeur ?? -50;
    operation.categorie = { id: 'cat-1', libelle: 'Alimentation' };
    operation.ssCategorie = { id: overrides.ssCategorieId === undefined ? 'ss-1' : overrides.ssCategorieId, libelle: 'Courses', type: operation.ssCategorie.type };
    const editOperation = cloneOperation(operation);
    return { operation, editOperation };
}

const formOuvert = (surcharge: Partial<EditFormProps> = {}): EditFormProps => ({ ...createEmptyEditForm(false), ...surcharge });

/** Événement clavier/clic minimal : cible = élément DOM fictif (avec chaîne de parents) */
const evt = (target: unknown, type = 'click', code = '') => ({ target, type, code });

describe('OperationDetailPage.controller - handleOperationEditionClick', () => {

    const setErrors = vi.fn();
    const onOperationUpdate = vi.fn();
    const openEditForm = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        vi.spyOn(console, 'error').mockImplementation(() => undefined);
    });

    function appeler(event: unknown, editForm: EditFormProps, budgetCourant = budget()) {
        const { operation, editOperation } = operations();
        handleOperationEditionClick(event, { operation, budget: budgetCourant }, editOperation, editForm, openEditForm, setErrors, onOperationUpdate);
    }

    test.each([
        ['OPERATION_VALUE', 'value'],
        ['OPERATION_LIBELLE', 'libelle'],
        ['OPERATION_TYPE_CATEGORIE', 'categorieType'],
        ['OPERATION_DATE_OPERATION', 'dateOperation'],
        ['OPERATION_MENSUALITE', 'mensualite'],
        ['OPERATION_DATE_FIN', 'dateFin']
    ] as const)('clic sur l\'élément %s : le drapeau %s passe à true et le formulaire est (ré)ouvert', (id, drapeau) => {
        const editForm = formOuvert();

        appeler(evt({ id }), editForm);

        expect(editForm[drapeau]).toBe(true);
        expect(openEditForm).toHaveBeenCalledTimes(1);
        expect(openEditForm).toHaveBeenCalledWith(editForm);
    });

    test('un seul drapeau est modifié par clic', () => {
        const editForm = formOuvert();

        appeler(evt({ id: 'OPERATION_LIBELLE' }), editForm);

        expect(editForm).toEqual({ ...createEmptyEditForm(false), libelle: true });
    });

    test('clic sur un enfant sans id : remonte au parent identifié', () => {
        const editForm = formOuvert();

        appeler(evt({ id: '', parentNode: { id: 'OPERATION_VALUE' } }), editForm);

        expect(editForm.value).toBe(true);
    });

    test('clic sur un élément d\'id inconnu : formulaire ré-émis mais aucun drapeau modifié', () => {
        const editForm = formOuvert();

        appeler(evt({ id: 'OPERATION_FORM' }), editForm);

        expect(editForm).toEqual(createEmptyEditForm(false));
        expect(openEditForm).toHaveBeenCalledTimes(1);
    });

    test('clic dans un champ de saisie (id se terminant par _INPUT) : ignoré', () => {
        const editForm = formOuvert();

        appeler(evt({ id: 'OPERATION_VALUE_INPUT' }), editForm);

        expect(editForm.value).toBe(false);
        expect(openEditForm).not.toHaveBeenCalled();
    });

    test('aucun id dans toute la chaîne de parents : rien ne se passe', () => {
        appeler(evt({ id: '', parentNode: { id: '', parentNode: null } }), formOuvert());

        expect(openEditForm).not.toHaveBeenCalled();
    });

    test('budget clos : le clic est ignoré', () => {
        const editForm = formOuvert();

        appeler(evt({ id: 'OPERATION_VALUE' }), editForm, budget(false));

        expect(editForm.value).toBe(false);
        expect(openEditForm).not.toHaveBeenCalled();
    });

    test('événement sans cible : ignoré', () => {
        appeler(evt(null), formOuvert());

        expect(openEditForm).not.toHaveBeenCalled();
    });

    test.each(['Enter', 'NumpadEnter'])('touche %s relâchée avec validation clavier activée : le formulaire est validé', (code) => {
        const { operation, editOperation } = operations();
        editOperation.libelle = 'Loyer';
        const editForm = formOuvert({ libelle: true, formValidationEnabled: true });

        handleOperationEditionClick(evt({ id: 'OPERATION_FORM' }, 'keyup', code), { operation, budget: budget() }, editOperation, editForm, openEditForm, setErrors, onOperationUpdate);

        expect(saveOperation).toHaveBeenCalledTimes(1);
        expect(saveOperation).toHaveBeenCalledWith(operation, expect.any(BudgetMensuelModel), onOperationUpdate);
        expect(openEditForm).not.toHaveBeenCalled();
    });

    test('Entrée avec validation clavier désactivée : pas de validation (traité comme un clic sur l\'élément)', () => {
        const editForm = formOuvert({ libelle: true, formValidationEnabled: false });

        appeler(evt({ id: 'OPERATION_FORM' }, 'keyup', 'Enter'), editForm);

        expect(saveOperation).not.toHaveBeenCalled();
        expect(openEditForm).toHaveBeenCalledTimes(1);
    });

    test('Entrée en dehors d\'un keyup (clic) avec validation clavier activée : pas de validation', () => {
        const editForm = formOuvert({ libelle: true, formValidationEnabled: true });

        appeler(evt({ id: 'OPERATION_FORM' }, 'click', 'Enter'), editForm);

        expect(saveOperation).not.toHaveBeenCalled();
    });

    test('autre touche (Tab) relâchée : traitée comme un clic sans validation', () => {
        const editForm = formOuvert({ libelle: true, formValidationEnabled: true });

        appeler(evt({ id: 'OPERATION_LIBELLE' }, 'keyup', 'Tab'), editForm);

        expect(saveOperation).not.toHaveBeenCalled();
        expect(openEditForm).toHaveBeenCalledTimes(1);
    });
});

describe('OperationDetailPage.controller - validateForm / handleValidateOperationForm (validateurs réels)', () => {

    const setErrors = vi.fn();
    const onOperationUpdate = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        vi.spyOn(console, 'error').mockImplementation(() => undefined);
    });

    test('validateForm : formulaire valide -> aucune erreur, opération mise à jour depuis l\'édition', () => {
        const { operation, editOperation } = operations();
        editOperation.libelle = 'Loyer';
        editOperation.valeur = '12,5';
        const date = new Date('2026-03-15T00:00:00.000Z');
        editOperation.autresInfos.dateOperation = date;
        const errors = createEmptyErrors();

        validateForm(budget(), editOperation, operation, formOuvert({ value: true, libelle: true, dateOperation: true }), errors);

        expect(errors).toEqual(createEmptyErrors());
        expect(operation).toMatchObject({ libelle: 'Loyer', valeur: -12.5 });
        expect(operation.autresInfos.dateOperation).toBe(date);
    });

    test('validateForm : montant ignoré si le champ valeur n\'a pas été ouvert', () => {
        const { operation, editOperation } = operations();
        editOperation.valeur = 'n importe quoi';
        const errors = createEmptyErrors();

        validateForm(budget(), editOperation, operation, formOuvert({ libelle: true }), errors);

        expect(errors.valeur).toBeNull();
        expect(operation.valeur).toBe(-50);
    });

    test('validateForm : date d\'opération toujours recopiée depuis l\'édition (même nulle), qu\'elle soit ouverte ou non', () => {
        const { operation, editOperation } = operations();
        operation.autresInfos.dateOperation = new Date('2026-01-01');
        editOperation.autresInfos.dateOperation = null;

        validateForm(budget(), editOperation, operation, formOuvert({ libelle: true }), createEmptyErrors());

        expect(operation.autresInfos.dateOperation).toBeNull();
    });

    test('validateForm : intercompte n\'est contrôlé qu\'en mode création', () => {
        const { operation, editOperation } = operations({ ssCategorieId: BUSINESS_GUID.SS_CAT_VIREMENT_INTERNE });
        editOperation.intercompte = null;

        const errorsEdition = createEmptyErrors();
        validateForm(budget(), editOperation, operation, formOuvert({ libelle: true }), errorsEdition);
        expect(errorsEdition.intercompte).toBeNull();

        const errorsCreation = createEmptyErrors();
        validateForm(budget(), editOperation, operation, createEmptyEditForm(true), errorsCreation);
        expect(errorsCreation.intercompte).toBe('Le champ Intercompte est obligatoire');
    });

    test('validateForm : date de fin antérieure au mois du budget -> erreur dateFin', () => {
        const { operation, editOperation } = operations();
        editOperation.mensualite = { ...editOperation.mensualite, dateFin: new Date('2026-01-01') };
        const errors = createEmptyErrors();

        validateForm(budget(), editOperation, operation, formOuvert({ dateFin: true }), errors);

        expect(errors.dateFin).toBe('La date de fin doit être supérieure ou égale au mois du budget');
    });

    test('handleValidateOperationForm : hors mode édition -> ne fait rien', () => {
        const { operation, editOperation } = operations();

        handleValidateOperationForm(operation, budget(), editOperation, createEmptyEditForm(false), setErrors, onOperationUpdate);

        expect(saveOperation).not.toHaveBeenCalled();
        expect(setErrors).not.toHaveBeenCalled();
    });

    test('handleValidateOperationForm : erreurs -> setErrors avec les messages, pas de sauvegarde', () => {
        const { operation, editOperation } = operations({ libelle: '', ssCategorieId: null });
        editOperation.libelle = '';

        handleValidateOperationForm(operation, budget(), editOperation, formOuvert({ libelle: true }), setErrors, onOperationUpdate);

        expect(setErrors).toHaveBeenCalledTimes(1);
        expect(setErrors).toHaveBeenCalledWith(expect.objectContaining({
            libelle: 'Le champ Description est obligatoire',
            categorie: 'Le champ Catégorie est obligatoire'
        }));
        expect(saveOperation).not.toHaveBeenCalled();
        expect(saveOperationIntercompte).not.toHaveBeenCalled();
    });

    test('handleValidateOperationForm : valide -> saveOperation(operation, budget, onOperationUpdate), sans toucher aux erreurs', () => {
        const { operation, editOperation } = operations();
        const budgetCourant = budget();

        handleValidateOperationForm(operation, budgetCourant, editOperation, formOuvert({ libelle: true }), setErrors, onOperationUpdate);

        expect(saveOperation).toHaveBeenCalledWith(operation, budgetCourant, onOperationUpdate);
        expect(setErrors).not.toHaveBeenCalled();
    });

    test('handleValidateOperationForm : virement interne en création -> saveOperationIntercompte avec le compte cible', () => {
        const { operation, editOperation } = operations({ ssCategorieId: BUSINESS_GUID.SS_CAT_VIREMENT_INTERNE });
        editOperation.intercompte = 'compte-2';
        editOperation.valeur = '30';
        editOperation.typeOperation = TYPES_OPERATION_ENUM.DEPENSE;
        const budgetCourant = budget();

        handleValidateOperationForm(operation, budgetCourant, editOperation, createEmptyEditForm(true), setErrors, onOperationUpdate);

        expect(saveOperationIntercompte).toHaveBeenCalledWith(operation, budgetCourant, 'compte-2', onOperationUpdate);
        expect(saveOperation).not.toHaveBeenCalled();
        expect(operation.intercompte).toBe('compte-2');
    });

    test('handleValidateOperationForm : virement interne hors création -> saveOperation classique', () => {
        const { operation, editOperation } = operations({ ssCategorieId: BUSINESS_GUID.SS_CAT_VIREMENT_INTERNE });

        handleValidateOperationForm(operation, budget(), editOperation, formOuvert({ libelle: true }), setErrors, onOperationUpdate);

        expect(saveOperation).toHaveBeenCalledTimes(1);
        expect(saveOperationIntercompte).not.toHaveBeenCalled();
    });

    test('isInEditMode / isInCreateMode : un seul champ ouvert = édition ; tous (hors dateFin/categories) = création', () => {
        expect(isInEditMode(createEmptyEditForm(false))).toBe(false);
        expect(isInEditMode(formOuvert({ dateFin: true }))).toBe(true);
        expect(isInEditMode(formOuvert({ categorieType: true }))).toBe(true);
        expect(isInCreateMode(formOuvert({ value: true, libelle: true }))).toBe(false);
        expect(isInCreateMode(createEmptyEditForm(true))).toBe(true);
    });
});
