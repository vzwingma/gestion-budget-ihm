import React, {Component} from 'react';
import {
    Button,
    ButtonGroup,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    IconButton,
    Stack,
    Tooltip
} from '@mui/material';

import * as Controller from './BudgetActionsButtonGroup.controller'
import * as Service from './BudgetActionsButtonGroup.extservices'
import {UTILISATEUR_DROITS} from "../../../Utils/AppBusinessEnums.constants";
import {AddchartRounded, LockOpenRounded, LockRounded, RestartAltRounded} from "@mui/icons-material";
import PropTypes from "prop-types";

/**
 * Actions sur le budget
 * @param budget : Object budget en cours
 * @param droits : array liste des droits de l'utilsiateur
 * @param onActionBudgetChange : function callback lors d'une mise à jour sur le budget
 * @param onActionOperationCreate : function callback lors du click sur créer
 */
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
    constructor(props) {
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
            <Stack direction={"row-reverse"} alignItems={"end"} onClick={this.handleButtonsBudgetClick}>
                {this.props.droits?.[UTILISATEUR_DROITS.DROITS.CLOTURE_BUDGET] &&
                    <Tooltip title={(this.props.budget.actif ? "Clôturer" : "Réouvrir") + " le budget"}>

                        {(this.props.budget.actif ?
                            <IconButton
                                className={"buttonsActionsBudget"} sx={{backgroundColor: '#2e7d32'}}
                                id={"CLOSE_A_CONFIRMER"}>
                                <center><LockOpenRounded id={"CLOSE_A_CONFIRMER"}/></center>
                            </IconButton> :
                            <IconButton
                                className={"buttonsActionsBudget"} sx={{backgroundColor: '#C70039'}}
                                id={"CLOSE_A_CONFIRMER"}>
                                <center><LockRounded id={"CLOSE_A_CONFIRMER"}/></center>
                            </IconButton>)}
                    </Tooltip>
                }

                {this.props.budget.actif && this.props?.droits[UTILISATEUR_DROITS.DROITS.RAZ_BUDGET] &&
                    <Tooltip title="Réinitialiser le budget">
                        <IconButton
                            className={"buttonsActionsBudget"} sx={{backgroundColor: '#EDC109'}}
                            id={"REINIT_A_CONFIRMER"}>
                            <center><RestartAltRounded id={"REINIT_A_CONFIRMER"}/></center>
                        </IconButton>
                    </Tooltip>
                }

                {this.props.budget.actif &&
                    <Tooltip title="Créer une nouvelle opération">
                        <IconButton
                            className={"buttonsActionsBudget"} sx={{backgroundColor: '#209ED8', marginX: '10px'}}
                            id={"CREATE"}>
                            <center><AddchartRounded id={"CREATE"}/></center>
                        </IconButton>
                    </Tooltip>
                }
                <Dialog open={this.state.showModale}>
                    <DialogTitle>{this.state.title}</DialogTitle>
                    <DialogContent>
                        <DialogContentText>{this.state.question}</DialogContentText>
                    </DialogContent>

                    <DialogActions>
                        <ButtonGroup>
                            <Button id="ANNULER" color="error">Annuler</Button>
                            <Button id="CONFIRMER" color="success">Confirmer</Button>
                        </ButtonGroup>
                    </DialogActions>
                </Dialog>

            </Stack>
        )
    }
}
BudgetActionsButtonGroupComponent.propTypes = {
    budget: PropTypes.object.isRequired,
    droits: PropTypes.object.isRequired,
    onActionBudgetChange: PropTypes.func.isRequired,
    onActionOperationCreate: PropTypes.func.isRequired
}
