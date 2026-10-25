/**
 * External services du profil
 */

import {call} from "../../Services/ClientHTTP.service.ts";
import {BACKEND_ENUM, METHODE_HTTP, SERVICES_URL} from "../../Utils/AppTechEnums.constants.ts";
import ProfileUserModel from "../../Models/profiles/ProfileUser.model.ts";

/**
 * Dernière connexion de l'utilisateur, formatée (version Promise, pour `useFetch` - AP 006 T11).
 * Erreur loggée puis relancée.
 */
export function fetchLastAccessDateUtilisateur(): Promise<string> {
    return call(METHODE_HTTP.GET, BACKEND_ENUM.URL_UTILISATEURS, SERVICES_URL.UTILISATEURS.ACCESS_DATE)
        .then((data : ProfileUserModel) => {
            const date = new Date(data.lastAccessTime * 1000);
            return date.toLocaleDateString() + " - " + date.toLocaleTimeString();
        })
        .catch((e) => {
            console.error("Erreur lors de la recherche de la dernière connexion", e);
            throw e;
        });
}
