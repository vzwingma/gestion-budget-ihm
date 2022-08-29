import React, {Component} from 'react';
import {Button, ButtonGroup, Col, Form, Modal, OverlayTrigger, Row, Tooltip} from 'react-bootstrap'
import * as ExtServices from './CreateUpdateOperationForm.extservices'
import * as Controller from './CreateUpdateOperationForm.controller'
import {getLibelleDate} from '../../../Utils/DataUtils.utils'
import BaseSelect from "react-select";
import Select from "react-select";
import RequiredSelect from "../../../Utils/RequiredSelect";
/**
 * Formulaire sur le Bouton création
 */
export default class CreateUpdateOperationForm extends Component {


    /**
     * Liste des états d'opérations, affichés
     * @type {[{icon, text: string, value: string},{icon, text: string, value: string},{icon, text: string, value: string},{icon, text: string, value: string}]}
     */
    listeEtats = [
        {   value: "PREVUE", text: "Prévue",
            icon: <img src={"/img/statuts/circle_clock.png"} className="d-inline-block align-top" alt="Prévue"/>         },
        {   value: "REALISEE", text: "Réalisée",
            icon: <img src={"/img/statuts/circle_ok.png"} className="d-inline-block align-top" alt="Réalisée"/>        },
        {   value: "REPORTEE", text: "Reportée",
            icon: <img src={"/img/statuts/circle_arrow_right.png"} className="d-inline-block align-top" alt="Reportée"/>        },
        {   value: "ANNULEE", text: "Annulée",
            icon: <img src={"/img/statuts/circle_cancel.png"} className="d-inline-block align-top" alt="Annulée"/>        }
    ]


    state = {
        // Data d'affichages du formulaire
        categoriesSelect: [],
        ssCategoriesSelect: [],
        ssCategoriesAll: [],
        comptes: [],
        // Formulaire
        formCategorie           : null,
        formSsCategorie         : null,
        formCompteCible         : null,
        formDescription         : "",
        formValeur              : "",
        // TODO : Utiliser la préférence utilisateur
        formEtat                : this.listeEtats[0],
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
        this.razForm = Controller.razForm.bind(this);
        this.createOperation = Controller.createOperation.bind(this);
        this.updateOperation = Controller.updateOperation.bind(this);

        this.loadCategories = ExtServices.loadCategories.bind(this);
        this.categoriesLoaded = Controller.categoriesLoaded.bind(this);
        this.loadComptes = ExtServices.loadComptes.bind(this);
        this.saveOperation = ExtServices.saveOperation.bind(this);
        this.saveOperationIntercompte = ExtServices.saveOperationIntercompte.bind(this);

        this.hideModal = Controller.hideModal.bind(this);
        this.cancelForm = this.cancelForm.bind(this);
   //
    }



    /**
     * Chargement des catégories
     **/
    // TODO : Ce n'est pas au bon endroit (double appel à chaque fois)
    componentDidMount() {
        if(!this.props.modeEdition){
            this.loadCategories();
            this.setState({formDateOperation: getLibelleDate(new Date(), "AAAA-MM-DD")});
        }
        if(this.props.modeEdition && this.props.idOperation !== null && this.props.budget !== null){
            this.fillFormFromOperation(this.props.idOperation, this.props.budget.listeOperations, this.state.categories);
        }

    }

    /**
     * Annulation du formulaire
     */
    cancelForm(){
        this.razForm();
        this.props.hideModale();
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
                                    <RequiredSelect SelectComponent={BaseSelect}
                                            required isDisabled={ this.props.modeEdition } isSearchable={true}
                                            placeholder={"Sélectionnez une catégorie"}
                                            value={this.state.formCategorie} options={this.state.categoriesSelect}
                                            onChange={this.handleSelectCategorie}
                                                getOptionLabel={e => (
                                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                                        <span style={{ fontSize:".875rem" }}>{e.text}</span>
                                                    </div>
                                                )}>
                                    </RequiredSelect>
                                    <RequiredSelect required isDisabled={ this.props.modeEdition } SelectComponent={BaseSelect}
                                            placeholder={"Sélectionnez une sous catégorie"} isSearchable={true}
                                            value={this.state.formSsCategorie} options={this.state.ssCategoriesSelect}
                                            onChange={this.handleSelectSsCategorie}
                                            getOptionLabel={e => (
                                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                                    <span style={{ fontSize:".875rem" }}>{e.text}</span>
                                                </div>
                                            )}>
                                    </RequiredSelect>
                                      { this.state.showIntercompte &&
                                          <RequiredSelect SelectComponent={BaseSelect}
                                              placeholder="Sélectionnez le compte"
                                              value={this.state.selectedCompte}
                                              options={this.state.comptes}
                                              isDisabled={ this.props.modeEdition } isSearchable={true}
                                              onChange={this.handleSelectCompteCible}
                                              getOptionLabel={e => (
                                                  <div style={{ display: 'flex', alignItems: 'center' }}>
                                                      {e.icon} <span style={{ marginLeft: 5, fontSize:12 }}>{e.text}</span>
                                                  </div>
                                              )}
                                          />
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
                                <Select value={this.state.formEtat} options={this.listeEtats}
                                    onChange={this.handleSelectEtat} isSearchable={true}
                                    getOptionLabel={e => (
                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                            {e.icon} <span style={{ marginLeft: 15, fontSize:".875rem" }}>{e.text}</span>
                                        </div>
                                    )}
                                />
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
                                <Button id="btnClose" variant="secondary" onClick={ this.cancelForm } >Annuler</Button>
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