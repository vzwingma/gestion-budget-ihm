import {toast} from "react-toastify";

/**
 * Controleur de la liste des opérations
 */

/**
 * Update du budget, suite à une action sur une opération
 * @param budgetUpdated budget Updated
 */
    export function handleOperationsListUpdate(budgetUpdated){
        this.props.onOperationChange(budgetUpdated);
    }




    /**
     * Action de création
     */
    export function handleOperationCreate(){
        this.setState({
            showModaleEdit : true,
            idOperation: null})
    }

    /**
     * Sélection d'une ligne d'opération
     * @param params params
     */
    export function handleOperationSelect(params: GridRowParams){
        if(this.props.budget.actif && params.etat !== "PLANIFIEE") {
            this.setState({ idOperation : params.id })
        }
    }

    /**
     * Double click sur une opération
     * @param event evenement de mise à jour d'opération
     */
    export function handleOperationUpdate(event){
        if(this.state.idOperation !== null){
            console.log("[TRIGGER] Edit opération [" + this.state.idOperation + "] " );
            // Activation de la modale
            this.setState({ showModaleEdit : true })
        }
        else{
            console.log("[NOTRIGGER] l'opération n'est pas éditable");
        }

    }



    /**
     * Double click sur une opération - tag comme dernière opération
     * @param event événement
     */
    export function handleOperationLast(event){
        if(this.props.budget.actif && event.row.etat === "REALISEE"){
            console.log("[TRIGGER] Last opération [" + event.row.id+ "] de [" + this.props.budget.id + "]");
            this.callSetOperationAsLast(event.row.id, this.props.budget.id)
        }
        else{
            console.log("[NOTRIGGER] l'opération n'est pas réalisée");
        }

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



    /**
     * Fermeture du formulaire
     * @param event
     */
    export function hideModale(event) {
        this.setState({ showModaleEdit: false });
    }
