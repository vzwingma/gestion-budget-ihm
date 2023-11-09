import * as ClientHTTP from "../../../Services/ClientHTTP.service";
import * as AppConstants from "../../../Utils/AppTechEnums.constants";
import {toast} from "react-toastify";


/**
 * Réinit du budget
 * @param {String} idBudget id du budget
 */
export function callReinitBudget(idBudget){
        console.log("Reinitialisation du budget [" + idBudget + "]");
        ClientHTTP.call('DELETE', AppConstants.BACKEND_ENUM.URL_OPERATIONS, AppConstants.SERVICES_URL.BUDGETS.REINIT, [idBudget])
            .then(data => {
                console.log(data)
                this.props.onActionBudgetChange(data)
            })
            .catch((e) => {
                console.log("Erreur lors de la réinitialisation du budget", e)
                toast.error("Erreur lors de la réinitialisation du budget " + idBudget)
            })
    }


/**
 *
 * @param {String} idBudget id du budget
 * @param {boolean} newEtatBudget nouvel état du budget : ouverture/cloture
 */
export function callReopenCloseBudget(idBudget, newEtatBudget) {
        console.log((newEtatBudget ? "Réouverture" : "Clôture") + " du budget " + idBudget)

        ClientHTTP.call('POST', AppConstants.BACKEND_ENUM.URL_OPERATIONS, AppConstants.SERVICES_URL.BUDGETS.ETAT, [idBudget, newEtatBudget])
            .then(data => {
                toast.success((newEtatBudget ? "Réouverture" : "Clôture") + "du budget " + idBudget + " effectuée")
                this.props.onActionBudgetChange(data)
            })
            .catch((e) => {
                console.log("Erreur lors de la Réouverture/Clôture du budget", e)
                toast.error("Erreur lors de la " + (newEtatBudget ? "réouverture" : "clôture") + "du budget " + idBudget)
            })
    }
