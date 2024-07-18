/** Client HTTP **/
import {getOAuthToken, removeTokenFromStorage} from './Auth.service'
import * as AppConstants from "../Utils/AppTechEnums.constants";
import {v4 as uuidGen} from 'uuid';

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
            console.log("[WS] > [Body] ", jsonBody);
        }
    }
    return jsonBody;
}

/**
 * Log de l'authentification
 */
function logAuth(traceId, parentId) {
    if (process.env.REACT_APP_CONFIG_DEBUG && !alreadyTraced) {
        traceLog(traceId, parentId, "> [X-Api-Key] : " + AppConstants.API_GW_ENUM.API_KEY);
        traceLog(traceId, parentId, "> [Bearer] : " + getOAuthToken());
        if (getOAuthToken() !== undefined && getOAuthToken() !== null) {
            alreadyTraced = true;
        }
    }
}

/**
 * Trace du contenu WS avec traceId
 * @param traceId id de la trace
 * @param parentId id du parent de la trace
 * @param logContent contenu du log
 */
function traceLog(traceId: string, parentId: string, logContent: string[]) {
    console.log("[WS]", "[traceId:" + traceId + ", parentId:" + parentId + "]", logContent);
}

/**
 * Début du watch de la réponse
 * @param traceId id de la trace
 */
function startWatch(traceId: string) {
    localStorage.setItem(traceId, new Date().getTime());
}

/**
 * Fin du watch de la réponse
 * @param traceId id de la trace
 * @param parentId id du parent de la trace
 * @param res réponse
 * @returns {number} temps de réponse en ms
 */
function stopWatch(traceId: string, parentId: string, res) {
    let responseTime = new Date().getTime() - localStorage.getItem(traceId);
    localStorage.removeItem(traceId);
    traceLog(traceId, parentId, "< [" + res.status + (res.statusText !== null && res.statusText !== "" ? " - " + res.statusText : "") + "][t:" + responseTime + "ms]");
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
    let traceId = uuidGen().replaceAll("-", "");
    let parentId = uuidGen().replaceAll("-", "").substring(0, 16);

    traceLog(traceId, parentId, "> [" + httpMethod + "/" + fullURL + "]");
    logAuth(traceId);

    // Début du watch
    startWatch(traceId);

    return fetch(fullURL,
        {
            method: httpMethod,
            mode: "cors",
            headers: new Headers({
                'Content-Type': 'application/json',
                'X-Api-Key': AppConstants.API_GW_ENUM.API_KEY,
                'Authorization': 'Bearer ' + getOAuthToken(),
                'traceparent': "00-" + traceId + "-" + parentId + "-01",
            }),
            body: evaluateBody(body)
        })
        .then(res => {

            // Fin du watch
            stopWatch(traceId, parentId, res);

            if (res.status >= 200 && res.status < 300) {
                return res.json();
            } else if (res.status === 403) {
                traceLog(traceId, parentId, "Session expirée")
                logOut();
            } else {
                traceLog(traceId, parentId, res);
                throw new Error(res.statusText);
            }
        })
        .catch(e => {
            traceLog(traceId, parentId, "Erreur lors de l'appel HTTP [" + fullURL + "]", e)
            throw new Error(e);
        })
}
