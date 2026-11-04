/** Client HTTP **/
import {v7} from 'uuid';
import {API_GW_ENUM} from '../Utils/AppTechEnums.constants.ts';
import {debug, isDebugEnabled} from '../Utils/Debug.utils.ts';
import {getOAuthToken, removeTokenFromStorage} from './Auth.service.ts'
import {HttpError} from './HttpError.ts';

let alreadyTraced: boolean = false;
/** Drapeau anti-réentrance : la déconnexion n'est déclenchée qu'une fois, même avec plusieurs appels en parallèle **/
let deconnexionEnCours: boolean = false;


/**
 * Log Out de repli (si aucun gestionnaire n'est enregistré) : suppression du token et retour à l'accueil
 */
function logOut() {

    removeTokenFromStorage();
    globalThis.location.href = "/";
}

let gestionnaireDeconnexion: () => void = logOut;

/**
 * Enregistre le gestionnaire appelé sur un 401 / 403 (enregistré par `useAuthTokenSync`).
 * Sans argument, retour au comportement de repli (`logOut`). Réarme la garde de déconnexion unique.
 * @param gestionnaire fonction de déconnexion
 */
export function setGestionnaireDeconnexion(gestionnaire?: () => void): void {
    gestionnaireDeconnexion = gestionnaire ?? logOut;
    deconnexionEnCours = false;
}

/** Déclenche la déconnexion une seule fois **/
function declencherDeconnexion(): void {
    if (deconnexionEnCours) {
        return;
    }
    deconnexionEnCours = true;
    gestionnaireDeconnexion();
}

/**
 * Calcul de l'URL complétée
 * @param uri URI de base
 * @param path chemin de la ressource
 * @param params paramètres (optionnels)
 * @returns {string} URL complétée
 */
function evaluateURL(uri: string, path: string, params?: string[]): string {
    let fullURL = uri + path;
    if (params != null) {
        params.forEach(param => {
            // encodeURIComponent : pas d'injection de chemin / query (`/`, `?`, `&`, `#`) ; callback : pas d'interprétation des motifs `$&`, `$1`… de replace
            fullURL = fullURL.replace("{{}}", () => encodeURIComponent(param))
        })
    }
    return fullURL;
}

/**
 * Completion du body
 * @param body : string body
 * @returns {string:null} body en JSON si body n'est pas null ou undefined
 */
function evaluateBody(body?: any): string|null {
    let jsonBody = null
    if (body !== undefined && body !== null) {
        jsonBody = JSON.stringify(body)
        if (isDebugEnabled()) {
            debug("[WS] > Body: ", jsonBody);
        }
    }
    return jsonBody;
}

/**
 * Log de l'authentification
 */
function logAuth(): void {
    if (isDebugEnabled() && !alreadyTraced) {
        debug("[WS] > [X-Api-Key] : " + API_GW_ENUM.API_KEY);
        debug("[WS] > [Bearer] : " + getOAuthToken());
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
 * @returns {Promise<any>} réponse
 */
export async function call(httpMethod: string, uri: string, path: string, params?: string[], body?: any): Promise<any> {

    // Calcul de l'URL complétée
    const fullURL = evaluateURL(uri, path, params);
    const uuid = v7().slice(0, 8);
    if (isDebugEnabled()) {
        debug("[WS-"+uuid+"] > [" + httpMethod + " -> " + fullURL + "]")
    }
    const jsonBody = evaluateBody(body);

    logAuth();

    const headers = new Headers({
        'Content-Type': 'application/json',
        'X-Api-Key': API_GW_ENUM.API_KEY
    });
    const token = getOAuthToken();
    if (token) {
        headers.set('Authorization', 'Bearer ' + token);
    }

    let res: Response;
    try {
        res = await fetch(fullURL,
            {
                method: httpMethod.toString(),
                mode: 'cors',
                headers: headers,
                body: jsonBody
            });
    } catch (e) {
        console.error("Erreur lors de l'appel HTTP [" + fullURL + "]", e);
        throw new HttpError(undefined, e instanceof Error ? e.message : String(e), undefined, {cause: e});
    }

    if (res.status >= 200 && res.status < 300) {
        return res.json();
    }

    const trace = "[WS-" + uuid + "] < [" + res.status + (res.statusText !== null && res.statusText !== "" ? " - " + res.statusText : "") + "]";
    if (res.status === 401 || res.status === 403) {
        console.warn(trace);
        declencherDeconnexion();
        throw new HttpError(res.status, res.statusText);
    }

    console.error(trace);
    let corps: string | undefined;
    try {
        corps = await res.text();
    } catch {
        corps = undefined;
    }
    throw new HttpError(res.status, res.statusText, corps);
}
