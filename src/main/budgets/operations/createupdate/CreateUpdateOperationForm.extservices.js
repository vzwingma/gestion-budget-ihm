import * as AppConstants from "../../../Utils/AppEnums.constants"
import * as ClientHTTP from "../../../Services/ClientHTTP.service";
import {toast} from "react-toastify";

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
            .then(data => this.categoriesLoaded(data))
            .catch(e => {
                console.log("Erreur lors du chargement des catégories >> "+ e)
                toast.error("Erreur lors du chargement des catégories")
            })
    }


    /** Appels WS vers pour charger la liste des comptes **/
    export function loadComptes() {
        console.log()
        ClientHTTP
            .call('GET', AppConstants.BACKEND_ENUM.URL_COMPTES, AppConstants.SERVICES_URL.COMPTES.GET_ALL)
            .then(data => {
                data.sort((c1, c2) => (c1.ordre > c2.ordre) ? 1 : -1);

                // Création des comptes pour l'affichage (avec icones)
                let comptesActifs = data.filter(c => c.id !== this.props.budget.idCompteBancaire && c.actif).map((compte) => {
                    return {
                        value: compte.id,
                        text: compte.libelle,
                        icon: <img src={"/img/banques/" + compte.itemIcon} className="d-inline-block align-top" alt={compte.libelle}/>,
                        isDisabled: !compte.actif
                    }
                })
                this.setState({ comptes: comptesActifs });
            })
            .catch(e => {
                console.log("Erreur lors du chargement des comptes " + e)
                toast.error("Erreur lors du chargement des comptes ")
            })
    }


    /**
     * Appels WS vers pour enregistrer l'opération sur le backend
     * @param idBudget id du budget concerné
     * @param operation objet operation à enregistrer
     * @param isUpdate true si c'est une opération à mettre à jour, false si c'est une création
     */
    export function saveOperation(idBudget, operation, isUpdate) {
        console.log((isUpdate ? "Mise à jour":"Création") + " d'une opération sur le budget : " + idBudget)
        ClientHTTP
            .call('POST',
                AppConstants.BACKEND_ENUM.URL_OPERATIONS, !isUpdate ? AppConstants.SERVICES_URL.OPERATIONS.CREATE : AppConstants.SERVICES_URL.OPERATIONS.UPDATE,
                [idBudget, operation.id],
                operation)
            .then(budgetUpdated => {
                this.props.onOperationChange(budgetUpdated);
            })
            .catch(e => {
                console.log("Erreur lors de l'enregistrement de l'opération " + e)
                toast.error("Erreur lors de la mise à jour de l'opération " + operation.id)
            })
    }


    /**
     * Appels WS vers pour enregistrer l'opération intercompte sur le backend
     * @param idBudget id du budget concerné
     * @param operation opération à enregistrer
     * @param compteCible compte cible pour la 2nde opération (intercompte)
     */
    export function saveOperationIntercompte(idBudget, operation, compteCible) {
        console.log("Création d'une opération intercompte sur le budget : " + idBudget + " vers le compte " + compteCible.value)
        ClientHTTP
            .call('POST',
                AppConstants.BACKEND_ENUM.URL_OPERATIONS, AppConstants.SERVICES_URL.OPERATIONS.INTERCOMPTE,
                [idBudget, compteCible.value],
                operation)
            .then(budgetUpdated => {
                this.props.onOperationChange(budgetUpdated);
            })
            .catch(e => {
                console.log("Erreur lors de l'enregistrement de l'opération intercomptes" + e)
                toast.error("Erreur lors de l'enregistrement de l'opération intercomptes")
            })
    }
