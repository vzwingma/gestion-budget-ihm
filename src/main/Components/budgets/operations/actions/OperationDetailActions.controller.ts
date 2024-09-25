import {toast} from "react-toastify";
import { saveOperation } from "../detail/OperationDetailPage.extservices";
import { getEventTargetId } from "../../../../Utils/OperationData.utils";
import OperationModel from "../../../../Models/Operation.model";
import BudgetMensuelModel from "../../../../Models/BudgetMensuel.model";
import { OPERATION_ETATS_ENUM } from "../../../../Utils/AppBusinessEnums.constants";


/**
 * Mise à jour de l'état de l'opération suivant le bouton
 * @param event click sur le bouton
 * @param currentOperation
 * @param budget
 * @param isInCreateMode
 * @param handleDateOperationFromAction
 * @param onOperationChange
 * @param setShowModale
 */
export function handleOperationAction(event : any, currentOperation : OperationModel, budget : BudgetMensuelModel, isInCreateMode : boolean, handleDateOperationFromAction : Function, onOperationChange: (budget: BudgetMensuelModel) => void, setShowModale : React.Dispatch<React.SetStateAction<boolean>>) {
    /** Correction click hors cadre */

    if (event.target != null) {
        let action = getEventTargetId(event.target)
        if (action === "SUPPRIMEE_A_CONFIRMER") {
            setShowModale(true);
        } else if (action === "ANNULER") {
            setShowModale(false);
        } else if (isInCreateMode) {
            currentOperation.etat = action

            // On ne fait que refresh la date
            const valeurDate = (action === OPERATION_ETATS_ENUM.REALISEE) ? new Date() : null;
            currentOperation.autresInfos.dateOperation = valeurDate;
            handleDateOperationFromAction(valeurDate);
        } else {

            updateOperation(currentOperation, action, budget, onOperationChange);
        }
        // Après l'action d'update SUPPRIMEE, on clot la popup
        if (action === OPERATION_ETATS_ENUM.SUPPRIMEE) {
            setShowModale(false);
        }
    }
}


/**
 * Modification de l'opération sur action des boutons
 * @param operation opération modifiée
 * @param action action réalisée
 * @param budget associé
 */
function updateOperation(operation : OperationModel, action : string, budget : BudgetMensuelModel, onOperationChange: (budget: BudgetMensuelModel) => void) {

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
