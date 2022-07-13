import * as AppConstants from "./../../Utils/AppEnums.constants"

/**
 * Fonctions sur le formulaire de création d'opérations
 */

    /**
     * Ouverture du formulaire
     * @param event evenement
     */
    export function handleOpenForm(event) {
        // Ouverture du formulaire
        this.setState({ showModale: true });
    }

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
        this.setState({formIdCompteCible : event.target.value})
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
        // Post Creation
        this.closeForm(event.nativeEvent.submitter.id);

    }

    export function createOperation(){
        /*
        console.log("Création d'une opération\n" +
            "formIdCategorie: " + this.state.formIdCategorie  + "\n" +
            "formLibelleCategorie: " + this.state.formLibelleCategorie  + "\n" +
            "formIdSsCategorie: " + this.state.formIdSsCategorie  + "\n" +
            "formLibelleSsCategorie: " + this.state.formLibelleSsCategorie  + "\n" +
            "formIdCompteCible: " + this.state.formIdCompteCible  + "\n" +
            "formDescription: " + this.state.formDescription  + "\n" +
            "formValeur: " + this.state.formValeur  + "\n" +
            "formEtat: " + this.state.formEtat  + "\n" +
            "formOperationType: " + this.state.formOperationType  + "\n" +
            "formOperationPeriodique: " + this.state.formOperationPeriodique);
    */
        const operation = {
            "id": "123",
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
            "etat": this.state.formEtat.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase(),
            "valeur": (this.state.formOperationType === "-" ? -1 : 1) * this.state.formValeur,
            "periodique": this.state.formOperationPeriodique !== 0,
            "tagDerniereOperation": false
        }
        // Sauvegarde de l'opération
        this.saveOperation(this.state.idBudget  , operation);
    }

    /**
     * Fermeture du formulaire
     * @param buttonId (id du bouton)
     */
    export function closeForm(buttonId){
        // Clear Form
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

        if(buttonId === "btnValidClose")  {
            this.hideModal();
        }
    }


    /**
     * Fermeture de la fenêtre modale
     */
    export function hideModal() {
        this.setState({ showModale: false });
    }

