import * as AppConstants from "../../Utils/AppTechEnums.constants"
import * as ClientHTTP from '../../Services/ClientHTTP.service'
import {toast} from "react-toastify";
import CompteBancaireModel from "../../Models/CompteBancaire.model";
import { handleBudgetUpdate } from "./Budget.controller";

/*
 * Services back-end des budgets
 */

/** Chargement des catégories **/
export function loadCategories(handleCategoriesLoaded : Function) {
    console.log("Chargement des catégories");
    ClientHTTP.call(AppConstants.METHODE_HTTP.GET, AppConstants.BACKEND_ENUM.URL_PARAMS, AppConstants.SERVICES_URL.PARAMETRES.CATEGORIES)
        .then(data => {
            handleCategoriesLoaded(data)
        })
        .catch((e) => {
            console.log("Erreur lors du chargement des catégories", e)
            toast.error("Erreur lors du chargement des catégories")
        })
}



/**
 Refresh du budget depuis le back-end
 **/
export function reloadBudget(selectedCompte : CompteBancaireModel | null, selectedDate? : Date) {
    if (selectedCompte != null && selectedDate != null) {
        ClientHTTP.call(AppConstants.METHODE_HTTP.GET,
            AppConstants.BACKEND_ENUM.URL_OPERATIONS, AppConstants.SERVICES_URL.BUDGETS.GET_BY_COMPTE_DATES,
            [selectedCompte.id, selectedDate.getFullYear().toString(), (selectedDate.getMonth() + 1).toString()])
            .then(data => handleBudgetUpdate(data))
            .catch(e => {
                let libErreur = "Erreur lors du chargement du budget " + selectedCompte + " du " + (selectedDate.getMonth() + 1) + "/" + selectedDate.getFullYear();
                console.log(libErreur, e)
                toast.error(libErreur, {autoClose: false, closeOnClick: true})
            })
    }
}


/**
 * Get préférences
 * @param setUserDroits setDroits
 * @param setUserPreferences setPreferences
 */
export function getPreferenceUtilisateur(setUserDroits : React.Dispatch<React.SetStateAction<string[]>>, setUserPreferences:  React.Dispatch<React.SetStateAction<string[]>>) {
    ClientHTTP.call(AppConstants.METHODE_HTTP.GET, AppConstants.BACKEND_ENUM.URL_UTILISATEURS, AppConstants.SERVICES_URL.UTILISATEURS.USERS_PREFS)
        .then((data) => {
            setUserDroits(data.droits);
            setUserPreferences(data.preferences);
        })
        .catch((e) => {
            console.log("Erreur lors de la recherche de la dernière connexion", e);
        })

}
