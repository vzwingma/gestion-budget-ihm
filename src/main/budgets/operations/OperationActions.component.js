import React, { Component } from "react";
import {Button, ButtonGroup, Col, Modal, Row} from 'react-bootstrap';
import * as AppConstants from "../../Utils/AppEnums.constants"
import * as ClientHTTP from './../../Services/ClientHTTP.service'
import OperationButtonAction from "./OperationButtonAction.component"

export default class OperationActions extends Component {



    state = {
        showModale: false
    }
    // Constructor
    /** Constructeur **/
    constructor(props){
        super(props);
        this.handleToggleClick= this.handleToggleClick.bind(this);
        this.hideShowModale = this.hideShowModale.bind(this);
        this.updateOperation = this.updateOperation.bind(this);
    }

    /**
     * Modification de l'opération sur action des boutons
      */
    updateOperation(operation){
        console.log("Modification de l'opération " + operation.id + " -> " + operation.etat);

        ClientHTTP.call(operation.etat === "SUPPRIMEE" ? "DELETE" : "POST",
            AppConstants.BACKEND_ENUM.URL_OPERATIONS, AppConstants.SERVICES_URL.OPERATIONS.UPDATE,
            [ this.props.budgetid, operation.id ],
            operation)
            .then((data) => {
                // Update du budget global (parent)
                this.props.onOperationChange(data);
            })
            .catch((e) => {
                console.log("Erreur lors de la mise à jour de l'opération " + operation.id + " >> "+ e);
                console.log(operation);
            })
    }


    // Mise à jour de l'état de l'opération suivant le bouton
    handleToggleClick(event) {
        const action = event.target.attributes["action"].value;

        if(action === "SUPPRIMEE_A_CONFIRMER"){
            this.hideShowModale(true)
        }
        else if(action === "SUPPRIMEE_ANNULER"){
            this.hideShowModale(false)
        }
        else{
            this.props.operation.etat=action;
            this.updateOperation(this.props.operation);
        }
    }

    // Mise à jour de l'état de l'opération
    hideShowModale(showPopup) {
        this.setState( { showModale : showPopup })
    }



    render(){
        return (
            <ButtonGroup aria-label="Actions" onClick={this.handleToggleClick}>
                <style type="text/css">{`
                .btn-light {
                    padding: 0px 1px 0px 1px;
                }
            `}</style>
                { this.props.operation.etat !== "REALISEE" &&
                    <OperationButtonAction action="REALISEE" iconAction="circle_ok.png" label="Valider l'opération"/>
                }
                { this.props.operation.etat !== "PREVUE" &&
                    <OperationButtonAction action="PREVUE" iconAction="circle_clock.png" label="Prévoir l'opération"/>
                }
                { this.props.operation.etat !== "ANNULEE" &&
                    <OperationButtonAction action="ANNULEE" iconAction="circle_cancel.png" label="Annuler l'opération"/>
                }
                { this.props.operation.etat !== "SUPPRIMEE" &&
                    <>
                    <OperationButtonAction action="SUPPRIMEE_A_CONFIRMER" iconAction="circle_remove.png" label="Supprimer l'opération"/>
                    <Modal show={this.state.showModale}>
                        <Modal.Header>
                            <Modal.Title>Suppression d'une opération</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Row><Col>Voulez vous supprimer cette opération ?</Col></Row>
                        </Modal.Body>

                        <Modal.Footer>
                            <Button action="SUPPRIMEE_ANNULER" variant="secondary">Fermer</Button>
                            <Button action="SUPPRIMEE" variant="success">Confirmer</Button>
                        </Modal.Footer>
                    </Modal>
                    </>
                }
                { this.props.operation.etat !== "REPORTEE" &&
                    <OperationButtonAction action="REPORTEE" iconAction="circle_arrow_right.png" label="Reporter l'opération"/>
                }
            </ButtonGroup>
        )
    }
}