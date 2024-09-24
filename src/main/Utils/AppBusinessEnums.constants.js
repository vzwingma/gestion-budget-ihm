"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TYPES_OPERATION_ENUM = exports.PERIODES_MENSUALITE_ENUM = exports.OPERATION_ETATS_ENUM = exports.BUSINESS_GUID = exports.UTILISATEUR_DROITS = exports.BUSINESS_ONGLETS = void 0;
/**
 * Constantes des onglets de l'application
 * @type {{BUDGET: string, ANALYSE: string, ANALYSE_TEMP: string}}
 */
exports.BUSINESS_ONGLETS = {
    BUDGET: "BUDGET",
    ANALYSE: "ANALYSE",
    ANALYSE_TEMP: "ANALYSETEMP"
};
/**
 * Droits de l'utilisateur
 * @type {{DROITS: {CLOTURE_BUDGET: string, RAZ_BUDGET: string}, PREFERENCES: {STATUT_NLLE_DEPENSE: string}}}
 */
exports.UTILISATEUR_DROITS = {
    DROITS: {
        CLOTURE_BUDGET: "DROIT_RAZ_BUDGET",
        RAZ_BUDGET: "DROIT_RAZ_BUDGET"
    },
    PREFERENCES: {
        STATUT_NLLE_DEPENSE: "PREFS_STATUT_NLLE_DEPENSE",
    }
};
/**
 * GUID métiers
 * @type {{CAT_VIREMENT: string, SOUS_CAT_INTER_COMPTES: string, CAT_PRELEVEMENT_MENSUEL: string}}
 */
exports.BUSINESS_GUID = {
    CAT_VIREMENT: "ea6dcc12-3349-4047-a1e5-cd1d7254f16e",
    CAT_PRELEVEMENT_MENSUEL: "504beea7-ed52-438a-aced-15e9603b82ab",
    SOUS_CAT_INTER_COMPTES: "ed3f6100-5dbd-4b68-860e-0c97ae1bbc63"
};
/**
 * Etat des opérations
 * @type {{REALISEE: string, PLANIFIEE: string, PREVUE: string, REPORTEE: string, ANNULEE: string, SUPPRIMEE: string}}
 */
exports.OPERATION_ETATS_ENUM = {
    PREVUE: "PREVUE",
    REALISEE: "REALISEE",
    ANNULEE: "ANNULEE",
    SUPPRIMEE: "SUPPRIMEE",
    REPORTEE: "REPORTEE",
    PLANIFIEE: "PLANIFIEE"
};
/**
 * Constantes des périodes pour la liste des périodes
 * @type {string[]}
 */
exports.PERIODES_MENSUALITE_ENUM = [
    "PONCTUELLE",
    "MENSUELLE",
    "TRIMESTRIELLE",
    "SEMESTRIELLE",
    "ANNUELLE"
];
/**
 * Constantes des type d'opération
 * @type {{CREDIT: string, DEPENSE: string}}
 */
exports.TYPES_OPERATION_ENUM = {
    CREDIT: "CREDIT",
    DEPENSE: "DEPENSE"
};
