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
 * Tri des opérations, par date sinon par statut
 * @param op1 : Operation 1ère opération
 * @param op2 : Operation 2ème opération
 * @returns {number} comparaison
 */
export function sortOperations(ope1, ope2) {
    let sort;
    // Opérations prévues en 1er
    if (ope1.etat === "PREVUE" && ope2.etat === "PREVUE") {
        return 0;
    } else if (ope1.etat === "PREVUE") {
        return -1;
    } else if (ope2.etat === "PREVUE") {
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

/**
 * Tri par date
 * @param strDate1 : string premiere date
 * @param strDate2 : string 2ème date
 * @returns {number} comparaison
 */
export function sortDatesOperation(strDate1, strDate2) {
    let libDate1 = strDate1.trim();
    let libDate2 = strDate2.trim();
    let sort;

    if((libDate1 === null || libDate1 === '-') && (libDate2 === null || libDate2 === '-')){
        sort = 0;
    }
    else if((libDate1 === null || libDate1 === '-')){
        sort = -1;
    }
    else if((libDate2 === null || libDate2 === '-')){
        sort = 1;
    }
    else{
        const pattern = /(\d{2})\/(\d{2})\/(\d{4})/;
        let date1 = new Date(libDate1.replace(pattern,'$3-$2-$1'));
        let date2 = new Date(libDate2.replace(pattern,'$3-$2-$1'))
        if (date1 >= date2) {
            sort = 1;
        }
        else if (date1 < date2) {
            sort = -1;
        }
        else{
            sort = 0;
        }
    }
    return sort;
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
