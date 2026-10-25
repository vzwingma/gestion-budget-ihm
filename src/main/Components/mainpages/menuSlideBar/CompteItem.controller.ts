import * as ClientHTTP from "../../../Services/ClientHTTP.service.ts";
import * as AppConstants from "../../../Utils/AppTechEnums.constants.ts";
import CompteBancaireModel from '../../../Models/budgets/CompteBancaire.model.ts';


/**
 Get SOLDES du budget depuis le back-end (version Promise, pour `useFetch` - AP 006 T11).
 Résolue avec le solde à maintenant, `null` si pas de budget, `undefined` si compte/date absents.
 Erreur loggée puis relancée.
 **/
export function fetchSoldesBudget(compte: CompteBancaireModel, selectedDate: Date): Promise<number | null | undefined> {
    if (compte == null || selectedDate == null) {
        return Promise.resolve(undefined);
    }
    return ClientHTTP.call(AppConstants.METHODE_HTTP.GET,
        AppConstants.BACKEND_ENUM.URL_OPERATIONS, AppConstants.SERVICES_URL.BUDGETS.SOLDES,
        [compte.id, selectedDate.getFullYear().toString(), (selectedDate.getMonth() + 1).toString()])
        .then(data => data.length > 0 ? data[0].soldes.soldeAtMaintenant : null)
        .catch(e => {
            const libErreur = "Erreur lors du chargement du budget du compte " + compte?.libelle + " du " + (selectedDate.getMonth() + 1) + "/" + selectedDate.getFullYear();
            console.error(libErreur, e)
            throw e;
        });
}
