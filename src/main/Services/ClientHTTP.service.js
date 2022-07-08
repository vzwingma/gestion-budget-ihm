/** Service d'Authentification**/
 import { getOAuthToken } from './Auth.service'

    /** HTTP Client Header **/
    export const getHeaders = () => new Headers({
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization' : 'Bearer ' + getOAuthToken()
    });

/**
 * Calcul de l'URL appelée
 * @param uri URI de base
 * @param path chemin
 * @param params paramètres
 * @returns {*} URL complétée
 */
export const getURLRequest = (uri, path, params) => {
        var fullURL = uri + path;
        if(params != null){
            params.forEach(param => {
                fullURL = fullURL.replace("{{}}", param)
            })
        }
        console.log("[WS] > [" + fullURL + "]")
        return fullURL;
    };

/**
 * Fonction pour logger la réponse
 * @param data HTTP Response
 * @returns {*} JSON Data
 */
export const getJSONResponse = (data) => {

        console.log("[WS] < [" + data.status + " - " + data.statusText +"]")
        return data.json();
    }