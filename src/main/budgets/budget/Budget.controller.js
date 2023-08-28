import {toast} from "react-toastify";

/**
 * Controleur des budgets
 */

    // Notification lorsque le budget est mis à jour
    export function handleBudgetUpdate(budgetData){
        console.log("(Re)Chargement du budget [" + budgetData.id + "] : " + budgetData.listeOperations.length +  " opérations")
        this.setState({ currentBudget : budgetData })
        toast.success("Chargement du budget [" + budgetData.id + "] correctement effectué ")
    }

export function handleOperationSelect(operation) {
    console.log("Selection de l'opération [" + operation.id + "]");
    //  this.setState({ currentOperation : operation })
    toast.success("Chargement de l'opération [" + operation.id + "] correctement effectué ")
}
