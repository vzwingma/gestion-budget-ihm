/** Client HTTP **/
import {getOAuthToken, removeTokenFromStorage} from './Auth.service'
import * as AppConstants from "../Utils/AppTechEnums.constants";

let alreadyTraced = false;


/**
 * Log Out de la session si les tokens sont expirés
 */
function logOut() {

    removeTokenFromStorage();
    window.location = "/";
}

/**
 * Calcul de l'URL complétée
 * @param uri URI de base
 * @param path chemin de la ressource
 * @param params paramètres (optionnels)
 * @returns {*}
 */
function evaluateURL(uri, path, params) {
    let fullURL = uri + path;
    if (params != null) {
        params.forEach(param => {
            fullURL = fullURL.replace("{{}}", param)
        })
    }
    return fullURL;
}

/**
 * Completion du body
 * @param body : string body
 * @returns {json:null} body en JSON si body n'est pas null ou undefined
 */
function evaluateBody(body) {
    let jsonBody = null
    if (body !== undefined) {
        jsonBody = JSON.stringify(body)
        if (process.env.REACT_APP_CONFIG_DEBUG) {
            console.log("[WS] > Body: " + jsonBody);
        }
    }
    return jsonBody;
}

/**
 * Log de l'authentification
 */
function logAuth() {
    if (process.env.REACT_APP_CONFIG_DEBUG && !alreadyTraced) {
        console.log("[WS] > [X-Api-Key] : " + AppConstants.API_GW_ENUM.API_KEY);
        console.log("[WS] > [Bearer] : " + getOAuthToken());
        if (getOAuthToken() !== undefined && getOAuthToken() !== null) {
            alreadyTraced = true;
        }
    }
}

/**
 * Appel HTTP vers le backend
 * @param httpMethod méthode HTTP
 * @param uri URI de base
 * @param path chemin de la ressource
 * @param params paramètres (optionnels)
 * @param body body de la requête (optionnel)
 * @returns {Promise<Response>} réponse
 */
export function call(httpMethod, uri, path, params, body) {

    // Calcul de l'URL complétée
    const fullURL = evaluateURL(uri, path, params);

    console.log("[WS] > [" + httpMethod + " -> " + fullURL + "]")
    const jsonBody = evaluateBody(body);

    logAuth();

    return fetch(fullURL,
        {
            method: httpMethod,
            mode: "cors",
            headers: new Headers({
                'Content-Type': 'application/json',
                'X-Api-Key': AppConstants.API_GW_ENUM.API_KEY,
                'Authorization': 'Bearer ' + getOAuthToken()
            }),
            body: jsonBody
        })
        .then(res => {
            console.log("[WS] < [" + res.status + (res.statusText !== null && res.statusText !== "" ? " - " + res.statusText : "") + "]")
            if (res.status >= 200 && res.status < 300) {
                return res.json();
            } else if (res.status === 403) {
                console.log("Session expirée")
                logOut();
            } else {
                console.log(res);
                throw new Error(res.statusText);
            }
        })
        .catch(e => {
            console.log("Erreur lors de l'appel HTTP [" + fullURL + "]", e)
            throw new Error(e);
        })
}
