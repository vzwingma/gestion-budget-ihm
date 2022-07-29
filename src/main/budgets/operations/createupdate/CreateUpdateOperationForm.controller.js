import * as AppConstants from "../../../Utils/AppEnums.constants"
/**
 * Fonctions sur le formulaire de création d'opérations
 */



    /**
     * Sélection d'une catégorie
     * @param event événement de sélection de catégorie
     */
    export function handleSelectCategorie(event) {
        // Select du compte parmi la liste
        const categorieLabel =event.target.value;
        let selectedIdCategorie = null;
        Array.from(event.target.options)
            .filter(option => option.value === categorieLabel)
            .map(option => selectedIdCategorie = option.id);

        // selectedIdCategorie sélectionnée
        console.log("Changement de catégorie " + categorieLabel + " : [" + selectedIdCategorie + "]");
        this.setState({ formIdCategorie: selectedIdCategorie,
                        formLibelleCategorie: categorieLabel,
                        ssCategories : this.state.categories
                                                .filter(cat => cat.id === selectedIdCategorie)
                                                .flatMap(cat => cat.listeSSCategories)});

        /**
         * Set type de valeur, suivant la catégorie
         */
        // Prélèvement mensuel
        let operationMensuelle = (selectedIdCategorie === AppConstants.BUSINESS_GUID.CAT_PRELEVEMENT_MENSUEL) ? "1" : "0";
        this.setState( { formOperationPeriodique : operationMensuelle })
        // Virement
        let operationType = (selectedIdCategorie === AppConstants.BUSINESS_GUID.CAT_VIREMENT) ? "CREDIT" : "DEPENSE";
        this.setState( { formOperationType : operationType } );
    }

    /**
     * Sélection d'une sous catégorie
     * @param event évt de sélection de sous catégorie
     */
    export function handleSelectSsCategorie(event) {

        // Select du compte parmi la liste
        const ssCategorieLabel = event.target.value;
        let selectedIdSsCategorie = null;
        Array.from(event.target.options)
            .filter(option => option.value === ssCategorieLabel)
            .map(option => selectedIdSsCategorie = option.id);
        // selectedIdCategorie sélectionnée
        console.log("Changement de sous-catégorie : " + ssCategorieLabel + " [" + selectedIdSsCategorie + "]")
        this.setState({ formIdSsCategorie: selectedIdSsCategorie,
                        formLibelleSsCategorie: ssCategorieLabel});

        /**
         * Si sous catégorie intercompte
         */
        this.setState( {showIntercompte: selectedIdSsCategorie === AppConstants.BUSINESS_GUID.SOUS_CAT_INTER_COMPTES})
        if(selectedIdSsCategorie === AppConstants.BUSINESS_GUID.SOUS_CAT_INTER_COMPTES){
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
            value = value += ".00"
        }
        this.setState({formValeur : value})
    }
    /**
     *  Saisie de l'état de l'opération
     * @param event évt de saisie
     */
    export function handleSelectEtat(event){
        this.setState({formEtat : event.target.value})
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
            formIdCategorie: null,
            formLibelleCategorie: "",
            formIdSsCategorie: null,
            formLibelleSsCategorie: "",
            formIdCompteCible: null,
            formDescription: "",
            formValeur: "",
            formEtat: "PREVUE",
            formOperationType: "DEPENSE",
            formOperationPeriodique: "0",
            formProchaineMensualite: null,
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
        this.saveOperation(this.props.budget.id  , operation, true);

    }

    /**
     * Création d'un objet Operation à partir du formulaire
     */
    export function fillOperationFromForm(){

        return {
            "libelle": this.state.formDescription,
            "categorie": {
                "id": this.state.formIdCategorie,
                "libelle": this.state.formLibelleCategorie
            },
            "ssCategorie": {
                "id": this.state.formIdSsCategorie,
                "libelle": this.state.formLibelleSsCategorie
            },
            "typeOperation": this.state.formOperationType,
            "etat": this.state.formEtat,
            "valeur": (this.state.formOperationType === "DEPENSE" ? -1 : 1) * this.state.formValeur,
            "periodique": this.state.formOperationPeriodique !== "0",
            "periodeMensualite": this.state.formOperationPeriodique,
            // "prochaineMensualite": inutile - calculé automatiquement par le backend
            "tagDerniereOperation": this.state.formTagDerniereOperation
        }
    }

    /**
     * Remplissage du formulaire d'édition à partir de l'opération
     * @param idOperation id de l'opération
     * @param listeOperations liste des opérations du budget
     */
    export function fillFormFromOperation(idOperation, listeOperations){
        let operation = listeOperations.find(op => op.id === idOperation);
        if(operation !== undefined){
            // Création dynamique des sous-catégories pour l'édition (pas de pb car disabled)
            const selectedSsCat  = [{id: operation.ssCategorie.id, libelle: operation.ssCategorie.libelle}];
            const selectedCat  = [{id: operation.categorie.id, libelle: operation.categorie.libelle}];

            let mensualite;
            if(operation.periodique && operation.periodeMensualite === 0){
                mensualite = 1;
            }
            else{
                mensualite = operation.periodeMensualite;
            }

            this.setState({ // remplissage du formulaire
                    formIdCategorie: operation.categorie.id,
                    formLibelleCategorie: operation.categorie.libelle,
                    categories: selectedCat,
                    ssCategories : selectedSsCat,
                    formIdSsCategorie: operation.ssCategorie.id,
                    formLibelleSsCategorie: operation.ssCategorie.libelle,
                    formIdCompteCible: null,
                    formDescription: operation.libelle,
                    formValeur: Math.abs(operation.valeur).toFixed(2),
                    formEtat: operation.etat,
                    formOperationType: operation.typeOperation,
                    formOperationPeriodique: mensualite,
                    formProchaineMensualite: operation.prochaineMensualite,
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
