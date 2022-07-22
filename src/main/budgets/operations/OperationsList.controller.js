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
