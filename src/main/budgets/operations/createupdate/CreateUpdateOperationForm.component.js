import React, {Component} from 'react';
import {Button, ButtonGroup, Col, Form, Modal, OverlayTrigger, Row, Tooltip} from 'react-bootstrap'
import * as ExtServices from './CreateUpdateOperationForm.extservices'
import * as Controller from './CreateUpdateOperationForm.controller'
import {addLeadingZeros, sortLibelles} from '../../../Utils/DataUtils.utils'
/**
 * Formulaire sur le Bouton création
 */
export default class CreateUpdateOperationForm extends Component {


    state = {
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
        // TODO : Utiliser la préférence utilisateur
        formEtat                : "PREVUE",
        formDateOperation       : "",
        formOperationType       : "DEPENSE",
        formOperationPeriodique : "0",
        formProchaineMensualite : null,
        formTagDerniereOperation: false,
        // Affichage & Validation du formulaire
        showIntercompte: false,
        formValidated: false
    }
    /**
     * Constructeur du formulaire
     * @param props
     */
    constructor(props) {
        super(props);

        this.handleSelectCategorie = Controller.handleSelectCategorie.bind(this);
        this.handleSelectSsCategorie = Controller.handleSelectSsCategorie.bind(this);
        this.handleSelectDescription = Controller.handleSelectDescription.bind(this);
        this.handleSelectCompteCible = Controller.handleSelectCompteCible.bind(this);
        this.handleSelectType = Controller.handleSelectType.bind(this);
        this.handleSelectValeur = Controller.handleSelectValeur.bind(this);
        this.handleCompleteValeur = Controller.handleCompleteValeur.bind(this);
        this.handleSelectEtat = Controller.handleSelectEtat.bind(this);
        this.handleSelectDateOperation = Controller.handleSelectDateOperation.bind(this);
        this.handleSelectPeriode = Controller.handleSelectPeriode.bind(this);

        this.fillFormFromOperation = Controller.fillFormFromOperation.bind(this);
        this.fillOperationFromForm = Controller.fillOperationFromForm.bind(this);

        this.handleSubmitForm = Controller.handleSubmitForm.bind(this);
        this.createOperation = Controller.createOperation.bind(this);
        this.updateOperation = Controller.updateOperation.bind(this);

        this.loadCategories = ExtServices.loadCategories.bind(this);
        this.loadComptes = ExtServices.loadComptes.bind(this);
        this.saveOperation = ExtServices.saveOperation.bind(this);
        this.saveOperationIntercompte = ExtServices.saveOperationIntercompte.bind(this);

        this.hideModal = Controller.hideModal.bind(this);
   //
    }



    /**
     * Chargement des catégories
     **/
    // TODO : Ce n'est pas au bon endroit (double appel à chaque fois)
    componentDidMount() {
        if(!this.props.modeEdition){
            this.loadCategories();

            let dateNow = new Date();
            let libDate = dateNow.getFullYear() + "-" + addLeadingZeros(dateNow.getMonth()+1) + "-" + dateNow.getDate();
            console.log(libDate)
            this.setState({formDateOperation: libDate});
        }
        if(this.props.modeEdition && this.props.idOperation !== null && this.props.budget !== null){
            this.fillFormFromOperation(this.props.idOperation, this.props.budget.listeOperations, this.state.categories);
        }

    }


    /**
     *  RENDER
     */
    render() {
        return (
            <>
                { /** Fenêtre modale - Formulaire  **/ }
                <Modal show={this.props.showModale} onHide={this.props.hideModale} className="modal" centered >

                    <Modal.Header closeButton>
                        <Modal.Title>{ this.props.modeEdition ? "Edition" : "Création"} d'une opération</Modal.Title>
                    </Modal.Header>

                    <Form validated={ this.state.formValidated } onSubmit={ this.handleSubmitForm }>
                    <Modal.Body>
                        <Form.Group as={Row} className="mb-2" controlId="categoriesForm">
                            <Form.Label column sm={4} className="col-form-label-sm">Catégories</Form.Label>
                            <Col>
                                <Form.Select size="sm" required disabled={ this.props.modeEdition }
                                             id={this.state.formIdCategorie} value={this.state.formLibelleCategorie}
                                             onChange={this.handleSelectCategorie}>
                                        <option> </option>
                                        {
                                            this.state.categories != null ?
                                            this.state.categories
                                                .sort(sortLibelles)
                                                .map(categorie => (
                                                    <option key={categorie.id} id={categorie.id} value={categorie.libelle}>{categorie.libelle}</option>
                                                ))
                                                : null

                                        }
                                    </Form.Select>
                                    <Form.Select size="sm" required disabled={ this.props.modeEdition }
                                                 id={this.state.formIdSsCategorie} value={this.state.formLibelleSsCategorie}
                                                 onChange={this.handleSelectSsCategorie}>
                                        <option> </option>
                                        {
                                            this.state.ssCategories
                                                .sort(sortLibelles)
                                                .map((ssCategorie) => (
                                                    <option key={ssCategorie.id} id={ssCategorie.id} value={ssCategorie.libelle}>{ssCategorie.libelle}</option>
                                                ))
                                        }
                                    </Form.Select>
                                    { this.state.showIntercompte &&
                                        <Form.Select size="sm" required disabled={ this.props.modeEdition } onChange={ this.handleSelectCompteCible }>
                                            <option> </option>
                                            {
                                                this.state.comptes
                                                    .sort(sortLibelles)
                                                    .map(compte => (
                                                        <option key={compte.id} id={compte.id} value={compte.libelle}>{compte.libelle}</option>
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
                                    <option value="DEPENSE">-</option>
                                    <option value="CREDIT">+</option>
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
                                    <option value="PREVUE">Prévue</option>
                                    <option value="REALISEE">Réalisée</option>
                                    <option value="REPORTEE">Reportée</option>
                                    <option value="ANNULEE">Annulée</option>
                                </Form.Select>
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} className="mb-3" controlId="dateForm">
                            <Form.Label column sm={4} className="col-form-label-sm">Date opération</Form.Label>
                            <Col>
                                <Form.Control type="date" name="dateop" placeholder="Date de l'opération" size={"sm"}
                                              value={this.state.formDateOperation} onChange={this.handleSelectDateOperation} />
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row} className="mb-3">
                            <Form.Label column sm={4} className="col-form-label-sm">Dépense périodique</Form.Label>
                            <Col>
                                <OverlayTrigger overlay={ <Tooltip>Prochaine mensualité : {this.state.formProchaineMensualite}</Tooltip> }>
                                <Form.Select required size="sm"  value={this.state.formOperationPeriodique} onChange={this.handleSelectPeriode}>
                                        <option value="PONCTUELLE">Ponctuelle</option>
                                        <option value="MENSUELLE">Mensuelle</option>
                                        <option value="TRIMESTRIELLE">Trimestrielle</option>
                                        <option value="SEMESTRIELLE">Semestrielle</option>
                                        <option value="ANNUELLE">Annuelle</option>
                                </Form.Select>
                                </OverlayTrigger>
                            </Col>
                        </Form.Group>
                    </Modal.Body>

                    <Modal.Footer>
                        <ButtonGroup>
                            <OverlayTrigger overlay={  <Tooltip>Annuler la saisie</Tooltip>  }>
                                <Button id="btnClose" variant="secondary" onClick={ this.props.hideModale } >Annuler</Button>
                            </OverlayTrigger>
                            { !this.props.modeEdition && <>
                                <OverlayTrigger overlay={ <Tooltip>Valider la saisie et continuer sur une autre saisie</Tooltip>  }>
                                    <Button id="btnValidContinue" variant="primary" type="submit" >Valider et continuer</Button>
                                </OverlayTrigger>
                                <OverlayTrigger overlay={ <Tooltip>Valider la saisie et fermer le formulaire</Tooltip> }>
                                    <Button id="btnValidClose" variant="success" type="submit" >{!this.props.modeEdition ? "Valider et fermer" : "Valider" }</Button>
                                </OverlayTrigger>
                            </> }
                            { this.props.modeEdition &&
                                <OverlayTrigger overlay={ <Tooltip>Valider la modification</Tooltip> }>
                                    <Button id="btnValidModif" variant="success" type="submit" >Valider</Button>
                                </OverlayTrigger>
                            }
                        </ButtonGroup>
                    </Modal.Footer>
                    </Form>
                </Modal>
            </>
        )
    }
}