import React, {Component} from "react";

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
} from "@mui/material";
import {
    ArrowForwardRounded,
    CheckCircleOutlined,
    CloseRounded,
    DeleteForeverRounded,
    HistoryRounded
} from "@mui/icons-material";
import * as Controller from "./OperationDetailActions.controller";
import * as AppConstants from "../../../Utils/AppBusinessEnums.constants";


/**
 * Composant affichant la liste des actions possibles sur l'opération
 * @param operation opération
 * @param budget budget
 * @param onActionEtat fonction appelée lors d'un changement d'état
 * @param onActionOperationChange fonction appelée pour déclencher la mise à jour du budget
 * @returns {JSX.Element}
 * @constructor
 */
export default class OperationDetailActions extends Component {


    /** Etats pour la page OperationDetailActions **/
    state = {
        currentBudget: null,
        currentOperation: null,
        showModale: false
    }


    /** Constructeur **/
    constructor(props) {
        super(props);

        this.handleOperationAction = Controller.handleOperationAction.bind(this);
        this.updateOperation = Controller.updateOperation.bind(this);

        this.setState({
            currentOperation: this.props.currentOperation,
            currentBudget: this.props.currentBudget,
            showModale: false
        });
    }


    render() {

        return (
            <ButtonGroup onClick={this.handleOperationAction}>
                {this.props.currentOperation.etat !== AppConstants.OPERATIONS_ENUM.REALISEE &&
                    <Tooltip title="Valider l'opération">
                        <IconButton
                            className={"buttonsActionsOperations color_" + AppConstants.OPERATIONS_ENUM.REALISEE}
                            id={AppConstants.OPERATIONS_ENUM.REALISEE}>
                            <center>
                                <CheckCircleOutlined id={AppConstants.OPERATIONS_ENUM.REALISEE}/>
                            </center>
                        </IconButton>
                    </Tooltip>
                }
                {this.props.currentOperation.etat !== AppConstants.OPERATIONS_ENUM.PREVUE &&
                    <Tooltip title="Prévoir l'opération">
                        <IconButton
                            className={"buttonsActionsOperations color_" + AppConstants.OPERATIONS_ENUM.PREVUE}
                            id={AppConstants.OPERATIONS_ENUM.PREVUE}>
                            <center>
                                <HistoryRounded id={AppConstants.OPERATIONS_ENUM.PREVUE}/>
                            </center>
                        </IconButton>
                    </Tooltip>
                }
                {this.props.currentOperation.etat !== AppConstants.OPERATIONS_ENUM.REPORTEE &&
                    <Tooltip title="Reporter l'opération">
                        <IconButton
                            className={"buttonsActionsOperations color_" + AppConstants.OPERATIONS_ENUM.REPORTEE}
                            id={AppConstants.OPERATIONS_ENUM.REPORTEE}>
                            <center>
                                <ArrowForwardRounded id={AppConstants.OPERATIONS_ENUM.REPORTEE}/>
                            </center>
                        </IconButton>
                    </Tooltip>
                }
                {this.props.currentOperation.etat !== AppConstants.OPERATIONS_ENUM.ANNULEE &&
                    <Tooltip title="Annuler l'opération">
                        <IconButton
                            className={"buttonsActionsOperations color_" + AppConstants.OPERATIONS_ENUM.ANNULEE}
                            id={AppConstants.OPERATIONS_ENUM.ANNULEE}>
                            <center>
                                <CloseRounded id={AppConstants.OPERATIONS_ENUM.ANNULEE}/>
                            </center>
                        </IconButton>
                    </Tooltip>
                }
                {this.props.currentOperation.etat !== AppConstants.OPERATIONS_ENUM.SUPPRIMEE &&
                    <Tooltip title="Supprimer l'opération">
                        <IconButton
                            className={"buttonsActionsOperations color_" + AppConstants.OPERATIONS_ENUM.SUPPRIMEE}
                            id={"SUPPRIMEE_A_CONFIRMER"}>
                            <center>
                                <DeleteForeverRounded id={"SUPPRIMEE_A_CONFIRMER"}
                                                      onClick={this.handleOperationAction}/>
                            </center>
                        </IconButton>
                    </Tooltip>
                }


                <Dialog open={this.state.showModale}>
                    <DialogTitle>Suppression de l'opération</DialogTitle>
                    <DialogContent>
                        <DialogContentText>Voulez vous supprimer l'opération ?</DialogContentText>
                    </DialogContent>

                    <DialogActions>
                        <ButtonGroup>
                            <Button id="ANNULER" color="error">Annuler</Button>
                            <Button id="SUPPRIMEE" color="success">Confirmer</Button>
                        </ButtonGroup>
                    </DialogActions>
                </Dialog>
            </ButtonGroup>

        );
    }
}
