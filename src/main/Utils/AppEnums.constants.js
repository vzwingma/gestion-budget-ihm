
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
        GET_INFO : "/actuator/info"
    },
    COMPTES : {
        GET_ALL : "/comptes/v1"
    },
    BUDGETS : {
        INTERVALLE : "/budgets/v1/{{}}/intervalles"
    },
    OPERATIONS : {
        LIST : "/budgets/v1/query?idCompte={{}}&annee={{}}&mois={{}}"
    }
}
