import * as AppConstants from "../../../Utils/AppEnums.constants"
import {getDateFromDateTime, getLibelleDate} from "../../../Utils/DataUtils.utils";
/**
 * Fonctions sur le formulaire de création d'opérations
 */



    /**
     * Sélection d'une catégorie
     * @param categorieSelected événement de sélection de catégorie
     */
    export function handleSelectCategorie(categorieSelected) {
        console.log("Changement de catégorie " + categorieSelected.text + " : [" + categorieSelected.value + "]");
        this.setState({ formCategorie: categorieSelected,
                        ssCategoriesSelect : categorieSelected.sousCategories });

        /**
         * Set type de valeur, suivant la catégorie
         */
        // Prélèvement mensuel
        let operationMensuelle = (categorieSelected.value === AppConstants.BUSINESS_GUID.CAT_PRELEVEMENT_MENSUEL) ? "1" : "0";
        this.setState( { formOperationPeriodique : operationMensuelle })
        // Virement
        let operationType = (categorieSelected.value === AppConstants.BUSINESS_GUID.CAT_VIREMENT) ? "CREDIT" : "DEPENSE";
        this.setState( { formOperationType : operationType } );
    }

    /**
     * Sélection d'une sous catégorie
     * @param ssCategorieSelected évt de sélection de sous catégorie
     */
    export function handleSelectSsCategorie(ssCategorieSelected) {
        console.log("Changement de sous-catégorie : " + ssCategorieSelected.text + " [" + ssCategorieSelected.value + "]")
        this.setState({ formSsCategorie: ssCategorieSelected});

        /**
         * Si sous catégorie intercompte
         */
        this.setState( {showIntercompte: ssCategorieSelected.value === AppConstants.BUSINESS_GUID.SOUS_CAT_INTER_COMPTES})
        if(ssCategorieSelected.value === AppConstants.BUSINESS_GUID.SOUS_CAT_INTER_COMPTES){
            this.loadComptes();
            this.setState( { formOperationType : "DEPENSE" } );
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
        this.setState({formIdCompteCible : event.target.selectedOptions[0].id})
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
        console.log("Validation du formulaire")
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        }
        else{
            if(event.nativeEvent.submitter.id === "btnValidContinue" || event.nativeEvent.submitter.id === "btnValidClose") {
                this.createOperation();
            }
            else if(event.nativeEvent.submitter.id === "btnValidModif") {
                this.updateOperation();
            }

        }
        // Post Creation - Clear Form
        this.setState({ // RAZ Formulaire
            ssCategories: [],
            formCategorie: null,
            formSsCategorie: null,
            formIdCompteCible: null,
            formDescription: "",
            formValeur: "",
            formEtat: this.listeEtats[0],
            formDateOperation: getLibelleDate(new Date(), "AAAA-MM-DD"),
            formOperationType: "DEPENSE",
            formOperationPeriodique: "0",
            formProchaineMensualite: "",
            showIntercompte: false
        })
        // Ferme le formulaire ssi ce n'est pas le bouton Continue
        if(event.nativeEvent.submitter.id !== "btnValidContinue") {
            this.hideModal();
        }
    }


    /**
     * Création d'une nouvelle opération
     */
    export function createOperation(){

        const operation = this.fillOperationFromForm();
        // Sauvegarde de l'opération
        if(this.state.formIdCompteCible !== null){
            this.saveOperationIntercompte(this.props.budget.id, operation, this.state.formIdCompteCible);
        }
        else{
            this.saveOperation(this.props.budget.id  , operation, false);
        }
    }


    /**
     * Mise à jour d'une opération
     */
    export function updateOperation(){

        const operation = this.fillOperationFromForm();
        // Sauvegarde de l'opération
        operation.id = this.props.idOperation;
        console.log("Mise à jour de l'opération : " + operation.id + " [" + this.props.idOperation + "]");
        console.log(operation)
        this.saveOperation(this.props.budget.id  , operation, true);

    }

    /**
     * Création d'un objet Operation à partir du formulaire
     */
    export function fillOperationFromForm(){

        return {
            "libelle": this.state.formDescription,
            "categorie": {
                "id": this.state.formCategorie[0].value,
                "libelle": this.state.formCategorie[0].text
            },
            "ssCategorie": {
                "id": this.state.formSsCategorie[0].value,
                "libelle": this.state.formSsCategorie[0].text
            },
            "typeOperation": this.state.formOperationType,
            "etat": this.state.formEtat[0].value,
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
            const selectedSsCat  = [{value: operation.ssCategorie.id, text: operation.ssCategorie.libelle}];
            const selectedCat  = [{value: operation.categorie.id, text: operation.categorie.libelle}];

            this.setState({ // remplissage du formulaire
                    formCategorie: selectedCat,
                    categories: selectedCat,
                    ssCategories : selectedSsCat,
                    formSsCategorie: selectedSsCat,
                    formIdCompteCible: null,
                    formDescription: operation.libelle,
                    formValeur: Math.abs(operation.valeur).toFixed(2),
                    formEtat: this.listeEtats.filter(etatSelect => etatSelect.value === operation.etat),
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
