/**
 * Constantes des onglets de l'application
 */
export enum BUSINESS_ONGLETS {
    BUDGET,
    ANALYSES,
    ANALYSE_CATEGORIES,
    ANALYSE_TENDANCES,
    RECURRENTS
}


/**
 * Etat des opérations
 */
export enum OPERATION_STATUS_ENUM {
    EN_RETARD = "EN_RETARD",
    EN_RETARD_LEGACY = "[En Retard]",
    DERNIERE_ECHEANCE = "DERNIERE_ECHEANCE"
}

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
    DROIT_RAZ_BUDGET,
    DROIT_CREATE_OPERATION
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
 * @type {{CAT_RENTREE_ARGENT: string, SOUS_CAT_VIREMENT_INTER_COMPTES: string}}
 */
export const BUSINESS_GUID: {
    CAT_RENTREE_ARGENT: string;
    SS_CAT_VIREMENT_INTERNE: string;
} = {
    CAT_RENTREE_ARGENT: "ea6dcc12-3349-4047-a1e5-cd1d7254f16e",
    SS_CAT_VIREMENT_INTERNE: "ed3f6100-5dbd-4b68-860e-0c97ae1bbc63"
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

export enum TYPES_CATEGORIES_OPERATION_ENUM {
    // Revenu
    REVENUS = "REVENUS",
    // essentiel
    ESSENTIEL = "ESSENTIEL",
    // plaisir
    PLAISIR     = "PLAISIR",
    // épargne
    ECONOMIES = "ECONOMIES",
}


/**
 * Constantes des périodes pour la liste des périodes
 */
export enum PERIODES_MENSUALITE_ENUM {
    PONCTUELLE      = "PONCTUELLE",
    MENSUELLE       = "MENSUELLE",
    TRIMESTRIELLE   = "TRIMESTRIELLE",
    SEMESTRIELLE    = "SEMESTRIELLE",
    ANNUELLE        = "ANNUELLE"
}


/**
 * Constantes des type d'opération
 */
export enum TYPES_OPERATION_ENUM {
    CREDIT  = "CREDIT",
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
