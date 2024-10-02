

/**
 * Gestion des clics sur les boutons de la barre de date
 * @param event événement de clic sur la fenêtre
 * @param dateCurrentBudget date courante
 * @param dateNextBudget date suivante
 * @param updateMonths fonction de mise à jour des mois
 */
export function handleModalClick(event : any, dateCurrentBudget : Date, dateNextBudget : Date, updateMonths : Function) {
    if (event.target.id !== null && event.target.id !== undefined) {
        const action = event.target.id;
        if (action === "CONFIRMER") {
            confirmInitNextMonth(dateCurrentBudget, dateNextBudget, updateMonths);
        }
    }
}



/**
 * 
 * @param event événement de clic sur la fenêtre
 * @param datePreviousBudget date précédente
 * @param dateCurrentBudget date courante
 * @param dateNextBudget date suivante
 * @param setShowModale fonction de mise à jour de la fenêtre modale
 * @param updateMonths fonction de mise à jour des mois
 */
export function handleSelect(event : any, datePreviousBudget : Date, dateCurrentBudget : Date, dateNextBudget : Date, setShowModale : React.Dispatch<React.SetStateAction<boolean>>, updateMonths: Function) {
    let newDatePreviousBudget = datePreviousBudget;
    let newDateCurrentBudget = dateCurrentBudget;
    let newDateNextBudget = dateNextBudget;
    let dateChanged = false;
    if (event.target.id === "previous") {
        newDateCurrentBudget = new Date(datePreviousBudget);
        newDatePreviousBudget = new Date(datePreviousBudget.setMonth(datePreviousBudget.getMonth() - 1));
        newDateNextBudget = new Date(dateCurrentBudget);
        dateChanged = true;
    } else if (event.target.id === "next") {
        // Popup de confirmation, car cela va initialiser un nouveau budget et cloturer l'actuel
        let moisEnCours = new Date();
        moisEnCours.setMonth(new Date().getMonth() - 1);
        if (moisEnCours <= dateCurrentBudget) {
            console.log("Attention cela va initier un nouveau mois et fermer le mois courant");
            setShowModale(true);
        } else {
            confirmInitNextMonth(dateCurrentBudget, dateNextBudget, updateMonths);
        }
    }
    if (dateChanged) {
        updateMonths(newDatePreviousBudget, newDateCurrentBudget, newDateNextBudget);
    }

}

/**
 * Calcul du prochain mois
 */
function confirmInitNextMonth(dateCurrentBudget : Date, dateNextBudget : Date, updateMonths : Function) {
    let newDatePreviousBudget = new Date(dateCurrentBudget);
    let newDateCurrentBudget = new Date(dateNextBudget);
    let newDateNextBudget = new Date(dateNextBudget.setMonth(dateNextBudget.getMonth() + 1));
    updateMonths(newDatePreviousBudget, newDateCurrentBudget, newDateNextBudget)
}