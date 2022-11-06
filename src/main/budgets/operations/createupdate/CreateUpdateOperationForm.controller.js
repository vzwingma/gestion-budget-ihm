import * as AppConstants from "../../../Utils/AppEnums.constants"
import {getDateFromDateTime, getLibelleDate, sortLibelles} from "../../../Utils/DataUtils.utils";
import {toast} from "react-toastify";
/**
 * Fonctions sur le formulaire de création d'opérations
 */

    export function categoriesLoaded(data){
    // Transformation des catégories en affichage
        const mapCategories = data.map(cat => transformCategorieBOtoVO(cat)).sort(sortLibelles)
        const mapSsCategories = mapCategories.flatMap(cat => cat.sousCategories)
                                             .map(ssCat => {
                                                return { value: ssCat.text, text: ssCat.categorie.text + "/" + ssCat.text, id: ssCat.id, categorie: { value: ssCat.categorie.value, text: ssCat.categorie.text, id: ssCat.categorie.id} }
                                            })
                                            .sort(sortLibelles)
        this.setState({ categoriesSelect : mapCategories, ssCategoriesSelect : mapSsCategories, ssCategoriesAll: mapSsCategories })
    }


    /**
     * Transformation des catégories BO en VO
     * @param categorie
     * @returns {{sousCategories: *[], text: *, value}}
     */
    export function transformCategorieBOtoVO(categorie){
        let sousCategoriesVO = []

        if(categorie.listeSSCategories !== null && categorie.listeSSCategories !== undefined){
            sousCategoriesVO = categorie.listeSSCategories.map(sousCat => transformSsCategorieBOtoVO(categorie, sousCat))
        }
        return { value: categorie.libelle, text: categorie.libelle, id: categorie.id, sousCategories: sousCategoriesVO }
    }

    /**
     * Transformation des catégories BO en VO
     * @param categorie catégorie
     * @param sscategorie sous catégorie
     * @returns {{sousCategories: *[], text: *, value}}
     */
    export function transformSsCategorieBOtoVO(categorie, sscategorie){
        return { value: sscategorie.libelle, text: sscategorie.libelle, id: sscategorie.id, categorie: { value: categorie.libelle, text: categorie.libelle, id: categorie.id} }
    }

    /**
     * Sélection d'une catégorie
     * @param categorieSelected événement de sélection de catégorie
     */
    export function handleSelectCategorie(categorieSelected) {
        console.log("Changement de catégorie " + categorieSelected.text + " : [" + categorieSelected.id + "]");
        this.setState({ formCategorie: categorieSelected,
                        formSsCategorie: null,
                        ssCategoriesSelect : categorieSelected.sousCategories });

        /**
         * Set type de valeur, suivant la catégorie
         */
        // Prélèvement mensuel
        let operationMensuelle = (categorieSelected.id === AppConstants.BUSINESS_GUID.CAT_PRELEVEMENT_MENSUEL) ? "MENSUELLE" : "PONCTUELLE";

        // Virement
        let operationType = (categorieSelected.id === AppConstants.BUSINESS_GUID.CAT_VIREMENT) ? "CREDIT" : "DEPENSE";
        this.setState(
            { formOperationType : operationType
            , formOperationPeriodique : operationMensuelle })
    }

    /**
     * Sélection d'une sous catégorie
     * @param ssCategorieSelected évt de sélection de sous catégorie
     */
    export function handleSelectSsCategorie(ssCategorieSelected) {
        console.log("Changement de sous-catégorie : " + ssCategorieSelected.text + " [" + ssCategorieSelected.id + "]")
        const ssCatsUpdated = this.state.ssCategoriesSelect.filter(ssCat => ssCat.categorie.id === ssCategorieSelected.categorie.id)
            .map(ssCat => {
                ssCat.text = ssCat.text.replace(ssCat.categorie.text+"/", "")
                return ssCat
            })
        this.setState({ formSsCategorie: ssCategorieSelected, formCategorie: ssCategorieSelected.categorie, ssCategoriesSelect : ssCatsUpdated});

        /** Si type Virement **/
        let operationType = (ssCategorieSelected.categorie.id === AppConstants.BUSINESS_GUID.CAT_VIREMENT) ? "CREDIT" : "DEPENSE";
        this.setState( { formOperationType : operationType } )

        /**
         * Si sous catégorie intercompte
         */
        if(ssCategorieSelected.id === AppConstants.BUSINESS_GUID.SOUS_CAT_INTER_COMPTES){
            this.loadComptes();
            this.setState( { formOperationType : "DEPENSE", showIntercompte:true } );
        }
        else if(this.state.showIntercompte){
            this.setState( {  showIntercompte:false } );
        }


    }

    /**
     *  Saisie description de l'opération
     * @param event évt de saisie de description
     */
    export function handleSelectDescription(event) {
        this.setState({formDescription : event.target.value})
    }

    /**
     *  Saisie du type de l'opération
     * @param event évt de saisie
     */
    export function handleSelectType(event) {
        this.setState({formOperationType : event.target.value})
    }
    /**
     *  Saisie compte cible de l'opération intercompte
     * @param event évt de saisie
     */
    export function handleSelectCompteCible(event) {
        this.setState({formCompteCible : event})
    }
    /**
     *  Saisie de la valeur de l'opération
     * @param event évt de saisie
     */
    export function handleSelectValeur(event) {
        this.setState({formValeur : event.target.value})
    }
    /**
     *  Saisie du type de l'opération
     * @param event évt de saisie
     */
    export function handleCompleteValeur(event) {
        let value = event.target.value.replaceAll(",", ".")
        if(value.indexOf(".") === -1) {
            value += ".00"
        }
        this.setState({formValeur : value})
    }
    /**
     *  Saisie de l'état de l'opération
     * @param event évt de saisie
     */
    export function handleSelectEtat(event){
        this.setState({formEtat : event})
    }


    export function handleSelectDateOperation(event){
        this.setState({formDateOperation: event.target.value})
    }
    /**
     *  Saisie de la période de l'opération
     * @param event évt de saisie
     */
    export function handleSelectPeriode(event){
        this.setState({formOperationPeriodique : event.target.value})
    }



    /**
     * Validation du formulaire
     * @param event événement
     */
    export function handleSubmitForm(event) {
        const form = event.currentTarget;

        if (event.nativeEvent.submitter.id !== "btnClose") {
            console.log("Validation du formulaire")
            if (form.checkValidity() === false) {
                event.preventDefault();
                event.stopPropagation();
            } else {
                if (event.nativeEvent.submitter.id === "btnValidContinue" || event.nativeEvent.submitter.id === "btnValidClose") {
                    this.createOperation();
                } else if (event.nativeEvent.submitter.id === "btnValidModif") {
                    this.updateOperation();
                }

            }
        }
        // Post Creation - Clear Form
        this.razForm();
        // Ferme le formulaire ssi ce n'est pas le bouton Continue
        if(event.nativeEvent.submitter.id !== "btnValidContinue") {
            this.hideModal();
        }
    }



    export function razForm(){
        // Post Creation - Clear Form
        this.setState({ // RAZ Formulaire
            ssCategoriesSelect: this.state.ssCategoriesAll,
            formCategorie: null,
            formSsCategorie: null,
            formCompteCible: null,
            formDescription: "",
            formValeur: "",
            formEtat: this.listeEtats[0],
            formDateOperation: getLibelleDate(new Date(), "AAAA-MM-DD"),
            formOperationType: "DEPENSE",
            formOperationPeriodique: "0",
            formProchaineMensualite: "",
            showIntercompte: false
        })

    }



    /**
     * Création d'une nouvelle opération
     */
    export function createOperation(){

        const operation = this.fillOperationFromForm();
        // Sauvegarde de l'opération
        if(this.state.formCompteCible !== null){
            this.saveOperationIntercompte(this.props.budget.id, operation, this.state.formCompteCible);
        }
        else{
            this.saveOperation(this.props.budget.id  , operation, false);
        }
        toast.success("Création de l'opération correctement effectuée")
    }


    /**
     * Mise à jour d'une opération
     */
    export function updateOperation(){

        const operation = this.fillOperationFromForm();
        // Sauvegarde de l'opération
        operation.id = this.props.idOperation;
        console.log("Mise à jour de l'opération : " + operation.id + " [" + this.props.idOperation + "]");
        this.saveOperation(this.props.budget.id  , operation, true);
        toast.success("Mise à jour de l'opération correctement effectuée")
    }

    /**
     * Création d'un objet Operation à partir du formulaire
     */
    export function fillOperationFromForm(){

        return {
            "libelle": this.state.formDescription,
            "categorie": {
                "id": this.state.formCategorie.id,
                "libelle": this.state.formCategorie.text
            },
            "ssCategorie": {
                "id": this.state.formSsCategorie.id,
                "libelle": this.state.formSsCategorie.text
            },
            "typeOperation": this.state.formOperationType,
            "etat": this.state.formEtat.value,
            "valeur": (this.state.formOperationType === "DEPENSE" ? -1 : 1) * this.state.formValeur,
            "mensualite" : {
                "periode": this.state.formOperationPeriodique
                // "prochaineEcheance": inutile - calculé automatiquement par le backend
            },
            "autresInfos" : {
                "dateOperation": this.state.formDateOperation
            },
            "tagDerniereOperation": this.state.formTagDerniereOperation
        }
    }

    /**
     * Remplissage du formulaire d'édition à partir de l'opération
     * @param idOperation id de l'opération
     * @param listeOperations liste des opérations du budget
     */
    export function fillFormFromOperation(idOperation, listeOperations){
        const operation = listeOperations.find(op => op.id === idOperation);
        if(operation !== undefined){
            // Création dynamique des VO Catégories & sous-catégories pour l'édition (pas de pb car disabled)
            const selectedCat  = [{value: operation.categorie.libelle, text: operation.categorie.libelle, id: operation.categorie.id }];
            const selectedSsCat  = [{value: operation.ssCategorie.libelle, text: operation.ssCategorie.libelle, id: operation.ssCategorie.id }];

            this.setState({ // remplissage du formulaire
                    formCategorie: selectedCat[0],
                    categories: selectedCat,
                    ssCategories : selectedSsCat,
                    formSsCategorie: selectedSsCat[0],
                    formCompteCible: null,
                    formDescription: operation.libelle,
                    formValeur: Math.abs(operation.valeur).toFixed(2),
                    formEtat: this.listeEtats.filter(etatSelect => etatSelect.value === operation.etat)[0],
                    formDateOperation: operation.autresInfos !== undefined && operation.autresInfos.formDateOperation !== null ? getDateFromDateTime(operation.autresInfos.dateOperation) : null,
                    formOperationType: operation.typeOperation,
                    formOperationPeriodique: operation.mensualite !== undefined && operation.mensualite !== null ? operation.mensualite.periode : "PONCTUELLE",
                    formProchaineMensualite: operation.mensualite !== undefined && operation.mensualite !== null ? "dans " + operation.mensualite.prochaineEcheance + " mois": "",
                    formTagDerniereOperation: operation.tagDerniereOperation,
                    showIntercompte: false
            })
        }
    }


    /**
     * Hide modal pour la modale
     */
    export function hideModal(){
        this.props.hideModale();
    }
