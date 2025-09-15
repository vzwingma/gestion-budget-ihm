import {toast} from "react-toastify";
import {saveOperation} from "../OperationDetailPage.extservices.js";
import {getEventTargetId} from "../../../../../Utils/OperationData.utils.js";
import OperationModel from "../../../../../Models/budgets/Operation.model.js";
import BudgetMensuelModel from "../../../../../Models/budgets/BudgetMensuel.model.js";
import {OPERATION_ETATS_ENUM} from "../../../../../Utils/AppBusinessEnums.constants.js";
import {Dispatch, SetStateAction} from "react";
import OperationEditionModel from "../../../../../Models/budgets/OperationEdition.model.js";


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

    if (event.target != null) {
        let action = getEventTargetId(event.target)
        if (action === "SUPPRIMEE_A_CONFIRMER") {
            setShowModale(true);
        } else if (action === "ANNULER") {
            setShowModale(false);
        } else if (isInCreateMode) {
            currentOperation.etat = action

            // On ne fait que refresh la date si elle n'est pas déjà renseignée
            let valeurDate = null;
            if (action === OPERATION_ETATS_ENUM.REALISEE) {
                if (editOperation.autresInfos.dateOperation == null) {
                    valeurDate = new Date();
                } else {
                    valeurDate = editOperation.autresInfos.dateOperation;
                }
            }
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
