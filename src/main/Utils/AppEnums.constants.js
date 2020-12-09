
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
    }
}

/** HTTP Client Header **/
export const HTTP_HEADERS = new Headers({
        'Accept': 'application/json',
        'Origin': 'localhost',
        'Content-Type': 'application/json',
        'Authorization' : 'Bearer : eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ2endpbmdtYW5uIiwianRpIjoidnp3aW5nbWFubiIsIlVTRVJJRCI6IjU0ODQyNjgzODRiN2ZmMWU1ZjI2YjY5MiIsImlhdCI6MTU2ODU0MDMwNCwiZXhwIjoxNjY4NTQzOTA0fQ.uOI3MMQZWnD_a2QJcefFBCmoW7Wg0DzsIOaO267Me70AEHTT2YKpaJgCpQp06XKvu42BGacE-vvuDOVt7fD-sw'
});
