import * as AppConstants from "../../Utils/AppEnums.constants"
import * as ClientHTTP from '../../Services/ClientHTTP.service'
import {toast} from "react-toastify";

/*
 * Services back-end des budgets
 */

    /** Chargement des catégories **/
    export function loadCategories(){
        console.log("Chargement des catégories");
        ClientHTTP.call('GET', AppConstants.BACKEND_ENUM.URL_PARAMS, AppConstants.SERVICES_URL.PARAMETRES.CATEGORIES)
                    .then(data => {
                        this.categoriesLoaded(data)
                    })
                    .catch((e) => {
                        console.log("Erreur lors du chargement des catégories >> "+ e)
                        toast.error("Erreur lors du chargement des catégories")
                    })
    }

    /** Chargement des catégories **/
    export function categoriesLoaded(data) {
        console.log("Chargement de " + data.length + " catégories");
        this.setState({ categories : data })
    }


    /**
        Refresh du budget depuis le back-end
    **/
    export function reloadBudget(selectedCompte, selectedDate){
        if(selectedCompte != null && selectedDate != null){
            ClientHTTP.call('GET',
                            AppConstants.BACKEND_ENUM.URL_OPERATIONS, AppConstants.SERVICES_URL.BUDGETS.GET,
                            [ selectedCompte, selectedDate.getFullYear(), selectedDate.getMonth()+1 ])
                    .then(data => this.handleBudgetUpdate(data))
                    .catch(e => {
                        let libErreur = "Erreur lors du chargement du budget " + selectedCompte + " du " + (selectedDate.getMonth()+1) + "/" + selectedDate.getFullYear();
                        console.log(libErreur + " >> "+ e)
                        toast.error(libErreur , {autoClose: false, closeOnClick: true})
                    })
        }
    }
