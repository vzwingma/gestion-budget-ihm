/**
 * Controleur de la liste des budgets
 */

/** Notification lorsque le compte change **/
export function handleCompteChange(selectedCompteFromComponent) {
    console.log("[TRIGGER] NewContext compte=" + selectedCompteFromComponent.id)
    this.setState(
        {selectedCompte: selectedCompteFromComponent, budgetMenuOpen: false})
}

export function handleOpenMenuBar() {
    this.setState(
        {selectedCompte: null, budgetMenuOpen: true})
}

// Notification lorsque la date change
export function handleDateChange(selectedDateFromComponent) {
    console.log("[TRIGGER] NewContext date=" + selectedDateFromComponent)
    this.setState({selectedDate: selectedDateFromComponent})
}

