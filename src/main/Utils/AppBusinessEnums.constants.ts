/**
 * Constantes des onglets de l'application
 */
export enum BUSINESS_ONGLETS {
    BUDGET,
    ANALYSE,
    ANALYSE_TEMP
}


export const EN_RETARD: string = "[En Retard]";
/**
 * Enumération des droits utilisateur.
 *
 * Cette énumération définit les différents droits que peut avoir un utilisateur
 * dans l'application de gestion de budget.
 *
 * @enum {number}
 * @property {number} CLOTURE_BUDGET - Droit de clôturer un budget.
 * @property {number} RAZ_BUDGET - Droit de réinitialiser un budget.
 */
export enum UTILISATEUR_DROITS {
    DROIT_CLOTURE_BUDGET,
    DROIT_RAZ_BUDGET
}


/**
 * Enumération représentant les préférences utilisateur.
 *
 * @enum {number}
 * @readonly
 */
export enum UTILISATEUR_PREFERENCES {
    STATUT_NLLE_DEPENSE
}



/**
 * GUID métiers
 * @type {{CAT_VIREMENT: string, SOUS_CAT_INTER_COMPTES: string, CAT_PRELEVEMENT_MENSUEL: string}}
 */
export const BUSINESS_GUID: {
    CAT_VIREMENT: string;
    SOUS_CAT_INTER_COMPTES: string;
    CAT_PRELEVEMENT_MENSUEL: string;
} = {
    CAT_VIREMENT: "ea6dcc12-3349-4047-a1e5-cd1d7254f16e",
    CAT_PRELEVEMENT_MENSUEL: "504beea7-ed52-438a-aced-15e9603b82ab",
    SOUS_CAT_INTER_COMPTES: "ed3f6100-5dbd-4b68-860e-0c97ae1bbc63"
}


/**
 * Etat des opérations
 */
export enum OPERATION_ETATS_ENUM {
    REALISEE = "REALISEE",
    PLANIFIEE = "PLANIFIEE",
    PREVUE = "PREVUE",
    REPORTEE = "REPORTEE",
    ANNULEE = "ANNULEE",
    SUPPRIMEE = "SUPPRIMEE"
}


/**
 * Constantes des périodes pour la liste des périodes
 */
export enum PERIODES_MENSUALITE_ENUM {
    PONCTUELLE = "PONCTUELLE",
    MENSUELLE = "MENSUELLE",
    TRIMESTRIELLE = "TRIMESTRIELLE",
    SEMESTRIELLE = "SEMESTRIELLE",
    ANNUELLE = "ANNUELLE"
}


/**
 * Constantes des type d'opération
 */
export enum TYPES_OPERATION_ENUM {
    CREDIT = "CREDIT",
    DEPENSE = "DEPENSE"
}

/*
 * Constantes des ID pour le formulaire
 */
export enum ACTIONS_BUDGET_ENUM {
    CREATE = "CREATE",
    CLOSE_A_CONFIRMER = "CLOSE_A_CONFIRMER",
    REINIT_A_CONFIRMER = "REINIT_A_CONFIRMER",
    ANNULER = "ANNULER",
    CONFIRMER = "CONFIRMER",
}
