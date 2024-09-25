import * as AppConstants from "../../../Utils/AppTechEnums.constants"
import * as ClientHTTP from '../../../Services/ClientHTTP.service'
import {toast} from "react-toastify";
import CompteBancaireModel from "../../../Models/CompteBancaire.model";
import { budgetUpdateloaded } from "./Budget.controller";
import { UTILISATEUR_DROITS } from "../../../Utils/AppBusinessEnums.constants";

/*
 * Services back-end des budgets
 */

/**
 * Charge les catégories depuis le back-end.
 * 
 * @param handleCategoriesLoaded - Fonction de rappel pour traiter les catégories chargées.
 */

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
 * Recharge le budget depuis le back-end.
 * @param handleBudgetUpdate - La fonction de mise à jour du budget.
 * @param selectedCompte - Le compte bancaire sélectionné.
 * @param selectedDate - La date sélectionnée (optionnelle).
 */
export function reloadBudget(handleBudgetUpdate : Function, selectedCompte : CompteBancaireModel | null, selectedDate? : Date) {
    if (selectedCompte != null && selectedDate != null) {
        ClientHTTP.call(AppConstants.METHODE_HTTP.GET,
            AppConstants.BACKEND_ENUM.URL_OPERATIONS, AppConstants.SERVICES_URL.BUDGETS.GET_BY_COMPTE_DATES,
            [selectedCompte.id, selectedDate.getFullYear().toString(), (selectedDate.getMonth() + 1).toString()])
            .then(data => budgetUpdateloaded(data, handleBudgetUpdate))
            .catch(e => {
                let libErreur = "Erreur lors du chargement du budget " + selectedCompte + " du " + (selectedDate.getMonth() + 1) + "/" + selectedDate.getFullYear();
                console.log(libErreur, e)
                toast.error(libErreur, {autoClose: false, closeOnClick: true})
            })
    }
}


/**
 * Récupère les préférences de l'utilisateur.
 * 
 * @param setUserDroits - Fonction pour définir les droits de l'utilisateur.
 * @param setUserPreferences - Fonction pour définir les préférences de l'utilisateur.
 */
export function getPreferenceUtilisateur(setUserDroits : React.Dispatch<React.SetStateAction<UTILISATEUR_DROITS[]>>, setUserPreferences:  React.Dispatch<React.SetStateAction<string[]>>) {
    ClientHTTP.call(AppConstants.METHODE_HTTP.GET, AppConstants.BACKEND_ENUM.URL_UTILISATEURS, AppConstants.SERVICES_URL.UTILISATEURS.USERS_PREFS)
        .then((data) => {
            let userDroits: UTILISATEUR_DROITS[] = [];
            // Mapping des droits de l'utilisateur en enum
            for(let droit in data.droits) {
                if (data.droits[droit]) {
                    Object.values(UTILISATEUR_DROITS).forEach((key, index) => {
                        if (key === droit) {
                            userDroits.push(index);
                        }
                    })
                }
            }
            setUserDroits(userDroits);
            setUserPreferences(data.preferences);
        })
        .catch((e) => {
            console.log("Erreur lors de la recherche de la dernière connexion", e);
        })

}
