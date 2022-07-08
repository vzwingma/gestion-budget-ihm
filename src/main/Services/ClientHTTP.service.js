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
        return fullURL;
    };

/**
 * Appel HTTP vers le backend
 * @param httpMethod méthode HTTP
 * @param uri URI de base
 * @param path chemin de la ressource
 * @param params paramètres (optionnels)
 * @returns {Promise<Response>} réponse
 */
export function call(httpMethod, uri, path, params ) {
    const fullURL = this.getURLRequest(uri, path, params)
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