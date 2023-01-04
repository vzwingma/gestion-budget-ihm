import * as ClientHTTP from "../Services/ClientHTTP.service";
import * as AppConstants from "../Utils/AppEnums.constants";

/**
 * External services du profil
 */


    /**
     * Modification de l'opération sur action des boutons
     */
    export function getLastAccessDateUtilisateur(){
        ClientHTTP.call("GET", AppConstants.BACKEND_ENUM.URL_UTILISATEURS, AppConstants.SERVICES_URL.UTILISATEURS.ACCESS_DATE, null)
            .then((data) => {
                const date = new Date(data.lastAccessTime*1000);
                return date.toLocaleDateString() + " - " + date.toLocaleTimeString();
            })
            .catch((e) => {
                console.log("Erreur lors de la recherche de la dernière connexion >> "+ e);
            })

    }


    export function updateLastAccessDateUtilisateur(lastConnectedDate){
        this.setState({
            lastConnectedDate : lastConnectedDate
        })
    }