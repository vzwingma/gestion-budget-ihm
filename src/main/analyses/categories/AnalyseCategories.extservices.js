import * as AppConstants from "../../Utils/AppTechEnums.constants"
import * as ClientHTTP from '../../Services/ClientHTTP.service'
import {toast} from "react-toastify";

/**
 * Services back-end pour les analyses
 */

/**
 * Charge le budget depuis le back-end
 * @param {String} selectedCompte - Le compte sélectionné.
 * @param {Date} selectedDate - La date sélectionnée.
 * @returns {Promise} Une promesse qui se résout avec les données du budget chargées.
 * @throws Lancera une erreur si le chargement du budget échoue.
 **/
export function loadBudget(selectedCompte, selectedDate) {
    if (selectedCompte != null && selectedDate != null) {

        ClientHTTP.call(AppConstants.METHODE_HTTP.GET,
            AppConstants.BACKEND_ENUM.URL_OPERATIONS, AppConstants.SERVICES_URL.BUDGETS.GET_BY_COMPTE_DATES,
            [selectedCompte, selectedDate.getFullYear(), selectedDate.getMonth() + 1])
            .then(data => this.calculateResumes(data[0]))
            .catch(e => {
                let libErreur = "Erreur lors du chargement du budget " + selectedCompte + " du " + (selectedDate.getMonth() + 1) + "/" + selectedDate.getFullYear();
                console.log(libErreur, e)
                toast.error(libErreur, {autoClose: false, closeOnClick: true})
            })
    }
}
