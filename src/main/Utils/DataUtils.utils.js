/**
 * Ajout de leading zero devant une valeur
 * @param num nombre à compléter
 * @returns {string} chaine sur 2 caractères avec des 0
 */
export function addLeadingZeros(num) {
    return String(num).padStart(2, '0');
}

/**
 * Ajout de zero à la fin d'une valeur
 * @param num nombre à compléter
 * @returns {string} chaine sur 2 caractères avec des 0
 */
export function addEndingZeros(num) {
    let n = num.toLocaleString('us-US');
    if(n.indexOf(',') > 0){
        let r = n.substring(n.indexOf(',')+1)
        let e = n.substring(0, n.indexOf(','))
        return e + "," + r.padEnd(2, '0')
    }
    else{
        return n + "," + addLeadingZeros(0)
    }
}


/**
 * Calcul d'un libellé d'une date depuis son time in ms
 * @param dateString date en string
 * @returns {string} date au format issu du pattern
 */
export function getRenderLibelleDate(dateString){
    if( dateString != null){
        let date = new Date(Date.parse(dateString))
        return addLeadingZeros(date.getDate()) + "/" + addLeadingZeros(date.getMonth()+1) +"/" + date.getFullYear();
    }
    return "-"
}

/**
 * Calcul d'un libellé d'une date depuis son time in ms
 * @param date date a afficher
 * @returns {string} date au format issu du pattern YYYY-MM-DD
 */
export function getDateForForm(date){
    if( date != null){
        return date.getFullYear() + "-" + addLeadingZeros(date.getMonth()+1) + "-" + addLeadingZeros(date.getDate());
    }
    return null
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



/**
 * Tri par libellé
 * @param lib1 premier libellé
 * @param lib2 2ème libellé
 * @returns {number} comparaison
 */
export function sortLibellesCategories(lib1, lib2) {
    if (lib1.text > lib2.text) {
        return 1;
    }
    if (lib1.text < lib2.text) {
        return -1;
    }
    return 0;
}

/**
 * Tri par date
 * @param strDate1 : string premiere date
 * @param strDate2 : string 2ème date
 * @returns {number} comparaison
 */
export function sortDatesOperation(strDate1, strDate2) {
    let libDate1 = strDate1.trim();
    let libDate2 = strDate2.trim();
    if((libDate1 === null || libDate1 === '-') && (libDate2 === null || libDate2 === '-')){
        return 0;
    }
    if((libDate1 === null || libDate1 === '-')){
        return -1;
    }
    if((libDate2 === null || libDate2 === '-')){
        return 1;
    }
    let date1 = new Date(Date.parse(libDate1))
    let date2 = new Date(Date.parse(libDate2))
    if (date1 > date2) {
        return 1;
    }
    if (date1 < date2) {
        return -1;
    }
    return 0;
}



/** Libellé du badge Mensualité
 * @param periode : string enum période
 * */

export function getLibellePeriode(periode){
    switch (periode) {
        case "MENSUELLE":
            return "Mensuelle";
        case "TRIMESTRIELLE":
            return "Trimestrielle";
        case "SEMESTRIELLE":
            return "Semestrielle";
        case "ANNUELLE":
            return "Annuelle";
        default:
            return "";
    }
}

/** Couleur du background du badge Mensualité
 * @param periode : string enum période
 * */
export function getBackgroundColorForPeriode(periode){
    switch (periode) {
        case "MENSUELLE":
            return "default";
        case "TRIMESTRIELLE":
            return "info";
        case "SEMESTRIELLE":
            return "warning";
        case "ANNUELLE":
            return "error";
        default:
            return "default"
    }
}