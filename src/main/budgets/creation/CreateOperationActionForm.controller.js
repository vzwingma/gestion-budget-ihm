import * as AppConstants from "./../../Utils/AppEnums.constants"

/**
 * Fonctions sur le formulaire de création d'opérations
 */

    /**
     * Ouverture du formulaire
     * @param event evenement
     */
    export function handleOpenForm(event) {
        // Validation du formulaire
        console.log("Création d'une opération sur le compte " + this.state.idCompte )
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
        this.setState({formIdCategorie: selectedIdCategorie,
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
        this.setState({formIdSsCategorie: selectedIdSsCategorie});

        /**
         * Si sous catégorie intercompte
         */
        this.setState( {showIntercompte: selectedIdSsCategorie === AppConstants.BUSINESS_GUID.SOUS_CAT_INTER_COMPTES})
        if(selectedIdSsCategorie === AppConstants.BUSINESS_GUID.SOUS_CAT_INTER_COMPTES){
            this.loadComptes();
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
    export function handleSelectValeur(event) {
        this.setState({formValeur : event.target.value})
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
            console.log("Validation du formulaire \n" +
            "formIdCategorie: " + this.state.formIdCategorie  + "\n" +
            "formIdSsCategorie: " + this.state.formIdSsCategorie  + "\n" +
            "formDescription: " + this.state.formDescription  + "\n" +
            "formValeur: " + this.state.formValeur  + "\n" +
            "formEtat: " + this.state.formEtat  + "\n" +
            "formOperationType: " + this.state.formOperationType  + "\n" +
            "formOperationPeriodique: " + this.state.formOperationPeriodique);
        }
        // Post Creation
        this.closeForm(event.nativeEvent.submitter.id);

    }

    /**
     * Fermeture du formulaire
     * @param buttonId (id du bouton)
     */
    export function closeForm(buttonId){
        // Clear Form
        this.setState({ // RAZ Formulaire
            ssCategories: [],
            formIdCategorie: "null",
            formIdSsCategorie: null,
            formDescription: "",
            formValeur: "",
            formEtat: "Prévue",
            formOperationType: "-",
            formOperationPeriodique: false })

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

