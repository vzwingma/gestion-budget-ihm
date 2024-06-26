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
    if (n.indexOf(',') > 0) {
        let r = n.substring(n.indexOf(',') + 1)
        let e = n.substring(0, n.indexOf(','))
        return e + "," + r.padEnd(2, '0')
    } else {
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
 * Retourne le label Fr d'une date
 * @param dateOperation date à afficher
 * @returns {string} label FR de la date
 */
export function getLabelDate(dateOperation) {
    return new Date(Date.parse(dateOperation)).toLocaleDateString("fr");
}


/**
 * Tri par libellé
 * @param categorie1 premier libellé
 * @param categorie2 2ème libellé
 * @returns {number} comparaison
 */
export function sortLibellesCategories(categorie1, categorie2) {

    if (categorie1.categorieParente !== null && categorie1.categorieParente !== undefined && categorie2.categorieParente !== null && categorie2.categorieParente !== undefined) {
        if (categorie1.categorieParente.libelle > categorie2.categorieParente.libelle) {
            return 1;
        } else if (categorie1.categorieParente.libelle < categorie2.categorieParente.libelle) {
            return -1;
        }
    }
    if (categorie1.libelle > categorie2.libelle) {
        return 1;
    } else if (categorie1.libelle < categorie2.libelle) {
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

    // Premier TRI : Par date d'opération
    if (ope1.autresInfos.dateOperation === null && ope2.autresInfos.dateOperation !== null) {
        return -1;
    } else if (ope2.autresInfos.dateOperation === null && ope1.autresInfos.dateOperation !== null) {
        return 1;
    } else {
        let date1 = ope1.autresInfos.dateOperation
        let date2 = ope2.autresInfos.dateOperation
        if (date1 > date2) {
            return -1;
        } else if (date1 < date2) {
            return 1;
        }
    }

    const rangOpe1 = getRangEtatOperation(ope1.etat)
    const rangOpe2 = getRangEtatOperation(ope2.etat)

    // 2ème TRI : par Etat
    if (rangOpe1 > rangOpe2) {
        return 1;
    } else if (rangOpe1 < rangOpe2) {
        return -1;
    }

    // 3ème TRI : par date mise à jour
    let dateM1 = ope1.autresInfos.dateMaj
    let dateM2 = ope2.autresInfos.dateMaj
    if (dateM1 > dateM2) {
        return -1;
    } else if (dateM1 < dateM2) {
        return 1;
    }
    // Normalement n'arrive jamais
    return 0;

}


/**
 * Rang opération
 * @param etatOperation
 * @returns {number}
 */
function getRangEtatOperation(etatOperation) {
    let rang = 0;
    for (let etat in AppConstants.OPERATION_ETATS_ENUM) {
        if (etat === etatOperation) {
            return rang;
        }
        rang++;
    }
}

/**
 * Convertit un nom de mois en numéro de mois.
 *
 * @param {string} mon - Le nom du mois.
 * @returns {number} - Le numéro du mois (1 pour janvier, 2 pour février, etc.).
 */
export function getMonthFromString(mon) {
    return new Date(Date.parse(mon + " 1, 2012")).getMonth() + 1
}
