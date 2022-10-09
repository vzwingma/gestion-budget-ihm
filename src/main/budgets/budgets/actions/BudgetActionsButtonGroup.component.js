import React, {Component} from 'react';
import {Button, ButtonGroup, Modal} from "react-bootstrap";
import {Tooltip} from '@mui/material';

import * as Controller from './BudgetActionsButtonGroup.controller'
import * as Service from './BudgetActionsButtonGroup.extservices'

export default class BudgetActionsButtonGroupComponent extends Component {

    state = {
        // Fenêtre modale
        showModale: false,
        title: null,
        question: null,
        // Texte pour l'affichage suivant l'action
        action: null
    }


    /** Constructeur **/
    constructor(props){
        super(props);
        this.handleButtonsBudgetClick = Controller.handleButtonsBudgetClick.bind(this);
        this.hideModale = Controller.hideModale.bind(this);
        this.callReopenCloseBudget = Service.callReopenCloseBudget.bind(this);
        this.callReinitBudget = Service.callReinitBudget.bind(this);
    }






    /**
     *  RENDER
     */
    render() {
        return (
            <>
            { /** Groupe d'actions sur le budget **/ }
                <ButtonGroup aria-label="ActionsBudget" onClick={this.handleButtonsBudgetClick}>
                    <Tooltip title={(this.props.budget.actif ? "Clôturer" : "Réouvrir") + " le budget"}>
                        <Button className="btn-light" action="CLOSE_A_CONFIRMER" variant="light">
                            <img action="CLOSE_A_CONFIRMER" src={"/img/statuts/" + (this.props.budget.actif ? "unlocked" : "locked") +".png"} className="d-inline-block align-top" alt="Confirmer changement d'état"/>
                        </Button>
                    </Tooltip>
                    { this.props.budget.actif &&
                    <Tooltip title="Réinitialiser le budget">
                        <Button className="btn-light" action="REINIT_A_CONFIRMER" variant="light">
                            <img action="REINIT_A_CONFIRMER" src={"/img/statuts/circle_reinit.png"} className="d-inline-block align-top" alt="Réinitialiser le budget"/>
                        </Button>
                    </Tooltip>
                    }
                    <Modal show={this.state.showModale} onHide={this.hideModal} className="modal" centered >
                        <Modal.Header closeButton>
                            <Modal.Title>{this.state.title}</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            {this.state.question}
                        </Modal.Body>

                        <Modal.Footer>
                            <ButtonGroup>
                                <Button action="ANNULER"    variant="secondary">Annuler</Button>
                                <Button action="CONFIRMER"  variant="success">Confirmer</Button>
                            </ButtonGroup>
                        </Modal.Footer>
                    </Modal>

                </ButtonGroup>
            </>
        )
    }
}