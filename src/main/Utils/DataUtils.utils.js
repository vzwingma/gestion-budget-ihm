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
 * @param pattern pattern de sortie : JJ/MM/AAAA ou AAAA-MM-DD
 * @returns {string} date au format issu du pattern
 */
export function getLibelleDate(dateString, pattern){
    if( dateString != null){
        let date = new Date(Date.parse(dateString))
        if(pattern === "JJ/MM/AAAA"){
            return addLeadingZeros(date.getDate()) + "/" + addLeadingZeros(date.getMonth()+1) +"/" + date.getFullYear();
        }
        else if(pattern === "AAAA-MM-DD"){
            return date.getFullYear() + "-" + addLeadingZeros(date.getMonth()+1) + "-" + addLeadingZeros(date.getDate())
        }
    }
    return "-"
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

/**
 * Extrait la date d'un datetime
 * @param dateTime date time fourni par le backend
 * @returns {string|*} la première partie en JJ MM AAAA
 */
export function getDateFromDateTime(dateTime){
    if(dateTime !== null){
        return dateTime.substring(0, 10)
    }
    return dateTime
}