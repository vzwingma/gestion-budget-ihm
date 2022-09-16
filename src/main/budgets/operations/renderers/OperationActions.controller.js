import * as AppConstants from "../../../Utils/AppEnums.constants"
import * as ClientHTTP from '../../../Services/ClientHTTP.service'
import {toast} from "react-toastify";


    /**
     * Modification de l'opération sur action des boutons
      */
    export function updateOperation(operation, idBudget){
        console.log("[" +idBudget +"] Modification de l'opération " + operation.id + " -> " + operation.etat);
        ClientHTTP.call(operation.etat === "SUPPRIMEE" ? "DELETE" : "POST",
            AppConstants.BACKEND_ENUM.URL_OPERATIONS, AppConstants.SERVICES_URL.OPERATIONS.UPDATE,
            [ idBudget, operation.id ],
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
    export function handleToggleClick(params: GridCellParams, event: MuiEvent<React.MouseEvent>){
        // Correction click hors cadre
        if(params.field === "actions" && event.target.id !== undefined && event.target.id !== ""){
            const action=event.target.id;
            if(action === "SUPPRIMEE_A_CONFIRMER"){
                this.setState({showModale: true, operation : params.row})
            }
            else if(action !== "SUPPRIMEE"){
                params.row.etat=action;
                this.updateOperation(params.row, this.props.budget.id);
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
                this.updateOperation(operation, this.props.budget.id);
            }
            this.setState( { operation: null, showModale : false })
        }
    }