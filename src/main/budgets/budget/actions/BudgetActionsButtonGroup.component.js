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
    Tooltip
} from '@mui/material';

import * as Controller from './BudgetActionsButtonGroup.controller'
import * as Service from './BudgetActionsButtonGroup.extservices'
import {UTILISATEUR_DROITS} from "../../../Utils/AppEnums.constants";
import {AddchartRounded, LockOpenRounded, LockRounded, RestartAltRounded} from "@mui/icons-material";

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
            <ButtonGroup aria-label="ActionsBudget" onClick={this.handleButtonsBudgetClick} variant={"light"}
                         sx={{marginLeft: "-10px"}}>
                    {this.props.budget.actif &&
                    <Tooltip title="Créer une nouvelle opération">
                        <IconButton
                            className={"buttonsActionsBudget"} sx={{backgroundColor: '#209ED8', marginX: '10px'}}
                            id={"CREATION"} onClick={this.handleOperationCreate}>
                            <center id={"CREATION"}><AddchartRounded id={"REALISEE"}
                                                                     onClick={this.handleOperationCreate}/>
                            </center>
                        </IconButton>
                    </Tooltip>
                    }
                    { this.props.budget.actif && this.props.droits != null && this.props.droits[UTILISATEUR_DROITS.DROITS.RAZ_BUDGET] &&
                    <Tooltip title="Réinitialiser le budget">
                        <IconButton
                            className={"buttonsActionsBudget"} sx={{backgroundColor: '#EDC109'}}
                            id={"REINIT_A_CONFIRMER"} onClick={this.handleOperationCreate}>
                            <center id={"REINIT_A_CONFIRMER"}><RestartAltRounded id={"REINIT_A_CONFIRMER"}
                                                                                 onClick={this.handleOperationCreate}/>
                            </center>
                        </IconButton>
                    </Tooltip>
                    }
                    { this.props.droits?.[UTILISATEUR_DROITS.DROITS.CLOTURE_BUDGET] &&
                    <Tooltip title={(this.props.budget.actif ? "Clôturer" : "Réouvrir") + " le budget"}>

                        {(this.props.budget.actif ?
                            <IconButton
                                className={"buttonsActionsBudget"} sx={{backgroundColor: '#2e7d32'}}
                                id={"CLOSE_A_CONFIRMER"} onClick={this.handleOperationCreate}>
                                <center id={"CLOSE_A_CONFIRMER"}>
                                    <LockOpenRounded id={"CLOSE_A_CONFIRMER"} onClick={this.handleOperationCreate}/>
                                </center>
                            </IconButton> :
                            <IconButton
                                className={"buttonsActionsBudget"} sx={{backgroundColor: '#C70039'}}
                                id={"CLOSE_A_CONFIRMER"} onClick={this.handleOperationCreate}>
                                <center id={"CLOSE_A_CONFIRMER"}>
                                    <LockRounded id={"CLOSE_A_CONFIRMER"} onClick={this.handleOperationCreate}/>
                                </center>
                            </IconButton>)}
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
