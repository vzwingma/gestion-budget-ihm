/**
 *  Sélection d'une année à partir du composant
 * @param event select
 */
export function handleSelect(event) {
    let newDatePrevious;
    let newDateCurrent;
    let newDateNext;
    let dateChanged = false;
    if (event.target.id === "previous") {
        newDateCurrent = this.state.datePrevious;
        newDatePrevious = this.state.datePrevious - 1;
        newDateNext = this.state.dateCurrent;
        dateChanged = true;
    } else if (event.target.id === "next") {
        newDateCurrent = this.state.dateNext;
        newDatePrevious = this.state.dateCurrent;
        newDateNext = this.state.dateNext + 1;
        dateChanged = true;
    }
    if (dateChanged) {
        this.setState({
            datePrevious: newDatePrevious,
            dateCurrent: newDateCurrent,
            dateNext: newDateNext
        })
        // Date sélectionnée, remonté au composant amont
        this.props.onAnneeChange(newDateCurrent);
    }

}
