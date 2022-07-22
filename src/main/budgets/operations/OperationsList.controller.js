import * as ClientHTTP from "../../Services/ClientHTTP.service";
import * as AppConstants from "../../Utils/AppEnums.constants";

/**
 * Controleur de la liste des opérations
 */

    // Update du budget, suite à une action sur une opération
    export function handleOperationsListUpdate(budgetUpdated){
        console.log("[TRIGGER] Refresh budget [" + budgetUpdated.id+ "]");
        this.props.onOperationChange(budgetUpdated);
    }


    // Double click sur une opération
    export function handleOperationUpdate(event){
        if(this.state.budget.actif){
            console.log("[TRIGGER] Edit opération [" + event.target.parentElement.id+ "]");
        }
        else{
            console.log("[NOTRIGGER] le budget n'est pas éditable");
        }

    }



    // Right click
    export function handleOperationLast(event){
        if(this.state.budget.actif){
            console.log("[TRIGGER] Last opération [" + event.target.parentElement.id+ "]");
            this.callSetOperationAsLast(event.target.parentElement.id, this.props.budget.id)
        }
        else{
            console.log("[NOTRIGGER] le budget n'est pas éditable");
        }

    }
    /** Désactivation du menu context lors du right click d'opération **/
    export function disableContextMenu(event){
        event.preventDefault();
        event.stopPropagation();
        return false;
    }



    /**
     * Modification de l'opération sur action des boutons
     */
    export function callSetOperationAsLast(idOperation, idBudget){
        console.log("Dernière opération " + idOperation + " du budget " + idBudget);

        ClientHTTP.call("POST", AppConstants.BACKEND_ENUM.URL_OPERATIONS, AppConstants.SERVICES_URL.OPERATIONS.DERNIERE,
            [ idBudget, idOperation ])
            .then((data) => {
                this.updateOperationTag(idOperation, data)
            })
            .catch((e) => {
                console.log("Erreur lors de la mise à jour de l'opération " + idOperation + " >> "+ e);
            })

    }

    /**
     * Call back de retour de l'appel dernière opération
     * @param idOperation
     * @param tagDerniereOperation
     */
    export function updateOperationTag(idOperation, tagDerniereOperation){
        // Update du budget global (parent)
        let operationListUpdated = this.state.listeOperations.map(operation => {
            operation.tagDerniereOperation = (operation.id === idOperation) && tagDerniereOperation;
            return operation;
        });
        this.setState({ listeOperations : operationListUpdated});
    }