import * as ClientHTTP from "../Services/ClientHTTP.service";
import * as AppConstants from "../Utils/AppTechEnums.constants";

/**
 * External services du profil
 */

/**
 * Modification de l'opération sur action des boutons
 */
export function getLastAccessDateUtilisateur(setState: React.Dispatch<React.SetStateAction<string>>) {
    ClientHTTP.call(AppConstants.METHODE_HTTP.GET, AppConstants.BACKEND_ENUM.URL_UTILISATEURS, AppConstants.SERVICES_URL.UTILISATEURS.ACCESS_DATE)
        .then((data : any) => {
            const date = new Date(data.lastAccessTime * 1000);
            setState(date.toLocaleDateString() + " - " + date.toLocaleTimeString());
        })
        .catch((e) => {
            console.log("Erreur lors de la recherche de la dernière connexion", e);
        })

}
