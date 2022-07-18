/**
 * Ajout de leading zero devant une valeur
 * @param num nombre à compléter
 * @returns {string} chaine sur 2 caractères avec des 0
 */
export function addLeadingZeros(num) {
    return String(num).padStart(2, '0');
}

/**
 * Calcul d'un libellé d'une date depuis son time in ms
 * @param dateString date en string
 * @returns {string} date au format JJ/MM/AAAA
 */
export function getLibelleDate(dateString){
    if( dateString != null){
        let date = new Date(Date.parse(dateString))
        return this.addLeadingZeros(date.getDate()) + "/" + this.addLeadingZeros(date.getMonth()+1) +"/" + date.getFullYear();
    }
    else {
        return "-"
    }

}