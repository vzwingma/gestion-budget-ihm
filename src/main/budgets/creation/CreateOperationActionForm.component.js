import React, {Component} from "react";
import {Button, Col, Form, Modal, Row} from 'react-bootstrap'
import * as AppConstants from "./../../Utils/AppEnums.constants"
import * as ClientHTTP from './../../Services/ClientHTTP.service'

/**
 * Formulaire sur le Bouton création
 */
export default class CreateOperationActionForm extends Component {


    /**
     * Constructeur du formulaire
     * @param props
     */
    constructor(props) {
        super(props);
        this.state = {
            idCompte : props.idCompte,
            categoriesRefs: [],
            // Data d'affichages du formulaire
            categories: [],
            ssCategories: [],
            comptes: [],
            // Formulaire
            formIdCategorie: null,
            formIdSsCategorie: null,
            formDescription: "",
            formValeur: null,
            formEtat: "Prévue",
            formOperationType: "-",
            formOperationPeriodique: "0",
            // Affichage & Validation du formulaire
            showIntercompte: false,
            showModale: false,
            formValidated: false
        }

        this.hideModal = this.hideModal.bind(this);
        this.handleOpenForm = this.handleOpenForm.bind(this);

        this.handleSelectCategorie = this.handleSelectCategorie.bind(this);
        this.handleSelectSsCategorie = this.handleSelectSsCategorie.bind(this);
        this.handleSelectDescription = this.handleSelectDescription.bind(this);
        this.handleSelectType = this.handleSelectType.bind(this);
        this.handleSelectValeur = this.handleSelectValeur.bind(this);
        this.handleSelectEtat = this.handleSelectEtat.bind(this);
        this.handleSelectPeriode = this.handleSelectPeriode.bind(this);

        this.handleSubmitForm = this.handleSubmitForm.bind(this);
        this.closeForm = this.closeForm.bind(this);
    }

    /**
     * Ouverture du formulaire
     * @param event evenement
     */
    handleOpenForm(event) {
        // Validation du formulaire
        console.log("Création d'une opération sur le compte " + this.state.idCompte )
        this.setState({ showModale: true });
    }

    /**
     * Sélection d'une catégorie
     * @param event événement de sélection de catégorie
     */
    handleSelectCategorie(event) {
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
    handleSelectSsCategorie(event) {

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
    handleSelectDescription(event) {
        this.setState({formDescription : event.target.value})
    }
    // Saisie type
    handleSelectType(event) {
        this.setState({formOperationType : event.target.value})
    }
    handleSelectValeur(event) {
        this.setState({formValeur : event.target.value})
    }
    // Saisie Etat
    handleSelectEtat(event){
        this.setState({formEtat : event.target.value})
    }
    // Saisie Période
    handleSelectPeriode(event){
        this.setState({formOperationPeriodique : event.target.value})
    }



    /**
     * Validation du formulaire
     * @param event événement
     */
    handleSubmitForm(event) {
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
    closeForm(buttonId){
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
     * Chargement des catégories
     **/
    componentDidMount() {
        console.log("Chargement des catégories");
        ClientHTTP.call('GET',
                        AppConstants.BACKEND_ENUM.URL_PARAMS, AppConstants.SERVICES_URL.PARAMETRES.CATEGORIES)
                  .then(data => {
                    this.setState({ categoriesRefs: data, categories : data })

                  })
                  .catch(e => {
                    console.log("Erreur lors du chargement des catégories >> "+ e)
                  })
    };

    /** Appels WS vers pour charger la liste des comptes **/
    loadComptes() {
        ClientHTTP
            .call('GET', AppConstants.BACKEND_ENUM.URL_COMPTES, AppConstants.SERVICES_URL.COMPTES.GET_ALL)
            .then(data => {
                let comptesActifs = data
                    .filter(c => c.actif)
                    .filter(c => c.id !== this.state.idCompte)
                this.setState({ comptes: comptesActifs });
            })
            .catch(e => {
                console.log("Erreur lors du chargement des comptes " + e)
            })
    }
    /**
     * Fermeture de la fenêtre modale
     */
    hideModal() {
        this.setState({ showModale: false });
    };



    /**
     *  RENDER
     */
    render() {
        return (
            <>
                { /** Bouton de création **/ }
                <Button variant="outline-primary" size="sm" onClick={this.handleOpenForm}>Création</Button>
                { /** Fenêtre modale - Formulaire  **/ }
                <Modal show={this.state.showModale}>

                    <Modal.Header>
                        <Modal.Title>Créer une nouvelle opération</Modal.Title>
                    </Modal.Header>
                    <Form validated={ this.state.formValidated } onSubmit={ this.handleSubmitForm }>
                    <Modal.Body>
                        <Form.Group controlId="creationForm">
                            <Row>
                                <Col>
                                    <Form.Label>Catégorie</Form.Label>
                                </Col>
                                <Col>
                                    <Form.Select size="sm" required onChange={this.handleSelectCategorie}>
                                        <option> </option>
                                        {
                                            this.state.categories
                                                .sort((c1, c2) => c1.libelle - c2.libelle)
                                                .map((categorie, key) => (
                                                    <option key={key} id={categorie.id}>{categorie.libelle}</option>
                                                ))
                                        }
                                    </Form.Select>
                                </Col>
                                <Col>
                                    <Form.Select size="sm" required onChange={this.handleSelectSsCategorie}>
                                        <option> </option>
                                        {
                                            this.state.ssCategories
                                                .map((ssCategorie) => (
                                                    <option key={ssCategorie.id} id={ssCategorie.id}>{ssCategorie.libelle}</option>
                                                ))
                                        }
                                    </Form.Select>
                                </Col>
                                <Col>
                                    { this.state.showIntercompte &&
                                        <Form.Select size="sm"> {
                                                this.state.comptes
                                                    .map(compte => ( <option key={compte.id} id={compte.id}>{compte.libelle}</option> ))
                                        }</Form.Select>
                                    }
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <Form.Label>Description</Form.Label>
                                </Col>
                                <Col colSpan="2" >
                                    <Form.Control required type="text" value={this.state.formDescription} onChange={this.handleSelectDescription} />
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <Form.Label>Valeur</Form.Label>
                                </Col>
                                <Col>
                                    <Form.Select disabled value={this.state.formOperationType} onChange={this.handleSelectType} required size="sm">
                                        <option>-</option>
                                        <option>+</option>
                                    </Form.Select>
                                </Col>
                                <Col>
                                    <Form.Control required size="sm" value={this.state.formValeur} onChange={this.handleSelectValeur} />
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <Form.Label>Etat</Form.Label>
                                </Col>
                                <Col colSpan="2">
                                    <Form.Select required size="sm" value={this.state.formEtat} onChange={this.handleSelectEtat}>
                                        <option>Prévue</option>
                                        <option>Réalisée</option>
                                        <option>Reportée</option>
                                        <option>Annulée</option>
                                    </Form.Select>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <Form.Label>Dépense mensuelle</Form.Label>
                                </Col>
                                <Col colSpan="2">
                                    <Form.Select required size="sm"  value={this.state.formOperationPeriodique} onChange={this.handleSelectPeriode}>
                                        <option value="0">Ponctuelle</option>
                                        <option value="1">Mensuelle</option>
                                        <option value="3" disabled>Trimestrielle</option>
                                        <option value="6" disabled>Semestrielle</option>
                                        <option value="12" disabled>Annuelle</option>
                                    </Form.Select>
                                </Col>
                            </Row>
                        </Form.Group>
                    </Modal.Body>

                    <Modal.Footer>
                        <Button id="btnClose" variant="secondary" onClick={ this.hideModal } >Fermer</Button>
                        <Button id="btnValidContinue" variant="primary" type="submit" >Valider et continuer</Button>
                        <Button id="btnValidClose" variant="success" type="submit" >Valider et fermer</Button>
                    </Modal.Footer>
                    </Form>
                </Modal>
            </>
        )
    }
}