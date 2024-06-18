import * as AppConstants from "../../Utils/AppTechEnums.constants"
import * as ClientHTTP from '../../Services/ClientHTTP.service'
import {toast} from "react-toastify";

/**
 * Services back-end pour les analyses.
 */

/**
 * Charge les budgets du compte depuis le back-end.
 * @param {string} selectedCompte - Le compte sélectionné.
 */
export function loadBudgets(selectedCompte) {
    if (selectedCompte != null) {
        // Appelle le service back-end pour obtenir les budgets du compte sélectionné.
        ClientHTTP.call(AppConstants.METHODE_HTTP.GET,
            AppConstants.BACKEND_ENUM.URL_OPERATIONS, AppConstants.SERVICES_URL.BUDGETS.GET_BY_COMPTE,
            [selectedCompte])
            .then(data => this.calculateTimelines(data)) // En cas de succès, calcule les analyses temporelles.
            .catch(e => {
                // En cas d'erreur, affiche un message d'erreur.
                let libErreur = "Erreur lors du chargement des budgets du compte " + selectedCompte;
                console.log(libErreur, e)
                toast.error(libErreur, {autoClose: false, closeOnClick: true})
            })
    }
}
