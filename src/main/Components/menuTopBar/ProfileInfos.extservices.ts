/**
 * External services du profil
 */

import {call} from "../../Services/ClientHTTP.service";
import {BACKEND_ENUM, METHODE_HTTP, SERVICES_URL} from "../../Utils/AppTechEnums.constants";
import ProfileUserModel from "../../Models/profiles/ProfileUser.model";
import {Dispatch, SetStateAction} from "react";

/**
 * Modification de l'opération sur action des boutons
 */
export function getLastAccessDateUtilisateur(setState: Dispatch<SetStateAction<string>>) {
    call(METHODE_HTTP.GET, BACKEND_ENUM.URL_UTILISATEURS, SERVICES_URL.UTILISATEURS.ACCESS_DATE)
        .then((data : ProfileUserModel) => {
            const date = new Date(data.lastAccessTime * 1000);
            setState(date.toLocaleDateString() + " - " + date.toLocaleTimeString());
        })
        .catch((e) => {
            console.log("Erreur lors de la recherche de la dernière connexion", e);
        })

}
