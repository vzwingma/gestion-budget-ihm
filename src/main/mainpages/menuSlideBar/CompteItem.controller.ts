import * as ClientHTTP from "../../Services/ClientHTTP.service";
import * as AppConstants from "../../Utils/AppTechEnums.constants";
import CompteBancaireModel from '../../Models/CompteBancaire.model';



/**
 Get SOLDES du budget depuis le back-end
 **/
export function getSoldesBudget(compte: CompteBancaireModel, selectedDate: Date, setSoldes: React.Dispatch<React.SetStateAction<number | null>>) {
    if (compte != null && selectedDate != null) {
        ClientHTTP.call(AppConstants.METHODE_HTTP.GET,
            AppConstants.BACKEND_ENUM.URL_OPERATIONS, AppConstants.SERVICES_URL.BUDGETS.SOLDES,
            [compte.id, selectedDate.getFullYear().toString(), (selectedDate.getMonth() + 1).toString()])
            .then(data => {
                if (data.length > 0) {
                    setSoldes(() => data[0].soldes.soldeAtMaintenant);
                }
            })
            .catch(e => {
                let libErreur = "Erreur lors du chargement du budget " + compte + " du " + (selectedDate.getMonth() + 1) + "/" + selectedDate.getFullYear();
                console.log(libErreur, e)
            });
    }
}

