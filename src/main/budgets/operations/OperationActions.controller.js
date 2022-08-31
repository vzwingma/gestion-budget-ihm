import * as AppConstants from "../../Utils/AppEnums.constants"
import * as ClientHTTP from './../../Services/ClientHTTP.service'
import {toast} from "react-toastify";



    /**
     * Modification de l'opération sur action des boutons
      */
    export function updateOperation(operation){
        console.log("Modification de l'opération " + operation.id + " -> " + operation.etat);

        ClientHTTP.call(operation.etat === "SUPPRIMEE" ? "DELETE" : "POST",
            AppConstants.BACKEND_ENUM.URL_OPERATIONS, AppConstants.SERVICES_URL.OPERATIONS.UPDATE,
            [ this.props.budgetid, operation.id ],
            operation)
            .then((data) => {
                // Update du budget global (parent)
                this.props.onOperationChange(data);
                toast.success("Mise à jour de l'opération correctement effectuée")
            })
            .catch((e) => {
                console.log("Erreur lors de la mise à jour de l'opération " + operation.id + " >> "+ e);
                toast.error("Erreur lors de la mise à jour de l'opération")
            })
    }


/**
 * Mise à jour de l'état de l'opération suivant le bouton
 * @param event click sur le bouton
 */
export function handleToggleClick(event) {
    // Correction click hors cadre
    if(event.target.attributes["action"] !== null && event.target.attributes["action"] !== undefined) {
        const action = event.target.attributes["action"].value;

        if(action === "SUPPRIMEE_A_CONFIRMER"){
            this.hideShowModale(true)
        }
        else if(action === "SUPPRIMEE_ANNULER"){
            this.hideShowModale(false)
        }
        else{
            this.props.operation.etat=action;
            this.updateOperation(this.props.operation);
        }
    }
}

    // Mise à jour de l'état de l'opération
    export function hideShowModale(showPopup) {
        this.setState( { showModale : showPopup })
    }

