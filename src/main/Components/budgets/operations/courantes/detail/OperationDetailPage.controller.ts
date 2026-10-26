import OperationEditionModel, { cloneOperationEdition } from "../../../../../Models/budgets/OperationEdition.model.ts";
import BudgetMensuelModel from "../../../../../Models/budgets/BudgetMensuel.model.ts";
import OperationModel, { cloneOperationModel } from "../../../../../Models/budgets/Operation.model.ts";
import CategorieOperationModel from "../../../../../Models/budgets/CategorieOperation.model.ts";
import SsCategorieOperationModel from "../../../../../Models/budgets/SsCategorieOperation.model.ts";
import {
    BUSINESS_GUID,
    OPERATION_ETATS_ENUM,
    PERIODES_MENSUALITE_ENUM,
    TYPES_CATEGORIES_OPERATION_ENUM,
    TYPES_OPERATION_ENUM
} from "../../../../../Utils/AppBusinessEnums.constants.ts";
import { getEventTargetId } from "../../../../../Utils/OperationData.utils.ts";
import {
    createEmptyErrors,
    EditFormProps,
    ErrorsFormProps,
    OPERATION_EDITION_FORM
} from "./OperationDetailPage.constants.ts";
import type { OPERATION_RECURRENTE_EDITION_FORM } from "../../recurrentes/details/OperationRecurrenteDetailPage.constants.ts";
import { saveOperation, saveOperationIntercompte } from "./OperationDetailPage.extservices.ts";
import { Dispatch, SetStateAction } from "react";
import { validateFormDateFinPeriode } from "../../shared/OperationRecurrenteDetailDateFin.component.tsx";
import { validateDescription } from "./subcomponents/OperationDetailLibelle.controller.ts";
import { validateFormCategories } from "./subcomponents/OperationDetailCategories.component.tsx";
import { validateFormTransfertIntercompte } from "./subcomponents/OperationDetailIntercompte.component.tsx";
import { validateFormMontant } from "./subcomponents/OperationDetailValeur.component.tsx";


interface OperationBudgetProps {
    operation: OperationModel;
    budget: BudgetMensuelModel;
}

/** Options facultatives de la validation du formulaire */
export interface ValidationOptions {
    /** Erreurs actuellement affichées : remises à zéro si le formulaire corrigé est valide */
    currentErrors?: ErrorsFormProps;
    /** Brouillon validé (copie de l'opération), transmis avant la sauvegarde pour pouvoir le propager au contexte après succès */
    onDraft?: (draft: OperationModel) => void;
}

/**
 * Event sur le clic d'une édition d'opération
 * @param event événement sur le clic d'une opération
 * @param operation  opération en cours
 * @param budget budget associé
 * @param editOperation opération en cours d'édition
 * @param editForm formulaire d'édition (non modifié : le nouvel état est transmis à `openEditForm`)
 * @param openEditForm fonction pour ouvrir le formulaire d'édition (reçoit une nouvelle copie du formulaire)
 * @param setErrors fonction pour mettre à jour les erreurs du formulaire
 * @param onOperationUpdate mise à jour de l'opération
 * @param options options de validation
 */
export function handleOperationEditionClick(event: any, { operation, budget }: OperationBudgetProps,
    editOperation: OperationEditionModel, editForm: EditFormProps, openEditForm: (editForm: EditFormProps) => void,
    setErrors: Dispatch<SetStateAction<ErrorsFormProps>>,
    onOperationUpdate: (budget: BudgetMensuelModel) => void,
    options?: ValidationOptions) {


    if (event.target !== null && event.target !== undefined && budget?.actif) {

        const idElement = getEventTargetId(event.target);
        const enterKeyPress = event.type === 'keyup' && (event.code === 'Enter' || event.code === 'NumpadEnter');
        // Validation du formulaire
        if (enterKeyPress && editForm.formValidationEnabled) {
            handleValidateOperationForm(operation, budget, editOperation, editForm, setErrors, onOperationUpdate, options);
        } else if (idElement !== null && idElement !== undefined && !idElement.endsWith(OPERATION_EDITION_FORM.INPUT)) {
            openEditForm(openField(editForm, idElement));
        }
    }
}

/**
 * Ouvre en édition le champ identifié par l'id DOM cliqué (contrat : ids `OPERATION_*`)
 * @param editForm formulaire d'édition courant (non modifié)
 * @param idElement id de l'élément cliqué
 * @returns nouvelle copie du formulaire (champ ouvert si l'id est connu)
 */
export function openField(editForm: EditFormProps, idElement: string): EditFormProps {
    const next = { ...editForm };
    switch (idElement) {
        case OPERATION_EDITION_FORM.VALUE:
            next.value = true;
            break;
        case OPERATION_EDITION_FORM.LIBELLE:
            next.libelle = true;
            break;
        case OPERATION_EDITION_FORM.CATEGORIE_TYPE:
            next.categorieType = true;
            break;
        case OPERATION_EDITION_FORM.DATE_OPERATION:
            next.dateOperation = true;
            break;
        case OPERATION_EDITION_FORM.MENSUALITE:
            next.mensualite = true;
            break;
        case OPERATION_EDITION_FORM.DATE_FIN:
            next.dateFin = true;
            break;
        default:
            break;
    }
    return next;
}

/**
 * Applique l'état choisi (bouton d'action en mode création) sur l'opération en cours d'édition :
 * état + date d'opération (date du jour par défaut si réalisée, sinon aucune).
 *
 * @param valeurDate - Date d'opération à porter par l'édition.
 * @param etat - État choisi.
 * @param setEditOperation - La fonction de mise à jour de l'état pour le modèle d'opération.
 */
export function handleDateOperationFromAction(valeurDate: Date | null, etat: OPERATION_ETATS_ENUM, setEditOperation: Dispatch<SetStateAction<OperationEditionModel>>) {
    setEditOperation((editOperation) => applyEtatInCreation(editOperation, etat, valeurDate));
}

/**
 * Copie de l'opération en édition avec l'état et la date d'opération choisis
 */
export function applyEtatInCreation(editOperation: OperationEditionModel, etat: OPERATION_ETATS_ENUM, dateOperation: Date | null): OperationEditionModel {
    const next = cloneOperationEdition(editOperation);
    next.etat = etat;
    next.autresInfos.dateOperation = dateOperation;
    return next;
}


/* ------------------------------------------------------------------------------------------------
 * Mise à jour (pure) de l'opération en édition : chaque fonction renvoie une NOUVELLE copie
 * ---------------------------------------------------------------------------------------------- */

/**
 * Applique la catégorie parente (et la sous-catégorie) sur l'opération en édition
 * @param editOperation opération en édition
 * @param ssCat sous catégorie sélectionnée
 */
export function applyCategorieParente(editOperation: OperationEditionModel, ssCat: SsCategorieOperationModel): OperationEditionModel {
    const next = cloneOperationEdition(editOperation);
    if (ssCat.categorieParente !== null && ssCat.categorieParente !== undefined) {
        next.categorie.id = ssCat.categorieParente.id;
        next.categorie.libelle = ssCat.categorieParente.libelle;
    }
    next.ssCategorie.id = ssCat.id;
    next.ssCategorie.libelle = ssCat.libelle;
    next.ssCategorie.type = ssCat.type;
    return next;
}

/**
 * Si type Rentrée d'argent, alors type opération = Crédit
 */
export function applyRentreeArgent(editOperation: OperationEditionModel): OperationEditionModel {
    const next = cloneOperationEdition(editOperation);
    next.typeOperation = TYPES_OPERATION_ENUM.CREDIT;
    next.ssCategorie.type = TYPES_CATEGORIES_OPERATION_ENUM.REVENUS;
    return next;
}

/**
 * Si type Actifs Invest, alors type opération = Crédit, période mensuelle
 */
export function applyActifInvest(editOperation: OperationEditionModel): OperationEditionModel {
    const next = cloneOperationEdition(editOperation);
    next.typeOperation = TYPES_OPERATION_ENUM.CREDIT;
    next.ssCategorie.type = TYPES_CATEGORIES_OPERATION_ENUM.ECONOMIES;
    next.mensualite.periode = PERIODES_MENSUALITE_ENUM.MENSUELLE;
    return next;
}

/**
 * Cas par défaut : type opération = Dépense
 */
export function applyDefaut(editOperation: OperationEditionModel): OperationEditionModel {
    const next = cloneOperationEdition(editOperation);
    next.typeOperation = TYPES_OPERATION_ENUM.DEPENSE;
    return next;
}

/**
 * Validation d'une catégorie dans le formulaire
 * @param editOperation opération en édition
 * @param ssCatId id de la sous catégorie
 * @param listeCategories référentiel des catégories
 * @returns nouvelle opération en édition (la même référence si la sous-catégorie est inconnue)
 */
export function fillCategorieForm(editOperation: OperationEditionModel, ssCatId: string, listeCategories: CategorieOperationModel[]): OperationEditionModel {
    const ssCat = listeCategories
        .flatMap((cat: CategorieOperationModel) => cat.listeSSCategories ?? [])
        .find((ssCat: SsCategorieOperationModel) => ssCat?.id === ssCatId)
    if (ssCat === undefined) {
        return editOperation;
    }
    const avecCategorie = applyCategorieParente(editOperation, ssCat);

    /** Adaptation sur la sélection de catégorie selon le type de catégorie parente **/
    if (BUSINESS_GUID.CAT_RENTREE_ARGENT === ssCat.categorieParente?.id) {
        return applyRentreeArgent(avecCategorie);
    }
    if (BUSINESS_GUID.CAT_ACTIFS_INVEST === ssCat.categorieParente?.id) {
        return applyActifInvest(avecCategorie);
    }
    return applyDefaut(avecCategorie);
}

/**
 * Mise à jour (immuable) de l'opération en édition suite à la saisie d'un champ du formulaire
 * @param editOperation opération en édition
 * @param field champ du formulaire à mettre à jour
 * @param value valeur du champ
 * @param listeCategories référentiel des catégories
 * @returns nouvelle opération en édition
 */
export function fillOperationField(editOperation: OperationEditionModel, field: OPERATION_EDITION_FORM | OPERATION_RECURRENTE_EDITION_FORM,
    value: string, listeCategories: CategorieOperationModel[]): OperationEditionModel {
    if (field === OPERATION_EDITION_FORM.CATEGORIE) {
        return value === "" ? editOperation : fillCategorieForm(editOperation, value, listeCategories);
    }
    const next = cloneOperationEdition(editOperation);
    const hasValue = value !== null && value !== undefined && value !== "";
    switch (field) {
        case OPERATION_EDITION_FORM.LIBELLE:
            next.libelle = value;
            break;
        case OPERATION_EDITION_FORM.DATE_OPERATION:
            next.autresInfos.dateOperation = hasValue ? new Date(Date.parse(value)) : null;
            break;
        case OPERATION_EDITION_FORM.VALUE:
            next.valeur = value;
            break;
        case OPERATION_EDITION_FORM.MENSUALITE:
            next.mensualite.periode = Object.values(PERIODES_MENSUALITE_ENUM).find((periode: PERIODES_MENSUALITE_ENUM) => periode === value) || Object.values(PERIODES_MENSUALITE_ENUM)[0];
            break;
        case OPERATION_EDITION_FORM.DATE_FIN:
            next.mensualite.dateFin = hasValue ? new Date(Date.parse(value)) : null;
            break;
        case OPERATION_EDITION_FORM.CATEGORIE_TYPE:
            next.ssCategorie.type = Object.values(TYPES_CATEGORIES_OPERATION_ENUM).find((type: TYPES_CATEGORIES_OPERATION_ENUM) => type === value);
            break;
        case OPERATION_EDITION_FORM.INTERCOMPTES:
            next.intercompte = value;
            break;
        default:
            break;
    }
    return next;
}


/**
* Validation du formulaire d'opération.
*
* Écrit le résultat de la validation dans `operation` : à appeler avec un brouillon (copie), jamais avec l'opération du contexte.
*
* @param {BudgetMensuelModel} budget - Le budget associé.
* @param {OperationEditionModel} editOperation - Le modèle d'opération en cours d'édition.
* @param {OperationModel} operation - Le brouillon d'opération à valider.
* @param {EditFormProps} editForm - Les propriétés du formulaire d'édition.
* @param {ErrorsFormProps} errors - Les erreurs du formulaire.
*/
export function validateForm(budget: BudgetMensuelModel, editOperation: OperationEditionModel, operation: OperationModel, editForm: EditFormProps, errors: ErrorsFormProps) {
    // Description
    validateDescription(editOperation, operation, errors);

    // Valeur
    validateFormMontant(editOperation, operation, editForm, errors);
    // Etat et sens (portés par l'édition : choix des boutons d'action en création, de la catégorie)
    operation.etat = editOperation.etat;
    operation.typeOperation = editOperation.typeOperation;
    // DateOperation
    operation.autresInfos.dateOperation = editOperation.autresInfos.dateOperation;
    // Période (et date de fin éventuelle) : l'édition en est la source
    if (editOperation.mensualite) {
        operation.mensualite = { ...operation.mensualite, ...editOperation.mensualite };
    }
    // DateFin
    validateFormDateFinPeriode(budget, editOperation, operation, editForm, errors);

    // Catégorie / ssCatégorie
    validateFormCategories(editOperation, operation, errors);
    // Intercompte
    if (isInCreateMode(editForm)) {
        validateFormTransfertIntercompte(editOperation, editOperation.intercompte, operation, errors);
    }
}


/**
 * Gère la validation du formulaire d'opération.
 *
 * La validation s'effectue sur une copie (brouillon) de l'opération : l'opération du contexte n'est modifiée ni par
 * une validation en échec ni par une validation réussie (le brouillon est transmis via `options.onDraft`).
 *
 * @param {OperationModel} operation - Le modèle de l'opération à valider.
 * @param {BudgetMensuelModel} budget - Le modèle du budget mensuel associé.
 * @param {OperationModel} editOperation - Le modèle de l'opération en cours d'édition.
 * @param {EditFormProps} editForm - Les propriétés du formulaire d'édition.
 * @param {React.Dispatch<React.SetStateAction<ErrorsFormProps>>} setErrors - Fonction pour mettre à jour l'état des erreurs du formulaire.
 * @param onOperationUpdate - Fonction pour mettre à jour l'opération.
 * @param options - Options (erreurs affichées, callback du brouillon)
 */
export function handleValidateOperationForm(operation: OperationModel, budget: BudgetMensuelModel, editOperation: OperationEditionModel,
    editForm: EditFormProps, setErrors: Dispatch<SetStateAction<ErrorsFormProps>>,
    onOperationUpdate: (budget: BudgetMensuelModel) => void,
    options?: ValidationOptions) {

    if (isInEditMode(editForm)) {
        const draft = cloneOperationModel(operation);
        const errors = createEmptyErrors();
        validateForm(budget, editOperation, draft, editForm, errors);

        if (hasAnyError(errors)) {
            console.error("Erreurs présentes dans le formulaire", errors)
            setErrors(errors);
        } else {
            // Formulaire corrigé : les erreurs précédemment affichées sont effacées
            if (options?.currentErrors && hasAnyError(options.currentErrors)) {
                setErrors(createEmptyErrors());
            }
            options?.onDraft?.(draft);
            if (editOperation.ssCategorie.id === BUSINESS_GUID.SS_CAT_VIREMENT_INTERNE && isInCreateMode(editForm)) {
                // Create Update Opération Intercomptes
                saveOperationIntercompte(draft, budget, editOperation.intercompte, onOperationUpdate);
            } else {
                // Create Update Opération
                saveOperation(draft, budget, onOperationUpdate);
            }
        }
    }
}

/** Au moins une erreur renseignée ? */
function hasAnyError(errors: ErrorsFormProps): boolean {
    return Object.values(errors ?? {}).some((error) => error !== null && error !== undefined);
}


/**
 * Test si en mode édition d'au moins un champ
 * @returns {boolean}
 */
export function isInEditMode(editForm: EditFormProps): boolean {
    return editForm.value || editForm.libelle || editForm.dateOperation || editForm.mensualite || editForm.dateFin || editForm.categorieType;
}

/**
 * Test si en mode édition d'au moins un champ
 * @returns {boolean}
 */
export function isInCreateMode(editForm: EditFormProps): boolean {
    return editForm.value && editForm.libelle && editForm.dateOperation && editForm.mensualite && editForm.categorieType;
}
