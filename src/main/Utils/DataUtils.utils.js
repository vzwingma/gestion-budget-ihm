import * as AppConstants from "./AppBusinessEnums.constants";

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
    n = n.replaceAll(".", ",")
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
 * Recherche de l'id d'un élément DOM depuis le target du click
 * @param eventTarget event Target
 * @returns {*} ID du DOM
 */
export function getEventTargetId(eventTarget) {
    if (eventTarget != null) {
        if (eventTarget.id !== null && eventTarget.id !== "") {
            return eventTarget.id;
        } else {
            return getEventTargetId(eventTarget.parentNode);
        }
    }
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
 * Tri des opérations, par date sinon par statut
 * @param {Operation} ope1 :  1ère opération
 * @param {Operation} ope2 2ème opération
 * @returns {number} comparaison
 */
export function sortOperations(ope1, ope2) {
    let sort;
    // Opérations prévues en 1er
    if (ope1.etat === AppConstants.OPERATIONS_ENUM.PREVUE && ope2.etat === AppConstants.OPERATIONS_ENUM.PREVUE) {
        return 0;
    } else if (ope1.etat === AppConstants.OPERATIONS_ENUM.PREVUE) {
        return -1;
    } else if (ope2.etat === AppConstants.OPERATIONS_ENUM.PREVUE) {
        return 1;
    }
    // Sinon tri par date opération, sinon par autre état
    else if (ope1.autresInfos.dateOperation === null && ope2.autresInfos.dateOperation === null) {
        sort = ope1.etat === ope2.etat ? 0 : ope1.etat > ope2.etat ? 1 : -1;
    } else if (ope1.autresInfos.dateOperation === null) {
        sort = 1;
    } else if (ope2.autresInfos.dateOperation === null) {
        sort = -1;
    } else {
        let date1 = ope1.autresInfos.dateOperation
        let date2 = ope2.autresInfos.dateOperation
        if (date1 > date2) {
            sort = -1;
        } else if (date1 < date2) {
            sort = 1;
        } else {
            sort = 0;
        }
    }
    return sort;
}
