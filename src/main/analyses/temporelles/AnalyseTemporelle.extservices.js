import * as AppConstants from "../../Utils/AppTechEnums.constants"
import * as ClientHTTP from '../../Services/ClientHTTP.service'
import {toast} from "react-toastify";

/*
 * Services back-end des analyses
 */

/**
 Chargement des budgets du compte depuis le back-end
 **/
export function loadBudgets(selectedCompte) {
    if (selectedCompte != null) {

        ClientHTTP.call(AppConstants.METHODE_HTTP.GET,
            AppConstants.BACKEND_ENUM.URL_OPERATIONS, AppConstants.SERVICES_URL.BUDGETS.GET_BY_COMPTE,
            [selectedCompte])
            .then(data => this.calculateTimelines(data))
            .catch(e => {
                let libErreur = "Erreur lors du chargement des budgets du compte " + selectedCompte;
                console.log(libErreur, e)
                toast.error(libErreur, {autoClose: false, closeOnClick: true})
            })
    }
}
