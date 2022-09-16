import * as ClientHTTP from "../../Services/ClientHTTP.service";
import * as AppConstants from "../../Utils/AppEnums.constants";
import {toast} from "react-toastify";

/**
 * External services de la liste des opérations
 */


    /**
     * Modification de l'opération sur action des boutons
     * @param idOperation id opération
     * @param idBudget id budget
     */
    export function callSetOperationAsLast(idOperation, idBudget){
        console.log("Dernière opération " + idOperation + " du budget " + idBudget);

        ClientHTTP.call("POST", AppConstants.BACKEND_ENUM.URL_OPERATIONS, AppConstants.SERVICES_URL.OPERATIONS.DERNIERE,
            [ idBudget, idOperation ])
            .then((data) => {
                this.updateOperationTag(idOperation, data)
            })
            .catch((e) => {
                console.log("Erreur lors de la mise à jour de l'opération " + idOperation + " >> "+ e);
                toast.error("Erreur lors de la mise à jour de l'opération comme dernière opération traitée")
            })

    }