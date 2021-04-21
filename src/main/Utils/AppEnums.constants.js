
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
        INTERVALLE : "/budgets/v1/{{}}/intervalles",
        GET : "/budgets/v1/query?idCompte={{}}&annee={{}}&mois={{}}"
    },
    OPERATIONS : {
        UPDATE : "/budgets/v1/{{}}/operations/{{}}"
    },
    PARAMETRES : {
        CATEGORIES : "/parametres/v1/categories"
    }
    
/*
    USERS_ACCESS_DATE_FULL = "/utilisateurs/v1/lastaccessdate";
    USERS_PREFS_FULL = "/utilisateurs/v1/preferences";
    COMPTES_LIST_FULL = "/comptes/v1";
    COMPTES_ID_FULL = "/comptes/v1/{idCompte}";
    BUDGET_ID_FULL = "/budgets/v1/{idBudget}";
    BUDGET_QUERY_FULL = "/budgets/v1/query";
    BUDGET_ETAT_FULL = "/budgets/v1/{idBudget}/etat";
    BUDGET_UP_TO_DATE_FULL = "/budgets/v1/{idBudget}/upToDate";
    BUDGET_COMPTE_OPERATIONS_LIBELLES_FULL = "/budgets/v1/{idCompte}/operations/libelles";
    BUDGET_OPERATION_DERNIERE_FULL = "/budgets/v1/{idBudget}/operations/{idOperation}/derniereOperation";
    BUDGET_OPERATION_INTERCOMPTE_FULL = "/budgets/v1/{idBudget}/operations/{idOperation}/versCompte/{idCompte}";
*/
}
