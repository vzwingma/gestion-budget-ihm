import React, {Component} from 'react';
import {Button, ButtonGroup, Modal, OverlayTrigger, Tooltip} from "react-bootstrap";
import * as Controller from './BudgetActionsButtonGroup.controller'
import * as Service from './BudgetActionsButtonGroup.extservices'

export default class BudgetActionsButtonGroupComponent extends Component {

    state = {
        idBudget: null,
        etatBudget: true,
        // Fenêtre modale
        showModale: false,
        title: null,
        question: null,
        // Texte pour l'affichage suivant l'action
        action: null,
        libelleActionCloture : null,
        imageActionCloture : null

    }


    /** Constructeur **/
    constructor(props){
        super(props);
        this.handleButtonsBudgetClick = Controller.handleButtonsBudgetClick.bind(this);
        this.hideModale = Controller.hideModale.bind(this);
        this.callReopenCloseBudget = Service.callReopenCloseBudget.bind(this);
        this.callReinitBudget = Service.callReinitBudget.bind(this);
    }



    // Mise à jour du contexte de budget
    shouldComponentUpdate(nextProps, nextStates){

        if( nextProps.budget != null && nextProps.budget.actif !== nextStates.etatBudget ) {
            const etatBudget = nextProps.budget.actif;
            this.setState({
                idBudget : nextProps.budget.id,
                etatBudget: etatBudget,
                libelleActionCloture: (etatBudget ? "Clôturer" : "Réouvrir") + " le budget",
                imageActionCloture: (etatBudget ? "unlocked" : "locked")
            });
            console.log("[TRIGGER] Context budget : " + nextProps.budget.id + "::" + etatBudget)
        }
        return true;
    }



    /**
     *  RENDER
     */
    render() {
        return (
            <>
            { /** Groupe d'actions sur le budget **/ }
                <ButtonGroup aria-label="ActionsBudget" onClick={this.handleButtonsBudgetClick}>
                    <OverlayTrigger overlay={  <Tooltip>{this.state.libelleActionCloture}</Tooltip>  }>
                        <Button className="btn-light" action="CLOSE_A_CONFIRMER" variant="light">
                            <img action="CLOSE_A_CONFIRMER" src={"/img/statuts/" + this.state.imageActionCloture+".png"} className="d-inline-block align-top" alt={this.state.libelleActionCloture}/>
                        </Button>
                    </OverlayTrigger>
                    { this.state.etatBudget &&
                    <OverlayTrigger overlay={  <Tooltip>Réinitialiser le budget</Tooltip>  }>
                        <Button className="btn-light" action="REINIT_A_CONFIRMER" variant="light">
                            <img action="REINIT_A_CONFIRMER" src={"/img/statuts/circle_reinit.png"} className="d-inline-block align-top" alt="Réinitialiser le budget"/>
                        </Button>
                    </OverlayTrigger>
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
                                <Button action="ANNULER" variant="secondary">Annuler</Button>
                                <Button action="CONFIRMER" variant="success">Confirmer</Button>
                            </ButtonGroup>
                        </Modal.Footer>
                    </Modal>

                </ButtonGroup>
            </>
        )
    }
}