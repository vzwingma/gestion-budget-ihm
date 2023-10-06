/**
 * Controleur de la liste des budgets
 */

/**
 * Notification lorsque le compte change
 * @param selectedCompteFromComponent : compte sélectionnée
 */
export function handleCompteChange(selectedCompteFromComponent) {
    console.log("[TRIGGER-MENU] NewContext compte=" + selectedCompteFromComponent.id)
    this.setState(
        {selectedCompte: selectedCompteFromComponent, budgetMenuOpen: false})
}

export function handleOpenMenuBar() {
    this.setState(
        {selectedCompte: null, budgetMenuOpen: true})
}

/**
 *   Notification lorsque la date change
 * @param selectedDateFromComponent : date sélectionnée
 */
export function handleDateChange(selectedDateFromComponent) {
    console.log("[TRIGGER-MENU] NewContext date=" + selectedDateFromComponent)
    this.setState({selectedDate: selectedDateFromComponent})
}

