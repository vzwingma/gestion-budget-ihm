import {toast} from "react-toastify";

/**
 * Controleur des budgets
 */

/**
 *  Notification lorsque le budget est mis à jour
 * @param budgetData budget
 */
    export function handleBudgetUpdate(budgetData){
        console.log("(Re)Chargement du budget [" + budgetData.id + "] : " + budgetData.listeOperations.length +  " opérations")
        this.setState({ currentBudget : budgetData })
        toast.success("Chargement du budget [" + budgetData.id + "] correctement effectué ")
    }

/**
 * Sélection d'une opération
 * @param operation opération
 */
export function handleOperationSelect(operation) {
    console.log("Selection de l'opération [" + operation.id + "]");
    this.setState({currentOperation: operation})
}


/**
 * Création d'une nouvelle opération
 */
export function handleButtonCreateClick() {
    console.log("CREATE")
    this.setState({currentOperation: null})
}
