import * as AppConstants from "../../Utils/AppEnums.constants"
import * as ClientHTTP from '../../Services/ClientHTTP.service'
import {toast} from "react-toastify";


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

            ClientHTTP.call(operation.etat === "SUPPRIMEE" ? "DELETE" : "POST",
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
        }
        else{
            console.log("Impossible de modifier l'opération " + operation.id + " sur un budget clos");
            toast.warn("Impossible de modifier une opération sur un budget clos")
        }

    }



    /**
     * Mise à jour de l'état de l'opération suivant le bouton
     * @param event click sur le bouton
     * @param operation opération
     * @param budget budget associé à l'opération
     * @param handleBudgetUpdate function de mise à jour du budget
     */
    export function handleOperationAction(event, budget, operation, handleBudgetUpdate) {
        /** Correction click hors cadre */
        if (event.target.id !== undefined && event.target.id !== "") {
            const action=event.target.id;
            if(action === "SUPPRIMEE_A_CONFIRMER"){
                this.setState({showModale: true, operation: operation})
            } else if (action !== "SUPPRIMEE") {
                updateOperation(operation, action, budget, handleBudgetUpdate);
            }
        }
    }


    /**
     * Mise à jour de l'état de l'opération suivant le bouton
     * @param event click sur le bouton
     */
    export function handleToggleClickSupprimer(event){
        // Correction click hors cadre

        if(event.target.id !== null && event.target.id !== undefined) {
            const action = event.target.id;
            if(action === "SUPPRIMEE"){
                let operation = this.state.operation;
                operation.etat=action;
                updateOperation(operation, this.props.budget.id);
            }
            this.setState( { operation: null, showModale : false })
        }
    }
