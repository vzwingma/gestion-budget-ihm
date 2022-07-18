import React, {Component} from 'react';
import {Button, Col, Form, Modal, Row} from 'react-bootstrap'
import {loadCategories, loadComptes, saveOperation} from './CreateOperationActionForm.extservices'
import * as Controller from './CreateOperationActionForm.controller'
/**
 * Formulaire sur le Bouton création
 */
export default class CreateOperationActionForm extends Component {


    state = {
        idCompte : null,
        idBudget : null,
        categoriesRefs: [],
        // Data d'affichages du formulaire
        categories: [],
        ssCategories: [],
        comptes: [],
        // Formulaire
        formIdCategorie         : null,
        formLibelleCategorie    : null,
        formIdSsCategorie       : null,
        formLibelleSsCategorie  : null,
        formIdCompteCible       : null,
        formDescription         : "",
        formValeur              : "",
        formEtat                : "Prévue",
        formOperationType       : "-",
        formOperationPeriodique : "0",
        // Affichage & Validation du formulaire
        showIntercompte: false,
        showModale: false,
        formValidated: false
    }
    /**
     * Constructeur du formulaire
     * @param props
     */
    constructor(props) {
        super(props);

        this.hideModal = Controller.hideModal.bind(this);
        this.handleOpenForm = Controller.handleOpenForm.bind(this);

        this.handleSelectCategorie = Controller.handleSelectCategorie.bind(this);
        this.handleSelectSsCategorie = Controller.handleSelectSsCategorie.bind(this);
        this.handleSelectDescription = Controller.handleSelectDescription.bind(this);
        this.handleSelectCompteCible = Controller.handleSelectCompteCible.bind(this);
        this.handleSelectType = Controller.handleSelectType.bind(this);
        this.handleSelectValeur = Controller.handleSelectValeur.bind(this);
        this.handleCompleteValeur = Controller.handleCompleteValeur.bind(this);
        this.handleSelectEtat = Controller.handleSelectEtat.bind(this);
        this.handleSelectPeriode = Controller.handleSelectPeriode.bind(this);

        this.handleSubmitForm = Controller.handleSubmitForm.bind(this);
        this.closeForm = Controller.closeForm.bind(this);
        this.createOperation = Controller.createOperation.bind(this);

        this.loadCategories = loadCategories.bind(this);
        this.loadComptes = loadComptes.bind(this);
        this.saveOperation = saveOperation.bind(this);
    }



    /**
     * Chargement des catégories
     **/
    componentDidMount() {
        this.loadCategories();

    };

    // Mise à jour du contexte de budget
    shouldComponentUpdate(nextProps, nextStates){
        if( nextProps.budget != null && nextProps.budget.id !== nextStates.idBudget ) {
            this.setState({
                idBudget: nextProps.budget.id,
                idCompte: nextProps.idCompte
            });
        }
        return true;
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
                        <Modal.Title>Nouvelle opération</Modal.Title>
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
                                        <Form.Select size="sm" required onChange={ this.handleSelectCompteCible }>
                                            <option> </option>
                                            {
                                                this.state.comptes
                                                    .map(compte => (
                                                        <option key={compte.id} id={compte.id}>{compte.libelle}</option>
                                                    ))
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
                                    <Form.Control required size="sm"
                                                  type="text"
                                                  pattern="[0-9]*\.[0-9]{2}"
                                                  value={this.state.formValeur}
                                                  onBlur={this.handleCompleteValeur}
                                                  onChange={this.handleSelectValeur} />
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