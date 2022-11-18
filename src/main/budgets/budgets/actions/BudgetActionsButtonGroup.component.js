import React, {Component} from 'react';
import {
    Tooltip,
    Button, ButtonGroup,
    Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions
} from '@mui/material';

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
                <ButtonGroup aria-label="ActionsBudget" onClick={this.handleButtonsBudgetClick} variant={"light"}>
                    { this.props.budget.actif &&
                    <Tooltip title="Réinitialiser le budget">
                        <Button className="btn-light" id="REINIT_A_CONFIRMER" variant="light">
                            <img id="REINIT_A_CONFIRMER" src={"/img/statuts/circle_reinit.png"} className="d-inline-block align-top" alt="Réinitialiser le budget"/>
                        </Button>
                    </Tooltip>
                    }
                    <Tooltip title={(this.props.budget.actif ? "Clôturer" : "Réouvrir") + " le budget"}>
                        <Button className="btn-light" id="CLOSE_A_CONFIRMER" variant="light">
                            <img id="CLOSE_A_CONFIRMER" src={"/img/statuts/" + (this.props.budget.actif ? "unlocked" : "locked") +".png"} className="d-inline-block align-top" alt="Confirmer changement d'état"/>
                        </Button>
                    </Tooltip>
                    <Dialog open={this.state.showModale}>
                        <DialogTitle>{this.state.title}</DialogTitle>
                        <DialogContent>
                            <DialogContentText>{this.state.question}</DialogContentText>
                        </DialogContent>

                        <DialogActions>
                            <ButtonGroup>
                                <Button id="ANNULER"    color="error">Annuler</Button>
                                <Button id="CONFIRMER"  color="success">Confirmer</Button>
                            </ButtonGroup>
                        </DialogActions>
                    </Dialog>

                </ButtonGroup>
            </>
        )
    }
}