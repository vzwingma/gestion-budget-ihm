/** Client HTTP **/
import { getOAuthToken } from './Auth.service'

/**
 * Generate http Headers to backend calls
 * @returns {Headers}
 */
    export const getHeaders = () => new Headers({
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization' : 'Bearer ' + getOAuthToken()
    });


/**
 * Appel HTTP vers le backend
 * @param httpMethod méthode HTTP
 * @param uri URI de base
 * @param path chemin de la ressource
 * @param params paramètres (optionnels)
 * @param body body de la requête (optionnel)
 * @returns {Promise<Response>} réponse
 */
export function call(httpMethod, uri, path, params, body ) {

    // Calcul de l'URL complétée
    let fullURL = uri + path;
    if(params != null){
        params.forEach(param => {
            fullURL = fullURL.replace("{{}}", param)
        })
    }

    console.log("[WS] > [" + httpMethod + "/"+ fullURL + "]")
    let jsonBody = null
    if(body !== undefined){
        jsonBody = JSON.stringify(body)
    //    console.log("[WS] > Body: " + jsonBody);
    }

    return fetch(fullURL,
        {
            method: httpMethod,
            headers: this.getHeaders(),
            body: jsonBody
        })
        .then(res => {
            console.log("[WS] < [" + res.status + " - " + res.statusText +"]")
            if(res.status >= 200 && res.status < 300){
                return res.json();
            }
            else{
                throw new Error(res.statusText);
            }
        })
        .catch(e => {
            console.log("Erreur lors de l'appel HTTP " + fullURL + " :: " + e)
            throw new Error(e);
        })
}