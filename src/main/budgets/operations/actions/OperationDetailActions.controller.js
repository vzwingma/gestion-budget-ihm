import {toast} from "react-toastify";
import * as DataUtils from "../../../Utils/DataUtils.utils";
import {OPERATION_ETATS_ENUM} from "../../../Utils/AppBusinessEnums.constants";


/**
 * Mise à jour de l'état de l'opération suivant le bouton
 * @param event click sur le bouton
 */
export function handleOperationAction(event) {
    /** Correction click hors cadre */

    if (event.target != null) {
        let action = DataUtils.getEventTargetId(event.target)
        if (action === "SUPPRIMEE_A_CONFIRMER") {
            this.setState({showModale: true});
        } else if (action === "ANNULER") {
            this.setState({showModale: false});
        } else if (this.props.isInCreateMode()) {
            this.props.currentOperation.etat = action

            // On ne fait que refresh la date
            const valeurDate = (action === OPERATION_ETATS_ENUM.REALISEE) ? new Date().toLocaleDateString('en-CA') : "";
            this.props.currentOperation.autresInfos.dateOperation = valeurDate;
            this.props.handleDateOperationFromAction(valeurDate);
        } else {

            this.updateOperation(this.props.currentOperation, action, this.props.currentBudget);
        }
        // Après l'action d'update SUPPRIMEE, on clot la popup
        if (action === OPERATION_ETATS_ENUM.SUPPRIMEE) {
            this.setState({showModale: false})
        }
    }
}


/**
 * Modification de l'opération sur action des boutons
 * @param operation opération modifiée
 * @param action action réalisée
 * @param budget associé
 */
export function updateOperation(operation, action, budget) {

    if (budget.actif) {
        if (operation.etat !== action) {
            console.log("[" + budget.id + "] Modification de l'opération " + operation.id + " : " + operation.etat + " -> " + action);
            operation.etat = action;
            if (action === OPERATION_ETATS_ENUM.REALISEE) {
                const existingDate = this.props.currentOperation.autresInfos.dateOperation;
                operation.autresInfos.dateOperation = existingDate || new Date().toLocaleDateString('en-CA');

            } else if (action === OPERATION_ETATS_ENUM.PREVUE) {
                operation.autresInfos.dateOperation = null;
            }

            this.props.saveOperation(operation, budget);
        }
    } else {
        console.log("Impossible de modifier l'opération " + operation.id + " sur un budget clos");
        toast.warn("Impossible de modifier une opération sur un budget clos")
    }
}
