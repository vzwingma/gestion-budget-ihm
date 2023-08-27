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
