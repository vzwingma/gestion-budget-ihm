import {toast} from "react-toastify";
import CompteBancaireModel from "../../Models/budgets/CompteBancaire.model.ts";
import { call } from "../../Services/ClientHTTP.service.ts";
import { BACKEND_ENUM, METHODE_HTTP, SERVICES_URL } from "../../Utils/AppTechEnums.constants.ts";
import BudgetMensuelModel from "../../Models/budgets/BudgetMensuel.model.ts";

/**
 * Services back-end pour les analyses
 */

/**
 * Charge le budget depuis le back-end
 * @param {String} selectedCompte - Le compte sélectionné.
 * @param {Date} selectedDate - La date sélectionnée.
 * @param handleDataCalculationResult
 * @returns {Promise} Une promesse qui se résout avec les données du budget chargées.
 * @throws Lancera une erreur si le chargement du budget échoue.
 **/
export function loadBudget(selectedCompte : CompteBancaireModel | null, selectedDate : Date) : Promise<BudgetMensuelModel> {

    if (selectedCompte != null && selectedDate != null) {

        return call(METHODE_HTTP.GET,
            BACKEND_ENUM.URL_OPERATIONS, SERVICES_URL.BUDGETS.GET_BY_COMPTE_DATES,
            [selectedCompte.id, String(selectedDate.getFullYear()), String(selectedDate.getMonth() + 1)])
            .catch(e => {
                let libErreur = "Erreur lors du chargement du budget du compte " + selectedCompte?.libelle + " du " + (selectedDate.getMonth() + 1) + "/" + selectedDate.getFullYear();
                console.log(libErreur, e)
                toast.error(libErreur, {autoClose: false, closeOnClick: true})
            })
    }
}
