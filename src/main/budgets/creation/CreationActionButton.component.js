import React, { Component } from "react";
import { Form, Col, Button, Modal } from 'react-bootstrap'
import * as AppConstants from "./../../Utils/AppEnums.constants"
import * as ClientHTTP from './../../Services/ClientHTTP.service'
/*
 * Bouton création
 */
export default class CreationActionButton extends Component {

    /** Etat de la page modale **/
    state = {
        showModale: false,
        categories: [],
        ssCategories: [],
        selectedIdCategorie: null,
        selectedIdSsCategorie: null,
        showIntercompte: false
    }


    constructor(props) {
        super(props);
        this.hideModal = this.hideModal.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.handleSelectCategorie = this.handleSelectCategorie.bind(this);
        this.handleSelectSsCategorie = this.handleSelectSsCategorie.bind(this);
    }

    // Sélection d'une catégorie
    handleSelectCategorie(event) {
        // Select du compte parmi la liste
        const categorieLabel =event.target.value;
        var selectedIdCategorie = null;
        Array.from(event.target.options)
            .forEach(function (option) {
                if(option.value === categorieLabel){
                    selectedIdCategorie = option.id;
                }
            })
        // selectedIdCategorie sélectionnée
        console.log("Changement de categorie " + categorieLabel + "[" + selectedIdCategorie + "]");
        this.setState({selectedIdCategorie: selectedIdCategorie});
        this.setState({ ssCategories : this.state.categories
                .filter(cat => cat.id === selectedIdCategorie)
                .flatMap(cat => cat.listeSSCategories)});
    }

    // Sélection d'une sscatégorie
    handleSelectSsCategorie(event) {
        // Select du compte parmi la liste
        const ssCategorieLabel = event.target.value;
        var selectedIdSsCategorie = null;
        Array.from(event.target.options)
            .forEach(function (option) {
                if(option.value === ssCategorieLabel){
                    selectedIdSsCategorie = option.id;
                }
            })
        // selectedIdCategorie sélectionnée
        console.log("Changement de ss categorie " + ssCategorieLabel + "[" + selectedIdSsCategorie + "]")
        this.setState({selectedIdSsCategorie: selectedIdSsCategorie});
    }


    /** Chargement des catégories **/
    componentDidMount(){
        console.log("Chargement des catégories");
        ClientHTTP.call('GET',
                        AppConstants.BACKEND_ENUM.URL_PARAMS, AppConstants.SERVICES_URL.PARAMETRES.CATEGORIES)
                .then((data) => {
                    this.setState({ categories : data })
                })
                .catch((e) => {
                    console.log("Erreur lors du chargement des catégories >> "+ e)
                })
    }


    hideModal = () => {
        this.setState({ showModale: false });
    };

    // Sélection d'un compte
    handleClick(event) {
        // Select du compte parmi la liste
        console.log("Création d'une opération " + event)
        this.setState({ showModale: true });
    }
    /**
     *  RENDER
     */

    render() {
        return (
            <>
                { /** Bouton de création **/ }
                <Button variant="outline-primary" size="sm" onClick={this.handleClick}>Création</Button>
                { /** Fenêtre modale - Formulaire  **/ }
                <Modal show={this.state.showModale}>
                    <Modal.Header>
                        <Modal.Title>Créer une nouvelle opération</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        <Form><Form.Group controlId="creationForm">
                            <Form.Row>
                                <Col>
                                    <Form.Label>Catégorie</Form.Label>
                                </Col>
                                <Col>
                                    <Form.Control as="select" size="sm" custom onChange={this.handleSelectCategorie}>
                                        <option> </option>
                                        {
                                            this.state.categories
                                                .sort((c1, c2) => c1.libelle - c2.libelle)
                                                .map((categorie, key) => (
                                                    <option key={key} id={categorie.id}>{categorie.libelle}</option>
                                                ))
                                        }
                                    </Form.Control>
                                </Col>
                                <Col>
                                    <Form.Control as="select" size="sm" custom onChange={this.handleSelectSsCategorie}>
                                        <option> </option>
                                        {
                                            this.state.ssCategories
                                                .map((ssCategorie, key) => (
                                                    <option key={key} id={ssCategorie.id}>{ssCategorie.libelle}</option>
                                                ))
                                        }
                                    </Form.Control>
                                </Col>
                                <Col>
                                    {this.state.showIntercompte &&
                                        <Form.Control as="select" size="sm" custom onChange={this.handleSelectSsCategorie}>
                                            <option> Comptes </option>
                                            {
                                                this.state.ssCategories
                                                    .map((ssCategorie, key) => (
                                                        <option key={key} id={ssCategorie.id}>{ssCategorie.libelle}</option>
                                                    ))
                                            }
                                        </Form.Control>
                                    }
                                </Col>
                            </Form.Row>
                            <Form.Row>
                                <Col>
                                    <Form.Label>Description</Form.Label>
                                </Col>
                                <Col colSpan="2">
                                    <Form.Control as="select" size="sm" custom>
                                        <option>1</option>
                                        <option>2</option>
                                        <option>3</option>
                                        <option>4</option>
                                        <option>5</option>
                                    </Form.Control>
                                </Col>
                            </Form.Row>
                            <Form.Row>
                                <Col>
                                    <Form.Label>Valeur</Form.Label>
                                </Col>
                                <Col>
                                    <Form.Control as="select" size="sm" custom>
                                        <option>+</option>
                                        <option>-</option>
                                    </Form.Control>
                                </Col>
                                <Col>
                                    <Form.Control size="sm" placeholder="Valeur" />
                                </Col>
                            </Form.Row>
                            <Form.Row>
                                <Col>
                                    <Form.Label>Etat</Form.Label>
                                </Col>
                                <Col colSpan="2">
                                    <Form.Control as="select" size="sm" custom>
                                        <option>Prévue</option>
                                        <option>Réalisée</option>
                                        <option>Reportée</option>
                                        <option>Annulée</option>
                                    </Form.Control>
                                </Col>
                            </Form.Row>
                            <Form.Row>
                                <Col>
                                    <Form.Label>Dépense mensuelle</Form.Label>
                                </Col>
                                <Col colSpan="2">
                                    <Form.Check type="checkbox"/>
                                </Col>
                            </Form.Row>
                        </Form.Group></Form>
                    </Modal.Body>

                    <Modal.Footer>
                        <Button variant="secondary" onClick={this.hideModal}>
                            Fermer
                        </Button>
                        <Button variant="primary" onClick={this.hideModal}>
                            Valider et continuer
                        </Button>
                        <Button variant="success" onClick={this.hideModal}>
                            Valider et fermer
                        </Button>
                    </Modal.Footer>
                </Modal>
            </>
        )
    };
}