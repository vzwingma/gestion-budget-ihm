import React, { Component } from "react";
import {Button, ButtonGroup, Col, Modal, Row} from 'react-bootstrap';
import OperationButtonAction from "./OperationButtonAction.component";
import * as Controller from './OperationActions.controller';

export default class OperationActions extends Component {



    state = {
        showModale: false
    }


    /** Constructeur **/
    constructor(props){
        super(props);
        this.handleToggleClick= Controller.handleToggleClick.bind(this);
        this.hideShowModale = Controller.hideShowModale.bind(this);
        this.updateOperation = Controller.updateOperation.bind(this);
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
                            <ButtonGroup>
                                <Button action="SUPPRIMEE_ANNULER" variant="secondary">Annuler</Button>
                                <Button action="SUPPRIMEE" variant="success">Confirmer</Button>
                            </ButtonGroup>
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