import { SyntheticEvent, useCallback, useRef, useState } from "react";
import { toast } from "react-toastify";
import { debug } from "../../../../../Utils/Debug.utils.ts";
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
    handleValidateOperationForm,
    resolveCreatedOperation
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
    /** Budget courant avant une création (null hors création) : référence pour retrouver l'opération créée par le backend */
    const budgetBeforeCreation = useRef<BudgetMensuelModel | null>(null);

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
        // Propagation du budget d'abord : la préparation du parent (statuts...) est appliquée avant la résolution
        onOperationChange(budgetMaj);
        const draft = pendingDraft.current;
        const budgetAvant = budgetBeforeCreation.current;
        pendingDraft.current = null;
        budgetBeforeCreation.current = null;
        if (!draft) {
            return;
        }
        let saved: OperationModel | null = draft;
        if (budgetAvant) {
            // Création : l'id client du brouillon est écrasé par le backend, on retient l'opération réelle du budget retourné
            saved = resolveCreatedOperation(budgetAvant, budgetMaj, draft);
            debug("Opération créée résolue dans le budget retourné : " + (saved?.id ?? "non résolue"));
        }
        if (saved) {
            propagated.add(saved);
            setEditOperation(cloneOperation(saved));
            setCurrentOperation(saved);
        } else {
            // Opération introuvable : fermeture du détail (jamais de promotion d'un id inconnu du backend)
            setCurrentOperation(null);
            toast.warn("Opération créée, mais impossible de l'afficher en détail : sélectionnez-la dans la liste");
        }
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

    function buildValidationOptions(budgetCourant: BudgetMensuelModel) {
        return {
            currentErrors: errors,
            // Appelé avant la sauvegarde : id "-1" = création (l'id est ensuite remplacé par un uuid client)
            onDraft: (draft: OperationModel) => {
                pendingDraft.current = draft;
                budgetBeforeCreation.current = draft.id === ID_NOUVELLE_OPERATION ? budgetCourant : null;
            }
        };
    }

    function handleClick(event: SyntheticEvent) {
        if (operation && budget) {
            handleOperationEditionClick(event, { operation, budget }, editOperation, editForm, { openEditForm, setErrors, onOperationUpdate }, buildValidationOptions(budget));
        }
    }

    function validate() {
        if (operation && budget) {
            handleValidateOperationForm(operation, budget, editOperation, editForm, setErrors, onOperationUpdate, buildValidationOptions(budget));
        }
    }

    return { editForm, editOperation, errors, resetKey, fillOperationForm, handleClick, validate, setEtatInCreation, commitOperation };
}
