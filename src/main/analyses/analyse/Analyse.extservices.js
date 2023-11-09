import * as AppConstants from "../../Utils/AppTechEnums.constants"
import * as ClientHTTP from '../../Services/ClientHTTP.service'
import {toast} from "react-toastify";

/*
 * Services back-end des analyses
 */

/**
 Chargement du budget depuis le back-end
 **/
export function loadBudget(selectedCompte, selectedDate) {
    if (selectedCompte != null && selectedDate != null) {

        ClientHTTP.call('GET',
            AppConstants.BACKEND_ENUM.URL_OPERATIONS, AppConstants.SERVICES_URL.BUDGETS.GET,
            [selectedCompte, selectedDate.getFullYear(), selectedDate.getMonth() + 1])
            .then(data => this.calculateResumes(data))
            .catch(e => {
                let libErreur = "Erreur lors du chargement du budget " + selectedCompte + " du " + (selectedDate.getMonth() + 1) + "/" + selectedDate.getFullYear();
                console.log(libErreur, e)
                toast.error(libErreur, {autoClose: false, closeOnClick: true})
            })
    }
}
