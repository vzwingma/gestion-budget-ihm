"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMonthFromString = exports.sortOperations = exports.sortLibellesCategories = exports.getLabelDate = exports.getEventTargetId = exports.addEndingZeros = exports.addLeadingZeros = void 0;
var AppConstants = __importStar(require("./AppBusinessEnums.constants"));
/**
 * Ajout de leading zero devant une valeur
 * @param num nombre à compléter
 * @returns {string} chaine sur 2 caractères avec des 0
 */
function addLeadingZeros(num) {
    return String(num).padStart(2, '0');
}
exports.addLeadingZeros = addLeadingZeros;
/**
 * Ajout de zero à la fin d'une valeur
 * @param num nombre à compléter
 * @returns {string} chaine sur 2 caractères avec des 0
 */
function addEndingZeros(num) {
    var n = num.toLocaleString('us-US');
    n = n.replace(".", ",");
    if (n.indexOf(',') > 0) {
        var r = n.substring(n.indexOf(',') + 1);
        var e = n.substring(0, n.indexOf(','));
        return e + "," + r.padEnd(2, '0');
    }
    else {
        return n + "," + addLeadingZeros(0);
    }
}
exports.addEndingZeros = addEndingZeros;
/**
 * Recherche de l'id d'un élément DOM depuis le target du click
 * @param eventTarget event Target
 * @returns {*} ID du DOM
 */
function getEventTargetId(eventTarget) {
    if (eventTarget != null) {
        if (eventTarget.id !== null && eventTarget.id !== "") {
            return eventTarget.id;
        }
        else {
            return getEventTargetId(eventTarget.parentNode);
        }
    }
}
exports.getEventTargetId = getEventTargetId;
/**
 * Retourne le label Fr d'une date
 * @param dateOperation date à afficher
 * @returns {string} label FR de la date
 */
function getLabelDate(dateOperation) {
    return new Date(Date.parse(dateOperation)).toLocaleDateString("fr");
}
exports.getLabelDate = getLabelDate;
/**
 * Tri par libellé
 * @param categorie1 premier libellé
 * @param categorie2 2ème libellé
 * @returns {number} comparaison
 */
function sortLibellesCategories(categorie1, categorie2) {
    if (categorie1.categorieParente !== null && categorie1.categorieParente !== undefined && categorie2.categorieParente !== null && categorie2.categorieParente !== undefined) {
        if (categorie1.categorieParente.libelle > categorie2.categorieParente.libelle) {
            return 1;
        }
        else if (categorie1.categorieParente.libelle < categorie2.categorieParente.libelle) {
            return -1;
        }
    }
    if (categorie1.libelle > categorie2.libelle) {
        return 1;
    }
    else if (categorie1.libelle < categorie2.libelle) {
        return -1;
    }
    return 0;
}
exports.sortLibellesCategories = sortLibellesCategories;
/**
 * Tri des opérations, par date sinon par statut
 * @param {Operation} ope1 :  1ère opération
 * @param {Operation} ope2 2ème opération
 * @returns {number} comparaison
 */
function sortOperations(ope1, ope2) {
    // Premier TRI : Par date d'opération
    if (ope1.autresInfos.dateOperation === null && ope2.autresInfos.dateOperation !== null) {
        return -1;
    }
    else if (ope2.autresInfos.dateOperation === null && ope1.autresInfos.dateOperation !== null) {
        return 1;
    }
    else {
        var date1 = ope1.autresInfos.dateOperation;
        var date2 = ope2.autresInfos.dateOperation;
        if (date1 > date2) {
            return -1;
        }
        else if (date1 < date2) {
            return 1;
        }
    }
    var rangOpe1 = getRangEtatOperation(ope1.etat);
    var rangOpe2 = getRangEtatOperation(ope2.etat);
    // 2ème TRI : par Etat
    if (rangOpe1 > rangOpe2) {
        return 1;
    }
    else if (rangOpe1 < rangOpe2) {
        return -1;
    }
    // 3ème TRI : par date mise à jour
    var dateM1 = ope1.autresInfos.dateMaj;
    var dateM2 = ope2.autresInfos.dateMaj;
    if (dateM1 > dateM2) {
        return -1;
    }
    else if (dateM1 < dateM2) {
        return 1;
    }
    // Normalement n'arrive jamais
    return 0;
}
exports.sortOperations = sortOperations;
/**
 * Rang opération
 * @param etatOperation
 * @returns {number}
 */
function getRangEtatOperation(etatOperation) {
    var rang = 0;
    for (var etat in AppConstants.OPERATION_ETATS_ENUM) {
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
function getMonthFromString(mon) {
    return new Date(Date.parse(mon + " 1, 2012")).getMonth() + 1;
}
exports.getMonthFromString = getMonthFromString;
