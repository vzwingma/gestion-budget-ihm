import React, {Component} from 'react';
import {
    Button,
    ButtonGroup,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Tooltip
} from '@mui/material';

import * as Controller from './BudgetActionsButtonGroup.controller'
import * as Service from './BudgetActionsButtonGroup.extservices'
import {UTILISATEUR_DROITS} from "../../../Utils/AppEnums.constants";

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
        /** Groupe d'actions sur le budget **/
        return (
                <ButtonGroup aria-label="ActionsBudget" onClick={this.handleButtonsBudgetClick} variant={"light"}>
                    <Tooltip title="Créer une nouvelle opération">
                        <Button onClick={this.handleOperationCreate} color={"success"}>
                            <img id="CREATION" src={"/img/statuts/circle_plus.png"} className="d-inline-block align-top"
                                 alt="Création"/>
                        </Button>
                    </Tooltip>
                    { this.props.budget.actif && this.props.droits != null && this.props.droits[UTILISATEUR_DROITS.DROITS.RAZ_BUDGET] &&
                    <Tooltip title="Réinitialiser le budget">
                        <Button className="btn-light" id="REINIT_A_CONFIRMER" variant="light">
                            <img id="REINIT_A_CONFIRMER" src={"/img/statuts/circle_reinit.png"} className="d-inline-block align-top" alt="Réinitialiser le budget"/>
                        </Button>
                    </Tooltip>
                    }
                    { this.props.droits?.[UTILISATEUR_DROITS.DROITS.CLOTURE_BUDGET] &&
                    <Tooltip title={(this.props.budget.actif ? "Clôturer" : "Réouvrir") + " le budget"}>
                        <Button className="btn-light" id="CLOSE_A_CONFIRMER" variant="light">
                            <img id="CLOSE_A_CONFIRMER" src={"/img/statuts/" + (this.props.budget.actif ? "unlocked" : "locked") +".png"} className="d-inline-block align-top" alt="Confirmer changement d'état"/>
                        </Button>
                    </Tooltip>
                    }
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
        )
    }
}
