import * as ClientHTTP from "../../Services/ClientHTTP.service";
import * as AppConstants from "../../Utils/AppEnums.constants";
import {toast} from "react-toastify";

/**
 * Controleur de la liste des opérations
 */

    // Update du budget, suite à une action sur une opération
    export function handleOperationsListUpdate(budgetUpdated){
        this.props.onOperationChange(budgetUpdated);
    }


    // Double click sur une opération
    export function handleOperationUpdate(event){
        if(this.props.budget.actif && event.target.parentElement.title !== "PLANIFIEE"){
            console.log("[TRIGGER] Edit opération [" + event.target.parentElement.id + "] " );
            // Activation de la modale
            this.setState({
                idOperation: event.target.parentElement.id,
                showModale : true })
        }
        else{
            console.log("[NOTRIGGER] l'opération n'est pas éditable");
        }

    }


    /**
     * Right click sur une opération - tag comme dernière opération
     * @param event événement
     */
    export function handleOperationLast(event){
        if(this.props.budget.actif && event.target.parentElement.title !== "PLANIFIEE"){
            console.log("[TRIGGER] Last opération [" + event.target.parentElement.id+ "] de [" + this.props.budget.id + "]");
            this.callSetOperationAsLast(event.target.parentElement.id, this.props.budget.id)
        }
        else{
            console.log("[NOTRIGGER] l'opération n'est pas éditable");
        }

    }
    /** Désactivation du menu context lors du right click d'opération **/
    export function disableContextMenu(event){
        event.preventDefault();
        event.stopPropagation();
        return false;
    }

    /**
     * Fermeture du formulaire
     * @param event
     */
    export function hideModale(event) {
        this.setState({ showModale: false });
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
                toast.error("Erreur lors de la mise à jour de l'opération comme dernière opération traitée")
            })

    }

    /**
     * Call back de retour de l'appel dernière opération
     * @param idOperation
     * @param tagDerniereOperation
     */
    export function updateOperationTag(idOperation, tagDerniereOperation){
        // Update du budget global (parent)
        this.props.budget.listeOperations.map(operation => {
            operation.tagDerniereOperation = (operation.id === idOperation) && tagDerniereOperation;
            return operation;
        });
        // hook : màj du state pour refresh de l'ihm
        this.setState({ idOperation : idOperation});
        toast.success("L'opération a bien été idendifiée comme dernière traitée")
    }