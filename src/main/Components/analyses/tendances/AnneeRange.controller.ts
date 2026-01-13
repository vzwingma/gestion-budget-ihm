/**
 *  Sélection d'une année à partir du composant
 * @param event select
 * @param dateCurrent date courante
 * @param onAnneeChange fonction de changement d'année
 */
export function handleSelect(event : any, dateCurrent : number, onAnneeChange : (annee: number) => void) {

    let newDateCurrent = dateCurrent;
    if (event.target.id === "previous") {
        newDateCurrent = dateCurrent - 1;
    } else if (event.target.id === "next") {
        newDateCurrent = dateCurrent + 1;
    } else if (event.target.id === "all") {
        newDateCurrent = 0;
    }

    // Date sélectionnée, remonté au composant amont
    onAnneeChange(newDateCurrent);
}
