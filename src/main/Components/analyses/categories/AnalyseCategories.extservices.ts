import {toast} from "react-toastify";
import CompteBancaireModel from "../../../Models/CompteBancaire.model";
import { call } from "../../../Services/ClientHTTP.service";
import { BACKEND_ENUM, METHODE_HTTP, SERVICES_URL } from "../../../Utils/AppTechEnums.constants";
import { calculateResumes } from "./AnalyseCategories.controller";
import { DataCalculationResultsProps } from "../../Components.props";

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
export function loadBudget(selectedCompte : CompteBancaireModel | null, selectedDate : Date, handleDataCalculationResult : ({ currentBudget,
                                                                                                                            analysesGroupedByCategories,
                                                                                                                            totauxGroupedByEtat} : DataCalculationResultsProps) => void) : void {
        
    if (selectedCompte != null && selectedDate != null) {

        call(METHODE_HTTP.GET,
            BACKEND_ENUM.URL_OPERATIONS, SERVICES_URL.BUDGETS.GET_BY_COMPTE_DATES,
            [selectedCompte.id, String(selectedDate.getFullYear()), String(selectedDate.getMonth() + 1)])
            .then(data => calculateResumes(data, handleDataCalculationResult))
            .catch(e => {
                let libErreur = "Erreur lors du chargement du budget " + selectedCompte + " du " + (selectedDate.getMonth() + 1) + "/" + selectedDate.getFullYear();
                console.log(libErreur, e)
                toast.error(libErreur, {autoClose: false, closeOnClick: true})
            })
    }
}
