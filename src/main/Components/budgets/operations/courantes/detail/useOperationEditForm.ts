import { SyntheticEvent, useCallback, useRef, useState } from "react";
import { useCurrentBudget } from "../../../../../hooks/useBudgetContext.ts";
import BudgetMensuelModel from "../../../../../Models/budgets/BudgetMensuel.model.ts";
import CategorieOperationModel from "../../../../../Models/budgets/CategorieOperation.model.ts";
import OperationModel from "../../../../../Models/budgets/Operation.model.ts";
import OperationEditionModel, { cloneOperation, createNewOperationEdition } from "../../../../../Models/budgets/OperationEdition.model.ts";
import { OPERATION_ETATS_ENUM } from "../../../../../Utils/AppBusinessEnums.constants.ts";
import {
    createEmptyEditForm,
    createEmptyErrors,
    EditFormProps,
    ErrorsFormProps,
    OPERATION_EDITION_FORM
} from "./OperationDetailPage.constants.ts";
import {
    fillOperationField,
    handleDateOperationFromAction,
    handleOperationEditionClick,
    handleValidateOperationForm
} from "./OperationDetailPage.controller.ts";
import type { OPERATION_RECURRENTE_EDITION_FORM } from "../../recurrentes/details/OperationRecurrenteDetailPage.constants.ts";

/** Identifiant d'une opération en cours de création */
const ID_NOUVELLE_OPERATION = "-1";

export interface UseOperationEditFormProps {
    /** Référentiel des catégories (résolution d'une sous-catégorie sélectionnée) */
    listeCategories: CategorieOperationModel[];
    /** Callback du parent : budget mis à jour après sauvegarde */
    onOperationChange: (budget: BudgetMensuelModel) => void;
}

export interface UseOperationEditFormResult {
    /** Champs ouverts en édition */
    editForm: EditFormProps;
    /** Copie de travail de l'opération (immuable : remplacée à chaque modification, jamais mutée) */
    editOperation: OperationEditionModel;
    /** Erreurs de validation affichées */
    errors: ErrorsFormProps;
    /** Change à chaque (re)sélection d'une opération : clé de remise à zéro des champs non contrôlés */
    resetKey: number;
    /** Saisie d'un champ du formulaire */
    fillOperationForm: (field: OPERATION_EDITION_FORM | OPERATION_RECURRENTE_EDITION_FORM, value: string) => void;
    /** Clic / touche sur le conteneur : ouverture d'un champ ou validation clavier (Entrée) */
    handleClick: (event: SyntheticEvent) => void;
    /** Validation explicite du formulaire (bouton « Valider ») */
    validate: () => void;
    /** Mode création : état choisi + date d'opération associée */
    setEtatInCreation: (valeurDate: Date | null, etat: OPERATION_ETATS_ENUM) => void;
    /** Mode édition : propage au contexte une copie de l'opération dont l'état a changé */
    commitOperation: (operation: OperationModel) => void;
}

/**
 * Hook portant l'état du formulaire d'édition d'une opération (AP 006 - lot 3) :
 * `editForm`, `editOperation`, `errors`, initialisation à la sélection d'une opération, ouverture des champs,
 * validation et sauvegarde.
 *
 * Tout l'état est immuable : chaque modification produit une copie. L'opération du contexte (`currentOperation`)
 * n'est jamais mutée ; elle n'est remplacée (via `setCurrentOperation`) qu'avec une copie validée / sauvegardée.
 */
export function useOperationEditForm({ listeCategories, onOperationChange }: UseOperationEditFormProps): UseOperationEditFormResult {

    const { currentBudget: budget, currentOperation: operation, setCurrentOperation } = useCurrentBudget();

    const [editForm, setEditForm] = useState<EditFormProps>(() => createEmptyEditForm(operation?.id === ID_NOUVELLE_OPERATION));
    const [errors, setErrors] = useState<ErrorsFormProps>(createEmptyErrors);
    const [editOperation, setEditOperation] = useState<OperationEditionModel>(() => operation ? cloneOperation(operation) : createNewOperationEdition());
    const [resetKey, setResetKey] = useState<number>(0);

    /** Copies d'opérations propagées au contexte par ce hook : leur arrivée ne réinitialise pas le formulaire */
    const [propagated] = useState<WeakSet<OperationModel>>(() => new WeakSet());
    /** Brouillon validé en attente du retour de sauvegarde */
    const pendingDraft = useRef<OperationModel | null>(null);

    /**
     * Init du formulaire à la sélection d'une nouvelle opération (ajustement d'état au rendu, sans passage par un effet)
     */
    const [previousOperation, setPreviousOperation] = useState<OperationModel | null>(operation);
    if (operation !== previousOperation) {
        setPreviousOperation(operation);
        if (operation && !propagated.has(operation)) {
            setEditOperation(cloneOperation(operation));
            setEditForm(createEmptyEditForm(operation.id === ID_NOUVELLE_OPERATION));
            setErrors(createEmptyErrors());
            setResetKey((key) => key + 1);
        }
    }

    /** Propage une copie d'opération au contexte sans réinitialiser le formulaire */
    const commitOperation = useCallback((committed: OperationModel) => {
        propagated.add(committed);
        setCurrentOperation(committed);
        setEditOperation((previous) => ({ ...previous, etat: committed.etat }));
    }, [propagated, setCurrentOperation]);

    /**
     * Callback de mise à jour de l'opération après sauvegarde : formulaire refermé, copie sauvegardée propagée
     * @param budgetMaj budget mis à jour
     */
    function onOperationUpdate(budgetMaj: BudgetMensuelModel) {
        setEditForm(createEmptyEditForm(false));
        setErrors(createEmptyErrors());
        const saved = pendingDraft.current;
        if (saved) {
            propagated.add(saved);
            setEditOperation(cloneOperation(saved));
            setCurrentOperation(saved);
            pendingDraft.current = null;
        }
        onOperationChange(budgetMaj);
    }

    const fillOperationForm = useCallback((field: OPERATION_EDITION_FORM | OPERATION_RECURRENTE_EDITION_FORM, value: string) => {
        if (field === OPERATION_EDITION_FORM.FORM_VALIDATION) {
            setEditForm((previous) => ({ ...previous, formValidationEnabled: value === "true" }));
        } else {
            setEditOperation((previous) => fillOperationField(previous, field, value, listeCategories));
        }
    }, [listeCategories]);

    /**
     * Ouverture de champs en édition : fusionnée avec l'état le plus récent (le formulaire reçu a été calculé depuis le
     * rendu du clic, il peut ignorer un `formValidationEnabled` basculé entre-temps par un focus / blur)
     */
    const openEditForm = useCallback((ouvert: EditFormProps) => {
        setEditForm((previous) => ({
            value: previous.value || ouvert.value,
            libelle: previous.libelle || ouvert.libelle,
            dateOperation: previous.dateOperation || ouvert.dateOperation,
            mensualite: previous.mensualite || ouvert.mensualite,
            dateFin: previous.dateFin || ouvert.dateFin,
            categories: previous.categories || ouvert.categories,
            categorieType: previous.categorieType || ouvert.categorieType,
            formValidationEnabled: previous.formValidationEnabled
        }));
    }, []);

    const setEtatInCreation = useCallback((valeurDate: Date | null, etat: OPERATION_ETATS_ENUM) => {
        handleDateOperationFromAction(valeurDate, etat, setEditOperation);
    }, []);

    const validationOptions = {
        currentErrors: errors,
        onDraft: (draft: OperationModel) => { pendingDraft.current = draft; }
    };

    function handleClick(event: SyntheticEvent) {
        if (operation && budget) {
            handleOperationEditionClick(event, { operation, budget }, editOperation, editForm, { openEditForm, setErrors, onOperationUpdate }, validationOptions);
        }
    }

    function validate() {
        if (operation && budget) {
            handleValidateOperationForm(operation, budget, editOperation, editForm, setErrors, onOperationUpdate, validationOptions);
        }
    }

    return { editForm, editOperation, errors, resetKey, fillOperationForm, handleClick, validate, setEtatInCreation, commitOperation };
}
