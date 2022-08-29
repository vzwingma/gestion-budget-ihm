import * as AppConstants from "../../../Utils/AppEnums.constants"
import * as ClientHTTP from "../../../Services/ClientHTTP.service";
import {sortLibelles} from "../../../Utils/DataUtils.utils";

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
                // Transformation des catégories en affichage
                const mapCategories = data.sort(sortLibelles).map(cat => {
                    return transformCategorieBOtoVO(cat)
                })
                this.setState({ categoriesSelect : mapCategories })

            })
            .catch(e => {
                console.log("Erreur lors du chargement des catégories >> "+ e)
            })
    }

    /**
     * Transformation des catégories BO en VO
     * @param categorie
     * @returns {{sousCategories: *[], text: *, value}}
     */
    export function transformCategorieBOtoVO(categorie){
        let sousCategoriesVO = []
        if(categorie.listeSSCategories !== null && categorie.listeSSCategories !== undefined){
            sousCategoriesVO = categorie.listeSSCategories.sort(sortLibelles).map(sousCat => transformCategorieBOtoVO(sousCat))
        }
        return { value: categorie.libelle, text: categorie.libelle, id: categorie.id, sousCategories: sousCategoriesVO }
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
            })
    }


    /**
     * Appels WS vers pour enregistrer l'opération intercompte sur le backend
     * @param idBudget id du budget concerné
     * @param operation opération à enregistrer
     * @param idCompteCible id du compte cible pour la 2nde opération (intercompte)
     */
    export function saveOperationIntercompte(idBudget, operation, idCompteCible) {
        console.log("Création d'une opération intercompte sur le budget : " + idBudget + " vers le compte " + idCompteCible)
        ClientHTTP
            .call('POST',
                AppConstants.BACKEND_ENUM.URL_OPERATIONS, AppConstants.SERVICES_URL.OPERATIONS.INTERCOMPTE,
                [idBudget, idCompteCible],
                operation)
            .then(budgetUpdated => {
                this.props.onOperationChange(budgetUpdated);
            })
            .catch(e => {
                console.log("Erreur lors de l'enregistrement de l'opération intercomptes" + e)
            })
    }
