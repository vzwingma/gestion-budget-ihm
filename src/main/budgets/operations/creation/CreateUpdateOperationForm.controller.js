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
        console.log("Changement de catégorie " + categorieLabel + "[" + selectedIdCategorie + "]");
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
        let operationType = (selectedIdCategorie === AppConstants.BUSINESS_GUID.CAT_VIREMENT) ? "+" : "-";
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
        console.log("Changement de sous-catégorie " + ssCategorieLabel + "[" + selectedIdSsCategorie + "]")
        this.setState({ formIdSsCategorie: selectedIdSsCategorie,
                        formLibelleSsCategorie: ssCategorieLabel});

        /**
         * Si sous catégorie intercompte
         */
        this.setState( {showIntercompte: selectedIdSsCategorie === AppConstants.BUSINESS_GUID.SOUS_CAT_INTER_COMPTES})
        if(selectedIdSsCategorie === AppConstants.BUSINESS_GUID.SOUS_CAT_INTER_COMPTES){
            this.loadComptes();
            this.setState( { formOperationType : "-" } );
        }


    }

    // Saisie description
    export function handleSelectDescription(event) {
        this.setState({formDescription : event.target.value})
    }
    // Saisie type
    export function handleSelectType(event) {
        this.setState({formOperationType : event.target.value})
    }
    // Saisie du compte Intercompte
    export function handleSelectCompteCible(event) {
        this.setState({formIdCompteCible : event.target.selectedOptions[0].id})
    }
    // Saisie valeur de l'opération
    export function handleSelectValeur(event) {
        this.setState({formValeur : event.target.value})
    }

    export function handleCompleteValeur(event) {
        let value = event.target.value.replaceAll(",", ".")
        if(value.indexOf(".") === -1) {
            value = value += ".00"
        }
        this.setState({formValeur : value})
    }
    // Saisie Etat
    export function handleSelectEtat(event){
        this.setState({formEtat : event.target.value})
    }
    // Saisie Période
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
            this.createOperation();
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
            formEtat: "Prévue",
            formOperationType: "-",
            formOperationPeriodique: false,
            showIntercompte: false
        })

        if(event.nativeEvent.submitter.id === "btnValidClose") {
            this.hideModal();
        }
    }

    /**
     * Création d'une nouvelle opération
     */
    export function createOperation(){

        const operation = {
            "libelle": this.state.formDescription,
            "categorie": {
                "id": this.state.formIdCategorie,
                "libelle": this.state.formLibelleCategorie
            },
            "ssCategorie": {
                "id": this.state.formIdSsCategorie,
                "libelle": this.state.formLibelleSsCategorie
            },
            "typeOperation": this.state.formOperationType === "-" ? "DEPENSE" : "CREDIT",
            "etat": this.state.formEtat,
            "valeur": (this.state.formOperationType === "-" ? -1 : 1) * this.state.formValeur,
            "periodique": this.state.formOperationPeriodique !== 0,
            "tagDerniereOperation": false
        }
        // Sauvegarde de l'opération

        if(this.state.formIdCompteCible !== null){
            this.saveOperationIntercompte(this.props.budget.id, operation, this.state.formIdCompteCible);
        }
        else{
            this.saveOperation(this.props.budget.id  , operation);
        }

    }


/**
 * Remplissage du formulaire d'édition à partir de l'opération
 * @param idOperation id de l'opération
 * @param listeOperations liste des opérations du budget
 */
export function fillFormFromOperation(idOperation, listeOperations){
        console.log("CreateUpdateOperationForm.componentDidMount" + idOperation);
            let operation = listeOperations.find(op => op.id === idOperation);
            console.log(operation) ;
            this.setState({ // remplissage du formulaire
                formIdCategorie: operation.categorie.id,
                formLibelleCategorie: operation.categorie.libelle,
                formIdSsCategorie: operation.ssCategorie.id,
                formLibelleSsCategorie: operation.ssCategorie.libelle,
                formIdCompteCible: null,
                formDescription: operation.libelle,
                formValeur: Math.abs(operation.valeur),
                formEtat: operation.etat,
                formOperationType: operation.typeOperation === "CREDIT" ? "+" : "-",
                formOperationPeriodique: operation.periodique ? "1" : "0",
                showIntercompte: false
            })
        }


    /**
     * Hide modal pour la modale
     */
    export function hideModal(){
        this.props.hideModale();
    }
