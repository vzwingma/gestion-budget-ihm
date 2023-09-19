import * as ClientHTTP from "../../Services/ClientHTTP.service";
import * as AppConstants from "../../Utils/AppEnums.constants";
import {toast} from "react-toastify";


/**
 * Mise à jour de l'état de l'opération suivant le bouton
 * @param event click sur le bouton
 */
export function handleOperationAction(event) {
    /** Correction click hors cadre */

    if (event.target !== undefined && event.target !== "") {
        let action = event.target.id;
        if (action === "") {
            action = event.target.parentNode.id
        }
        if (action === "SUPPRIMEE_A_CONFIRMER") {
            this.setState({showModale: true, currentOperation: this.props.currentOperation});
        } else if (action === "ANNULER") {
            this.setState({showModale: false});
        } else {
            console.log(this.props)
            updateOperation(this.props.currentOperation, action, this.props.currentBudget, this.props.onActionOperationChange);
        }
        // Après l'action d'update SUPPRIMEE, on clot la popup
        if (action === AppConstants.OPERATIONS_ENUM.SUPPRIMEE) {
            this.setState({currentOperation: null, showModale: false})
        }
    }
}


/**
 * Modification de l'opération sur action des boutons
 * @param operation opération modifiée
 * @param action action réalisée
 * @param budget associé
 * @param handleBudgetUpdate fonction de mise à jour du budget
 */
export function updateOperation(operation, action, budget, handleBudgetUpdate) {

    if (budget.actif) {
        if (operation.etat !== action) {
            console.log("[" + budget.id + "] Modification de l'opération " + operation.id + " : " + operation.etat + " -> " + action);
            operation.etat = action;

            ClientHTTP.call(operation.etat === AppConstants.OPERATIONS_ENUM.SUPPRIMEE ? "DELETE" : "POST",
                AppConstants.BACKEND_ENUM.URL_OPERATIONS, AppConstants.SERVICES_URL.OPERATIONS.UPDATE,
                [budget.id, operation.id],
                operation)
                .then((data) => {

                    // Update du budget global (parent)
                    handleBudgetUpdate(data);
                    toast.success("Mise à jour de l'opération correctement effectuée")

                })
                .catch((e) => {
                    console.log("Erreur lors de la mise à jour de l'opération " + operation.id + " >> " + e);
                    toast.error("Erreur lors de la mise à jour de l'opération")
                })
        }
    } else {
        console.log("Impossible de modifier l'opération " + operation.id + " sur un budget clos");
        toast.warn("Impossible de modifier une opération sur un budget clos")
    }

}
