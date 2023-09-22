import {toast} from "react-toastify";
import {PERIODES_MENSUALITE_ENUM} from "../../Utils/AppBusinessEnums.constants";

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
    if (operation.mensualite == null) {
        operation.mensualite = {periode: PERIODES_MENSUALITE_ENUM.at(0)}
    }
    this.setState({currentOperation: operation})
}


/**
 * Création d'une nouvelle opération
 */
export function handleButtonCreateClick() {
    // TODO : Création d'une nouvelle opération
    this.setState({currentOperation: null})
}
