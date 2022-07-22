import * as ClientHTTP from "../../../Services/ClientHTTP.service";
import * as AppConstants from "../../../Utils/AppEnums.constants";


    export function callReinitBudget(idBudget){
        console.log("Reinitialisation du budget [" + idBudget + "]");
        ClientHTTP.call('DELETE', AppConstants.BACKEND_ENUM.URL_OPERATIONS, AppConstants.SERVICES_URL.BUDGETS.REINIT, [idBudget])
            .then(data => {
                console.log(data)
                this.props.onActionBudgetChange(data)
            })
            .catch((e) => {
                console.log("Erreur lors de la réinitialisation du budget >> "+ e)
            })
    }


    export function callReopenCloseBudget(idBudget, newEtatBudget){
        console.log((newEtatBudget ? "Réouverture" : "Clôture") + "du budget " + idBudget)

        ClientHTTP.call('POST', AppConstants.BACKEND_ENUM.URL_OPERATIONS, AppConstants.SERVICES_URL.BUDGETS.ETAT, [idBudget, newEtatBudget])
            .then(data => {
                console.log(data)
                this.props.onActionBudgetChange(data)
            })
            .catch((e) => {
                console.log("Erreur lors de la Réouverture/Clôture du budget >> "+ e)
            })
    }
