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
    if (lib1.text > lib2.text) {
        return 1;
    }
    if (lib1.text < lib2.text) {
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



/** Libellé du badge Mensualité
 * @param periode : enum période
 * */

export function getLibelle(periode){
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
 * @param periode : enum période
 * */
export function getBackground(periode){
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