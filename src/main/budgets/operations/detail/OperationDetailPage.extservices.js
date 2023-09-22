import * as ClientHTTP from "../../../Services/ClientHTTP.service";
import {toast} from "react-toastify";
import {OPERATIONS_ENUM} from "../../../Utils/AppBusinessEnums.constants";
import {BACKEND_ENUM, SERVICES_URL} from "../../../Utils/AppTechEnums.constants";


/**
 * Modification de l'opération sur action
 * @param operation opération modifiée
 * @param budget associé
 */
export function saveOperation(operation, budget) {

    if (budget.actif) {
        ClientHTTP.call(operation.etat === OPERATIONS_ENUM.SUPPRIMEE ? "DELETE" : "POST",
            BACKEND_ENUM.URL_OPERATIONS, SERVICES_URL.OPERATIONS.UPDATE,
            [budget.id, operation.id],
            operation)
            .then((data) => {

                // Update du budget global (parent)
                this.props.onOperationChange(data);
                toast.success("Mise à jour de l'opération correctement effectuée")

            })
            .catch((e) => {
                console.log("Erreur lors de la mise à jour de l'opération " + operation.id + " >> " + e);
                toast.error("Erreur lors de la mise à jour de l'opération")
            })
    } else {
        console.log("Impossible de modifier l'opération " + operation.id + " sur un budget clos");
        toast.warn("Impossible de sauvegarder une opération sur un budget clos")
    }

}
