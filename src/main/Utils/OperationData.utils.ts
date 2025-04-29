import CategorieOperationModel from "../Models/budgets/CategorieOperation.model";
import OperationModel from "../Models/budgets/Operation.model";
import * as AppConstants from "./AppBusinessEnums.constants";

/**
 * Ajout de leading zero devant une valeur
 * @param num nombre à compléter
 * @returns {string} chaine sur 2 caractères avec des 0
 */
export function addLeadingZeros(num: number): string {
    return num.toString().padStart(2, '0');
}

/**
 * Ajout de zero à la fin d'une valeur
 * @param num nombre à compléter
 * @returns {string} chaine sur 2 caractères avec des 0
 */
export function addEndingZeros(num: number): string {

    let n: string = num.toLocaleString('us-US');
    n = n.replace(".", ",")
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
export function getEventTargetId(eventTarget: any): any {
    if (eventTarget != null) {
        if (eventTarget.id !== null && eventTarget.id !== "") {
            return eventTarget.id;
        } else {
            return getEventTargetId(eventTarget.parentNode);
        }
    }
    return null;
}

/**
 * Tri par libellé
 * @param {CategorieOperationModel} categorie1 :  1ère catégorie
 * @param {CategorieOperationModel} categorie2 : 2ème catégorie
 * @returns {number} comparaison
 */
export function sortLibellesCategories(categorie1: CategorieOperationModel, categorie2: CategorieOperationModel): number {
    if (categorie1 !== null && categorie1 !== undefined && categorie2 !== null && categorie2 !== undefined) {
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
    }
    return 0;
}


export const INTERCOMPTE_LIBELLE_REGEX: RegExp = /\[(vers|depuis) ([^\]]+)\](.+)/;
export const EN_RETARD_LIBELLE_REGEX: RegExp = /\[En Retard\](.+)/;
/**
 * Vérifie si une opération est un intercompte
 * @param operationLibelle libellé de l'opération
 * @returns {boolean} true si intercompte
 */
export function operationIsIntercompteFromLibelle(operationLibelle: string): boolean {
    return INTERCOMPTE_LIBELLE_REGEX.exec(operationLibelle) !== null;
}

/**
 * Tri des opérations, par date sinon par statut
 * @param {OperationModel} ope1 :  1ère opération
 * @param {OperationModel} ope2 2ème opération
 * @returns {number} comparaison
 */
export function sortOperations(ope1: OperationModel, ope2: OperationModel): number {
    let date1 = ope1.autresInfos.dateOperation
    let date2 = ope2.autresInfos.dateOperation
    // Premier TRI : Par date d'opération
    if ((date1 === null || date1 === undefined) && date2 !== null) {
        return -1;
    } else if ((date2 === null || date2 === undefined) && date1 !== null) {
        return 1;
    } else if (date1 !== null && date2 !== null) {
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
    if (dateM1 !== undefined && dateM2 !== undefined) {
        if (dateM1 > dateM2) {
            return -1;
        } else if (dateM1 < dateM2) {
            return 1;
        }
    }
    // Normalement n'arrive jamais
    return 0;

}


/**
 * Rang opération
 * @param etatOperation
 * @returns {number}
 */
function getRangEtatOperation(etatOperation: string): number {
    let rang = 0;
    for (let etat in AppConstants.OPERATION_ETATS_ENUM) {
        if (etat === etatOperation) {
            return rang;
        }
        rang++;
    }
    return rang;
}
