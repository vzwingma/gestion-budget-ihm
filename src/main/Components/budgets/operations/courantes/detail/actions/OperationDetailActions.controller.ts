import {toast} from "react-toastify";
import {saveOperation} from "../OperationDetailPage.extservices.ts";
import {getEventTargetId} from "../../../../../../Utils/OperationData.utils.ts";
import OperationModel, { cloneOperationModel } from "../../../../../../Models/budgets/Operation.model.ts";
import BudgetMensuelModel from "../../../../../../Models/budgets/BudgetMensuel.model.ts";
import {OPERATION_ETATS_ENUM} from "../../../../../../Utils/AppBusinessEnums.constants.ts";
import {Dispatch, SetStateAction} from "react";
import OperationEditionModel from "../../../../../../Models/budgets/OperationEdition.model.ts";
import { debug } from "../../../../../../Utils/Debug.utils.ts";


/**
 * Mise à jour de l'état de l'opération suivant le bouton
 * @param event click sur le bouton
 * @param currentOperation opération en cours
 * @param budget budget associé
 * @param isInCreateMode mode création
 * @param editOperation opération en cours d'édition
 * @param handleDateOperationFromAction action de changement de date
 * @param onOperationChange action de changement d'opération
 * @param setShowModale action de changement de visibilité de la modale
 * @param onOperationCommit propage au contexte la copie d'opération modifiée (mode édition) : l'opération courante n'est jamais mutée
 */
export function handleOperationAction(event: any,
                                      currentOperation: OperationModel, budget: BudgetMensuelModel,
                                      isInCreateMode: boolean,
                                      editOperation: OperationEditionModel,
                                      handleDateOperationFromAction: Function,
                                      onOperationChange: (budget: BudgetMensuelModel) => void,
                                      setShowModale: Dispatch<SetStateAction<boolean>>,
                                      onOperationCommit?: (operation: OperationModel) => void) {
    /** Correction click hors cadre */

    if (event.target == null) {
        return;
    }
    
    const action = getEventTargetId(event.target);

    if (action === 'OPERATION_FORM') {
        return;
    }

    if (action === "SUPPRIMEE_A_CONFIRMER") {
        setShowModale(true);
        return;
    }
    
    if (action === "ANNULER") {
        setShowModale(false);
        return;
    }

    if (isInCreateMode) {
        handleCreateModeAction(action, editOperation, handleDateOperationFromAction);
    } else {
        updateOperation(currentOperation, action, budget, onOperationChange, onOperationCommit);
    }

    if (action === OPERATION_ETATS_ENUM.SUPPRIMEE) {
        setShowModale(false);
    }
}

/**
 * Mode création : l'état choisi (et la date d'opération associée) est porté par l'opération en cours d'édition,
 * rien n'est sauvegardé tant que le formulaire n'est pas validé.
 */
function handleCreateModeAction(action: OPERATION_ETATS_ENUM, editOperation: OperationEditionModel, handleDateOperationFromAction: Function) {
    const valeurDate = action === OPERATION_ETATS_ENUM.REALISEE
        ? editOperation.autresInfos.dateOperation || new Date()
        : null;

    handleDateOperationFromAction(valeurDate, action);
}


/**
 * Modification de l'opération sur action des boutons
 * @param operation opération modifiée
 * @param action action réalisée
 * @param budget associé
 * @param onOperationChange action de changement d'opération
 * @param onOperationCommit propage la copie modifiée au contexte, uniquement au succès de la sauvegarde
 */
function updateOperation(operation : OperationModel, action : OPERATION_ETATS_ENUM, budget : BudgetMensuelModel, onOperationChange: (budget: BudgetMensuelModel) => void, onOperationCommit?: (operation: OperationModel) => void) {

    if (budget.actif) {
        if (operation.etat !== action) {
            debug("[" + budget.id + "] Modification de l'opération " + operation.id + " : " + operation.etat + " -> " + action);
            const updated = cloneOperationModel(operation);
            updated.etat = action;
            if (action === OPERATION_ETATS_ENUM.REALISEE) {
                updated.autresInfos.dateOperation = operation.autresInfos.dateOperation || new Date();

            } else if (action === OPERATION_ETATS_ENUM.PREVUE) {
                updated.autresInfos.dateOperation = null;
            }

            // La copie n'est propagée au contexte qu'au succès de la sauvegarde (en cas d'échec : ni commit ni changement d'écran)
            saveOperation(updated, budget, (budgetMaj: BudgetMensuelModel) => {
                onOperationChange(budgetMaj);
                onOperationCommit?.(updated);
            });
        }
    } else {
        console.warn("Impossible de modifier l'opération " + operation.id + " sur un budget clos");
        toast.warn("Impossible de modifier une opération sur un budget clos")
    }
}
