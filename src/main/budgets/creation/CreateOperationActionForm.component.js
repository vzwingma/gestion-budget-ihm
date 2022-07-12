import React, { Component } from "react";
import { Form, Col, Row, Button, Modal } from 'react-bootstrap'
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
            // Data du formulaires
            categories: [],
            ssCategories: [],
            comptes: [],
            selectedIdCategorie: null,
            selectedIdSsCategorie: null,
            // Affichage & Validation du formulaire
            showIntercompte: false,
            showModale: false,
            formValidated: false
        }

        this.hideModal = this.hideModal.bind(this);
        this.handleOpenForm = this.handleOpenForm.bind(this);
        this.handleSelectCategorie = this.handleSelectCategorie.bind(this);
        this.handleSelectSsCategorie = this.handleSelectSsCategorie.bind(this);
        this.handleSubmitForm = this.handleSubmitForm.bind(this);
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
        this.setState({selectedIdCategorie: selectedIdCategorie});
        this.setState({ ssCategories : this.state.categories
                .filter(cat => cat.id === selectedIdCategorie)
                .flatMap(cat => cat.listeSSCategories)});

        /**
         * Set type de valeur, suivant la catégorie
         */
    }

    /**
     * Sélection d'une sous catégorie
     * @param event évt de sélection de sous catégorie
     */
    handleSelectSsCategorie(event) {
        const SOUS_CAT_INTER_COMPTES = "ed3f6100-5dbd-4b68-860e-0c97ae1bbc63"

        // Select du compte parmi la liste
        const ssCategorieLabel = event.target.value;
        let selectedIdSsCategorie = null;
        Array.from(event.target.options)
            .filter(option => option.value === ssCategorieLabel)
            .map(option => selectedIdSsCategorie = option.id);
        // selectedIdCategorie sélectionnée
        console.log("Changement de sous-catégorie " + ssCategorieLabel + "[" + selectedIdSsCategorie + "]")
        this.setState({selectedIdSsCategorie: selectedIdSsCategorie});

        /**
         * Si sous catégorie intercompte
         */
        this.setState( {showIntercompte: selectedIdSsCategorie === SOUS_CAT_INTER_COMPTES})
        if(selectedIdSsCategorie === SOUS_CAT_INTER_COMPTES){
            this.loadComptes();
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
                    this.setState({ categories : data })
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
     * Ouverture du formulaire
     * @param event evenement
     */
    handleOpenForm(event) {
        // Validation du formulaire
        console.log("Création d'une opération sur le compte " + this.state.idCompte )
        this.setState({ showModale: true });
    }

    /**
     * Validation du formulaire
     * @param event événement
     */
    handleSubmitForm(event) {
        console.log(event)
        const form = event.currentTarget;
        console.log("Validation du formulaire")
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        }
        this.hideModal();
    }


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
                                        <Form.Select size="sm">
                                            {
                                                this.state.comptes
                                                    .map(compte => ( <option key={compte.id} id={compte.id}>{compte.libelle}</option> ))
                                            }
                                        </Form.Select>
                                    }
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <Form.Label>Description</Form.Label>
                                </Col>
                                <Col colSpan="2" >
                                    <Form.Control required type="text" />
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <Form.Label>Valeur</Form.Label>
                                </Col>
                                <Col>
                                    <Form.Select required size="sm">
                                        <option key="plus" id="plus">-</option>
                                        <option key="moins" id="moins">+</option>
                                    </Form.Select>
                                </Col>
                                <Col>
                                    <Form.Control required size="sm"  />
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <Form.Label>Etat</Form.Label>
                                </Col>
                                <Col colSpan="2">
                                    <Form.Select required size="sm">
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
                                    <Form.Check type="checkbox"/>
                                </Col>
                            </Row>
                        </Form.Group>
                    </Modal.Body>

                    <Modal.Footer>
                        <Button variant="secondary" onClick={ this.hideModal } >Fermer</Button>
                        <Button variant="primary" type="submit" >Valider et continuer</Button>
                        <Button variant="success" type="submit" >Valider et fermer</Button>
                    </Modal.Footer>
                    </Form>
                </Modal>
            </>
        )
    }
}