/** Client HTTP **/
import { getOAuthToken } from './Auth.service'
import React from "react";


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
 * @returns {Promise<Response>} réponse
 */
export function call(httpMethod, uri, path, params ) {

    // Calcul de l'URL complétée
    let fullURL = uri + path;
    if(params != null){
        params.forEach(param => {
            fullURL = fullURL.replace("{{}}", param)
        })
    }

    console.log("[WS] > [" + httpMethod + "/"+ fullURL + "]")
    return fetch(fullURL,
        {
            method: httpMethod, headers: this.getHeaders()
        })
        .then(res => {
            console.log("[WS] < [" + res.status + " - " + res.statusText +"]")
            return res.json();
        })
        .catch((e) => {
            console.log("Erreur lors de l'appel HTTP " + url + " :: " + e)
        })
}