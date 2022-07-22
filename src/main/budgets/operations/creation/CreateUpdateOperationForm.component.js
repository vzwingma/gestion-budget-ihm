import React, {Component} from 'react';
import {Button, ButtonGroup, Col, Form, Modal, OverlayTrigger, Row, Tooltip} from 'react-bootstrap'
import * as ExtServices from './CreateUpdateOperationForm.extservices'
import * as Controller from './CreateUpdateOperationForm.controller'
import {sortLibelles} from '../../../Utils/DataUtils.utils'
/**
 * Formulaire sur le Bouton création
 */
export default class CreateUpdateOperationForm extends Component {


    state = {
        idCompte : null,
        budget: null,
        idBudget : null,
        etatBudget: false,
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

        this.loadCategories = ExtServices.loadCategories.bind(this);
        this.loadComptes = ExtServices.loadComptes.bind(this);
        this.saveOperation = ExtServices.saveOperation.bind(this);
        this.saveOperationIntercompte = ExtServices.saveOperationIntercompte.bind(this);
    }



    /**
     * Chargement des catégories
     **/
    componentDidMount() {
        this.loadCategories();

    };

    // Mise à jour du contexte de budget
    shouldComponentUpdate(nextProps, nextStates){
        if( nextProps.budget != null && (nextProps.budget !== nextStates.budget) ) {
            this.setState({
                budget: nextProps.budget,
                idBudget: nextProps.budget.id,
                etatBudget: nextProps.budget.actif,
                idCompte: nextProps.idCompte
            });
            console.log("[TRIGGER] Context budget : " + nextProps.budget.id + "::" + nextProps.budget.actif)
        }
        return true;
    }


    /**
     *  RENDER
     */
    render() {
        return (
            <>
                { /** Fenêtre modale - Formulaire  **/ }
                <Modal show={this.props.showModale} onHide={this.hideModal} className="modal" centered >

                    <Modal.Header closeButton>
                        <Modal.Title>Nouvelle opération</Modal.Title>
                    </Modal.Header>
                    <Form validated={ this.state.formValidated } onSubmit={ this.handleSubmitForm }>
                    <Modal.Body>
                        <Form.Group as={Row} className="mb-2" controlId="categoriesForm">
                            <Form.Label column sm={4} className="col-form-label-sm">Catégories</Form.Label>
                            <Col>
                                <Form.Select size="sm" required onChange={this.handleSelectCategorie}>
                                        <option> </option>
                                        {
                                            this.state.categories
                                                .sort(sortLibelles)
                                                .map((categorie, key) => (
                                                    <option key={key} id={categorie.id}>{categorie.libelle}</option>
                                                ))

                                        }
                                    </Form.Select>
                                    <Form.Select size="sm" required onChange={this.handleSelectSsCategorie}>
                                        <option> </option>
                                        {
                                            this.state.ssCategories
                                                .sort(sortLibelles)
                                                .map((ssCategorie) => (
                                                    <option key={ssCategorie.id} id={ssCategorie.id}>{ssCategorie.libelle}</option>
                                                ))
                                        }
                                    </Form.Select>
                                    { this.state.showIntercompte &&
                                        <Form.Select size="sm" required onChange={ this.handleSelectCompteCible }>
                                            <option> </option>
                                            {
                                                this.state.comptes
                                                    .sort(sortLibelles)
                                                    .map(compte => (
                                                        <option key={compte.id} id={compte.id}>{compte.libelle}</option>
                                                    ))
                                            }
                                        </Form.Select>
                                    }
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} className="mb-2" controlId="descriptionForm">
                            <Form.Label column sm={4} className="col-form-label-sm">Description</Form.Label>
                            <Col>
                                <Form.Control type="text" required size="sm" value={this.state.formDescription} onChange={this.handleSelectDescription} />
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} className="mb-2" controlId="valeurForm">
                            <Form.Label column sm={4} className="col-form-label-sm">Valeur</Form.Label>
                            <Col sm={2}>
                                <Form.Select disabled required size="sm" value={this.state.formOperationType} onChange={this.handleSelectType} >
                                    <option>-</option>
                                    <option>+</option>
                                </Form.Select>
                            </Col>
                            <Col sm={6}>
                                <Form.Control required size="sm"
                                              type="text" pattern="[0-9]*\.[0-9]{2}"
                                              value={this.state.formValeur}
                                              onBlur={this.handleCompleteValeur} onChange={this.handleSelectValeur} />
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row} className="mb-3" controlId="etatForm">
                            <Form.Label column sm={4} className="col-form-label-sm">Etat</Form.Label>
                            <Col>
                                <Form.Select required size="sm" value={this.state.formEtat} onChange={this.handleSelectEtat}>
                                    <option>Prévue</option>
                                    <option>Réalisée</option>
                                    <option>Reportée</option>
                                    <option>Annulée</option>
                                </Form.Select>
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} className="mb-3">
                            <Form.Label column sm={4} className="col-form-label-sm">Dépense périodique</Form.Label>
                            <Col>
                                <Form.Select required size="sm"  value={this.state.formOperationPeriodique} onChange={this.handleSelectPeriode}>
                                        <option value="0">Ponctuelle</option>
                                        <option value="1">Mensuelle</option>
                                        <option value="3"  disabled>Trimestrielle</option>
                                        <option value="6"  disabled>Semestrielle</option>
                                        <option value="12" disabled>Annuelle</option>
                                </Form.Select>
                            </Col>
                        </Form.Group>
                    </Modal.Body>

                    <Modal.Footer>
                        <ButtonGroup>
                            <OverlayTrigger overlay={  <Tooltip>Annuler la saisie</Tooltip>  }>
                                <Button id="btnClose" variant="secondary" onClick={ this.hideModal } >Annuler</Button>
                            </OverlayTrigger>

                            <OverlayTrigger overlay={ <Tooltip>Valider la saisie et continuer sur une autre saisie</Tooltip>  }>
                                <Button id="btnValidContinue" variant="primary" type="submit" >Valider et continuer</Button>
                            </OverlayTrigger>

                            <OverlayTrigger overlay={ <Tooltip>Valider la saisie et fermer le formulaire</Tooltip> }>
                                <Button id="btnValidClose" variant="success" type="submit" >Valider et fermer</Button>
                            </OverlayTrigger>
                        </ButtonGroup>
                    </Modal.Footer>
                    </Form>
                </Modal>
            </>
        )
    }
}