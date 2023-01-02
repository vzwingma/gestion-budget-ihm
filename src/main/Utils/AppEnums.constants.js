

/*
 Enum de la config OIDC
 */
export const OIDC_ENUM = {
    AUTHORITY: process.env.REACT_APP_CONFIG_OIDC_AUTHORITY,
    CLIENT_ID: process.env.REACT_APP_CONFIG_OIDC_CLIENT_ID,
    CLIENT_SECRET: process.env.REACT_APP_CONFIG_OIDC_CLIENT_SECRET,
    URL: window.location.href
}

/* Enum des Backends */
export const BACKEND_ENUM = {
    URL_COMPTES : process.env.REACT_APP_CONFIG_URL_COMPTES,
    URL_PARAMS : process.env.REACT_APP_CONFIG_URL_PARAMS,
    URL_UTILISATEURS : process.env.REACT_APP_CONFIG_URL_UTILISATEURS,
    URL_OPERATIONS : process.env.REACT_APP_CONFIG_URL_OPERATIONS
}
/* Services */
export const SERVICES_URL = {
    INFOS : {
        GET_INFO : "/_info"
    },
    COMPTES : {
        GET_ALL : "/comptes/v1"
    },
    BUDGETS : {
        REINIT: "/budgets/v1/{{}}",
        INTERVALLE : "/budgets/v1/{{}}/intervalles",
        GET : "/budgets/v1/query?idCompte={{}}&annee={{}}&mois={{}}",
        ETAT : "/budgets/v1/{{}}/etat?actif={{}}"
    },
    OPERATIONS : {
        CREATE : "/budgets/v1/{{}}/operations",
        UPDATE : "/budgets/v1/{{}}/operations/{{}}",
        DERNIERE : "/budgets/v1/{{}}/operations/{{}}/derniereOperation",
        INTERCOMPTE : "/budgets/v1/{{}}/operations/versCompte/{{}}"
    },
    PARAMETRES : {
        CATEGORIES : "/parametres/v1/categories"
    },
    UTILISATEURS : {
        ACCESS_DATE : "/utilisateurs/v1/lastaccessdate",
        USERS_PREFS : "/utilisateurs/v1/preferences"
    }
    
/*
    BUDGET_UP_TO_DATE_FULL = "/budgets/v1/{idBudget}/upToDate";
*/

}

export const BUSINESS_GUID = {
    CAT_VIREMENT : "ea6dcc12-3349-4047-a1e5-cd1d7254f16e",
    CAT_PRELEVEMENT_MENSUEL : "504beea7-ed52-438a-aced-15e9603b82ab",
    SOUS_CAT_INTER_COMPTES : "ed3f6100-5dbd-4b68-860e-0c97ae1bbc63"
}
