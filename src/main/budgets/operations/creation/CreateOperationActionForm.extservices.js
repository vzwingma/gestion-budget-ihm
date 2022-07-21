import * as AppConstants from "../../../Utils/AppEnums.constants"
import * as ClientHTTP from "../../../Services/ClientHTTP.service";

/**
 * Fonctions d'appels des services du backend sur le formulaire de création d'opérations
 */

    /**
     * Chargement des catégories
     **/
    export function loadCategories() {
        console.log("Chargement des catégories");
        ClientHTTP.call('GET',
            AppConstants.BACKEND_ENUM.URL_PARAMS, AppConstants.SERVICES_URL.PARAMETRES.CATEGORIES)
            .then(data => {
                this.setState({ categoriesRefs: data, categories : data })

            })
            .catch(e => {
                console.log("Erreur lors du chargement des catégories >> "+ e)
            })
    }

    /** Appels WS vers pour charger la liste des comptes **/
    export function loadComptes() {
        ClientHTTP
            .call('GET', AppConstants.BACKEND_ENUM.URL_COMPTES, AppConstants.SERVICES_URL.COMPTES.GET_ALL)
            .then(data => {
                let comptesActifs = data
                    .filter(c => c.id !== this.state.idCompte && c.actif)
                this.setState({ comptes: comptesActifs });
            })
            .catch(e => {
                console.log("Erreur lors du chargement des comptes " + e)
            })
    }




    /** Appels WS vers pour enregistrer l'opération sur le backend **/
    export function saveOperation(idBudget, operation) {
        console.log("Création d'une opération sur le budget : " + idBudget)
        ClientHTTP
            .call('POST',
                AppConstants.BACKEND_ENUM.URL_OPERATIONS, AppConstants.SERVICES_URL.OPERATIONS.CREATE,
                [idBudget],
                operation)
            .then(budgetUpdated => {
                this.props.onOperationChange(budgetUpdated);
            })
            .catch(e => {
                console.log("Erreur lors du chargement des comptes " + e)
            })
    }