/**
 Enum de la config OIDC
 */
export const OIDC_ENUM = {
    AUTHORITY: process.env.REACT_APP_CONFIG_OIDC_AUTHORITY,
    CLIENT_ID: process.env.REACT_APP_CONFIG_OIDC_CLIENT_ID,
    CLIENT_SECRET: process.env.REACT_APP_CONFIG_OIDC_CLIENT_SECRET,
    URL: window.location.href
}

/**
 * Enum des valeur API KEY
 * @type {{API_KEY: *}}
 */
export const API_GW_ENUM = {
    API_KEY: process.env.REACT_APP_CONFIG_API_KEY
}

/**
 * Enum des Backends
 * @type {{URL_PARAMS: string, URL_COMPTES: string, URL_UTILISATEURS: string, URL_OPERATIONS: string}}
 */
export const BACKEND_ENUM = {
    URL_COMPTES: process.env.REACT_APP_CONFIG_URL_COMPTES + "/comptes/v2",
    URL_PARAMS: process.env.REACT_APP_CONFIG_URL_PARAMS + "/parametres/v2",
    URL_UTILISATEURS: process.env.REACT_APP_CONFIG_URL_UTILISATEURS + "/utilisateurs/v2",
    URL_OPERATIONS: process.env.REACT_APP_CONFIG_URL_OPERATIONS + "/budgets/v2"
}


/**
 * Enum des méthodes HTTP
 * @type {{DELETE: string, POST: string, GET: string}}
 */
export const METHODE_HTTP = {
    GET: "GET",
    DELETE: "DELETE",
    POST: "POST"
}

/**
 * Services
 * @type {{COMPTES: {GET_ALL: string}, OPERATIONS: {INTERCOMPTE: string, CREATE: string, DERNIERE: string, UPDATE: string}, PARAMETRES: {CATEGORIES: string}, BUDGETS: {ETAT: string, GET: string, INTERVALLE: string, REINIT: string}, INFOS: {GET_INFO: string}, UTILISATEURS: {USERS_PREFS: string, ACCESS_DATE: string}}}
 */
export const SERVICES_URL = {
    INFOS: {
        GET_INFO: "/_info"
    },
    COMPTES: {
        GET_ALL: "/tous"
    },
    BUDGETS: {
        REINIT: "/{{}}",
        INTERVALLE: "/{{}}/intervalles",
        GET_BY_COMPTE_DATES: "/query?idCompte={{}}&annee={{}}&mois={{}}",
        GET_BY_COMPTE: "/query?idCompte={{}}",
        SOLDES: "/soldes?idCompte={{}}&annee={{}}&mois={{}}",
        ETAT: "/{{}}/etat?actif={{}}"
    },
    OPERATIONS: {
        CREATE: "/{{}}/operations",
        UPDATE: "/{{}}/operations/{{}}",
        DERNIERE: "/{{}}/operations/{{}}/derniereOperation",
        INTERCOMPTE: "/{{}}/operations/versCompte/{{}}",
        LIBELLES: "/compte/{{}}/operations/libelles"
    },
    PARAMETRES: {
        CATEGORIES: "/categories"
    },
    UTILISATEURS: {
        ACCESS_DATE: "/lastaccessdate",
        USERS_PREFS: "/preferences"
    }
}
