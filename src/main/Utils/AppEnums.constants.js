

/**
 Enum de la config OIDC
 */
export const OIDC_ENUM = {
    AUTHORITY: process.env.REACT_APP_CONFIG_OIDC_AUTHORITY,
    CLIENT_ID: process.env.REACT_APP_CONFIG_OIDC_CLIENT_ID,
    CLIENT_SECRET: process.env.REACT_APP_CONFIG_OIDC_CLIENT_SECRET,
    URL: window.location.href
}

export const API_GW_ENUM = {
    API_KEY: process.env.REACT_APP_CONFIG_API_KEY
}

/**
    Enum des Backends
*/
export const BACKEND_ENUM = {
    URL_COMPTES: process.env.REACT_APP_CONFIG_URL_COMPTES + "/comptes/v2",
    URL_PARAMS: process.env.REACT_APP_CONFIG_URL_PARAMS + "/parametres/v2",
    URL_UTILISATEURS: process.env.REACT_APP_CONFIG_URL_UTILISATEURS + "/utilisateurs/v2",
    URL_OPERATIONS: process.env.REACT_APP_CONFIG_URL_OPERATIONS + "/budgets/v2"
}
/**
 *  Services
 **/
export const SERVICES_URL = {
    INFOS : {
        GET_INFO : "/_info"
    },
    COMPTES : {
        GET_ALL: "/"
    },
    BUDGETS : {
        REINIT: "/{{}}",
        INTERVALLE: "/{{}}/intervalles",
        GET: "/query?idCompte={{}}&annee={{}}&mois={{}}",
        ETAT: "/{{}}/etat?actif={{}}"
    },
    OPERATIONS : {
        CREATE: "/{{}}/operations",
        UPDATE: "/{{}}/operations/{{}}",
        DERNIERE: "/{{}}/operations/{{}}/derniereOperation",
        INTERCOMPTE: "/{{}}/operations/versCompte/{{}}"
    },
    PARAMETRES : {
        CATEGORIES: "/categories"
    },
    UTILISATEURS : {
        ACCESS_DATE: "/lastaccessdate",
        USERS_PREFS: "/preferences"
    }
}
/**
 *  Droits de l'utilisateur
 **/
export const UTILISATEUR_DROITS = {
    DROITS : {
        CLOTURE_BUDGET : "DROIT_RAZ_BUDGET",
        RAZ_BUDGET : "DROIT_RAZ_BUDGET"
    },
    PREFERENCES : {
        STATUT_NLLE_DEPENSE: "PREFS_STATUT_NLLE_DEPENSE",
    }
}



export const BUSINESS_GUID = {
    CAT_VIREMENT : "ea6dcc12-3349-4047-a1e5-cd1d7254f16e",
    CAT_PRELEVEMENT_MENSUEL : "504beea7-ed52-438a-aced-15e9603b82ab",
    SOUS_CAT_INTER_COMPTES : "ed3f6100-5dbd-4b68-860e-0c97ae1bbc63"
}
