import * as AppConstants from "../../Utils/AppTechEnums.constants"
import * as ClientHTTP from '../../Services/ClientHTTP.service'
import {toast} from "react-toastify";

/*
 * Services back-end des budgets
 */

/** Chargement des catégories **/
export function loadCategories() {
    console.log("Chargement des catégories");
    ClientHTTP.call(AppConstants.METHODE_HTTP.GET, AppConstants.BACKEND_ENUM.URL_PARAMS, AppConstants.SERVICES_URL.PARAMETRES.CATEGORIES)
        .then(data => {
            this.categoriesLoaded(data)
        })
        .catch((e) => {
            console.log("Erreur lors du chargement des catégories", e)
            toast.error("Erreur lors du chargement des catégories")
        })
}

/** Chargement des catégories **/
export function categoriesLoaded(data) {
    console.log("Chargement de " + data.length + " catégories");
    this.setState({categories: data})
}


/**
 Refresh du budget depuis le back-end
 **/
export function reloadBudget(selectedCompte, selectedDate) {
    if (selectedCompte != null && selectedDate != null) {
        ClientHTTP.call(AppConstants.METHODE_HTTP.GET,
            AppConstants.BACKEND_ENUM.URL_OPERATIONS, AppConstants.SERVICES_URL.BUDGETS.GET_BY_COMPTE_DATES,
            [selectedCompte, selectedDate.getFullYear(), selectedDate.getMonth() + 1])
            .then(data => this.handleBudgetUpdate(data[0]))
            .catch(e => {
                let libErreur = "Erreur lors du chargement du budget " + selectedCompte + " du " + (selectedDate.getMonth() + 1) + "/" + selectedDate.getFullYear();
                console.log(libErreur, e)
                toast.error(libErreur, {autoClose: false, closeOnClick: true})
            })
    }
}


/**
 * Get préférences
 */
export function getPreferenceUtilisateur() {
    ClientHTTP.call(AppConstants.METHODE_HTTP.GET, AppConstants.BACKEND_ENUM.URL_UTILISATEURS, AppConstants.SERVICES_URL.UTILISATEURS.USERS_PREFS, null)
        .then((data) => {
            this.setState({user_droits: data.droits, user_preferences: data.preferences})
        })
        .catch((e) => {
            console.log("Erreur lors de la recherche de la dernière connexion", e);
        })

}
