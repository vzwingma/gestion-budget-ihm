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
import PropTypes from "prop-types";


/**
 * Composant affichant la liste des actions possibles sur l'opération
 * @param currentOperation opération
 * @param currentBudget budget
 * @param isInCreateMode booléen mode création ?
 * @param saveOperation fonction appelée pour déclencher la sauvegarde de l'opération
 * @returns {JSX.Element}
 * @constructor
 */
export default class OperationDetailActions extends Component {

    /** Etats pour la page OperationDetailActions **/
    state = {
        showModale: false
    }


    /** Constructeur **/
    constructor(props) {
        super(props);

        this.handleOperationAction = Controller.handleOperationAction.bind(this);
        this.updateOperation = Controller.updateOperation.bind(this);
    }


    render() {

        return (
            <ButtonGroup onClick={this.handleOperationAction}>
                {this.props.currentOperation.etat !== AppConstants.OPERATION_ETATS_ENUM.REALISEE &&
                    <Tooltip title="Valider l'opération">
                        <IconButton
                            className={"buttonsActionsOperations color_" + AppConstants.OPERATION_ETATS_ENUM.REALISEE}
                            id={AppConstants.OPERATION_ETATS_ENUM.REALISEE}>
                            <center>
                                <CheckCircleOutlined id={AppConstants.OPERATION_ETATS_ENUM.REALISEE}/>
                            </center>
                        </IconButton>
                    </Tooltip>
                }
                {this.props.currentOperation.etat !== AppConstants.OPERATION_ETATS_ENUM.PREVUE &&
                    <Tooltip title="Prévoir l'opération">
                        <IconButton
                            className={"buttonsActionsOperations color_" + AppConstants.OPERATION_ETATS_ENUM.PREVUE}
                            id={AppConstants.OPERATION_ETATS_ENUM.PREVUE}>
                            <center>
                                <HistoryRounded id={AppConstants.OPERATION_ETATS_ENUM.PREVUE}/>
                            </center>
                        </IconButton>
                    </Tooltip>
                }
                {this.props.currentOperation.etat !== AppConstants.OPERATION_ETATS_ENUM.REPORTEE &&
                    <Tooltip title="Reporter l'opération">
                        <IconButton
                            className={"buttonsActionsOperations color_" + AppConstants.OPERATION_ETATS_ENUM.REPORTEE}
                            id={AppConstants.OPERATION_ETATS_ENUM.REPORTEE}>
                            <center>
                                <ArrowForwardRounded id={AppConstants.OPERATION_ETATS_ENUM.REPORTEE}/>
                            </center>
                        </IconButton>
                    </Tooltip>
                }
                {this.props.currentOperation.etat !== AppConstants.OPERATION_ETATS_ENUM.ANNULEE && !this.props.isInCreateMode() &&
                    <Tooltip title="Annuler l'opération">
                        <IconButton
                            className={"buttonsActionsOperations color_" + AppConstants.OPERATION_ETATS_ENUM.ANNULEE}
                            id={AppConstants.OPERATION_ETATS_ENUM.ANNULEE}>
                            <center>
                                <CloseRounded id={AppConstants.OPERATION_ETATS_ENUM.ANNULEE}/>
                            </center>
                        </IconButton>
                    </Tooltip>
                }
                {this.props.currentOperation.etat !== AppConstants.OPERATION_ETATS_ENUM.SUPPRIMEE && !this.props.isInCreateMode() &&
                    <Tooltip title="Supprimer l'opération">
                        <IconButton
                            className={"buttonsActionsOperations color_" + AppConstants.OPERATION_ETATS_ENUM.SUPPRIMEE}
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
OperationDetailActions.propTypes = {
    currentOperation: PropTypes.object.isRequired,
    currentBudget: PropTypes.object.isRequired,
    isInCreateMode: PropTypes.bool.isRequired,
    saveOperation: PropTypes.func.isRequired
}
