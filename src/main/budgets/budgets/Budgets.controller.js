/*
 * Controleur des budgets
 */


    /** Notification lorsque le compte change **/
    export function handleCompteChange(selectedIdCompteFromComponent){
     //   console.log("[SELECT] Compte=" + selectedIdCompteFromComponent)
        this.setState({ selectedCompte: selectedIdCompteFromComponent })
    }
    // Notification lorsque la date change
    export function handleDateChange(selectedDateFromComponent){
     //   console.log("[SELECT] Date=" + selectedDateFromComponent)
        this.setState({ selectedDate : selectedDateFromComponent})
    }
    // Notification lorsque le budget est mis à jour
    export function handleBudgetUpdate(budgetData){
        console.log("(Re)Chargement du budget [" + budgetData.id + "] : " + budgetData.listeOperations.length +  " opérations")
        this.setState({ currentBudget : budgetData })
    }



