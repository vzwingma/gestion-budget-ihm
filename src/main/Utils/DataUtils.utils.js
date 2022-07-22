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

/**
 * Tri par libellé
 * @param lib1 premier libellé
 * @param lib2 2ème libellé
 * @returns {number} comparaison
 */
export function sortLibelles(lib1, lib2) {
    if (lib1.libelle > lib2.libelle) {
        return 1;
    }
    if (lib1.libelle < lib2.libelle) {
        return -1;
    }
    return 0;
}