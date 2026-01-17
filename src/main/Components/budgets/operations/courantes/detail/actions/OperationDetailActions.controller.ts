import {toast} from "react-toastify";
import {saveOperation} from "../OperationDetailPage.extservices.ts";
import {getEventTargetId} from "../../../../../../Utils/OperationData.utils.ts";
import OperationModel from "../../../../../../Models/budgets/Operation.model.ts";
import BudgetMensuelModel from "../../../../../../Models/budgets/BudgetMensuel.model.ts";
import {OPERATION_ETATS_ENUM} from "../../../../../../Utils/AppBusinessEnums.constants.ts";
import {Dispatch, SetStateAction} from "react";
import OperationEditionModel from "../../../../../../Models/budgets/OperationEdition.model.ts";


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
 */
export function handleOperationAction(event: any,
                                      currentOperation: OperationModel, budget: BudgetMensuelModel,
                                      isInCreateMode: boolean,
                                      editOperation: OperationEditionModel,
                                      handleDateOperationFromAction: Function,
                                      onOperationChange: (budget: BudgetMensuelModel) => void,
                                      setShowModale: Dispatch<SetStateAction<boolean>>) {
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
        handleCreateModeAction(currentOperation, action, editOperation, handleDateOperationFromAction);
    } else {
        updateOperation(currentOperation, action, budget, onOperationChange);
    }

    if (action === OPERATION_ETATS_ENUM.SUPPRIMEE) {
        setShowModale(false);
    }
}

function handleCreateModeAction(currentOperation: OperationModel, action: OPERATION_ETATS_ENUM, editOperation: OperationEditionModel, handleDateOperationFromAction: Function) {
    currentOperation.etat = action;

    const valeurDate = action === OPERATION_ETATS_ENUM.REALISEE
        ? editOperation.autresInfos.dateOperation || new Date()
        : null;
    
    currentOperation.autresInfos.dateOperation = valeurDate;
    handleDateOperationFromAction(valeurDate);
}


/**
 * Modification de l'opération sur action des boutons
 * @param operation opération modifiée
 * @param action action réalisée
 * @param budget associé
 * @param onOperationChange action de changement d'opération
 */
function updateOperation(operation : OperationModel, action : OPERATION_ETATS_ENUM, budget : BudgetMensuelModel, onOperationChange: (budget: BudgetMensuelModel) => void) {

    if (budget.actif) {
        if (operation.etat !== action) {
            console.log("[" + budget.id + "] Modification de l'opération " + operation.id + " : " + operation.etat + " -> " + action);
            operation.etat = action;
            if (action === OPERATION_ETATS_ENUM.REALISEE) {
                const existingDate = operation.autresInfos.dateOperation;
                operation.autresInfos.dateOperation = existingDate || new Date();

            } else if (action === OPERATION_ETATS_ENUM.PREVUE) {
                operation.autresInfos.dateOperation = null;
            }

            saveOperation(operation, budget, onOperationChange);
        }
    } else {
        console.log("Impossible de modifier l'opération " + operation.id + " sur un budget clos");
        toast.warn("Impossible de modifier une opération sur un budget clos")
    }
}
