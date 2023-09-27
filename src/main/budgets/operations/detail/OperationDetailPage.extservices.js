import * as ClientHTTP from "../../../Services/ClientHTTP.service";
import {toast} from "react-toastify";
import {OPERATIONS_ENUM} from "../../../Utils/AppBusinessEnums.constants";
import * as AppConstants from "../../../Utils/AppTechEnums.constants";
import {BACKEND_ENUM, SERVICES_URL} from "../../../Utils/AppTechEnums.constants";
import {v4 as uuidGen} from 'uuid';

/**
 * Modification de l'opération sur action
 * @param operation opération modifiée
 * @param budget associé
 */
export function saveOperation(operation, budget) {

    if (budget.actif) {
        console.log((operation.id === -1 ? "Création" : "Mise à jour") + " d'une opération sur le budget : " + budget.id)
        if (operation.id === -1) {
            operation.id = uuidGen();
        }

        ClientHTTP.call(operation.etat === OPERATIONS_ENUM.SUPPRIMEE ? "DELETE" : "POST",
            BACKEND_ENUM.URL_OPERATIONS, SERVICES_URL.OPERATIONS.UPDATE,
            [budget.id, operation.id],
            operation)
            .then((data) => {

                // Update du budget global (parent)
                this.props.onOperationChange(data);
                toast.success((operation.id === -1 ? "Création" : "Mise à jour") + " de l'opération correctement effectuée")

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

/**
 * Appels WS vers pour enregistrer l'opération intercompte sur le backend
 * @param operation opération à enregistrer
 * @param budget budget concerné
 * @param compteCible compte cible pour la 2nde opération (intercompte)
 */
export function saveOperationIntercompte(operation, budget, compteCible) {
    console.log("Création d'une opération intercompte sur le budget [" + budget.id + "] vers le compte [" + compteCible + "]")
    ClientHTTP
        .call('POST',
            AppConstants.BACKEND_ENUM.URL_OPERATIONS, AppConstants.SERVICES_URL.OPERATIONS.INTERCOMPTE,
            [budget.id, compteCible],
            operation)
        .then(budgetUpdated => {
            this.props.onOperationChange(budgetUpdated);
            toast.success("Création de l'opération inter-comptes correctement effectuée")
        })
        .catch(e => {
            console.log("Erreur lors de l'enregistrement de l'opération intercomptes" + e)
            toast.error("Erreur lors de l'enregistrement de l'opération intercomptes")
        })
}
