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
                {this.props.currentOperation.etat !== "REALISEE" &&
                    <Tooltip title="Valider l'opération">
                        <IconButton
                            className={"buttonsActionsOperations color_REALISEE"}
                            id={"REALISEE"}>
                            <center id={"REALISEE"}>
                                <CheckCircleOutlined id={"REALISEE"}/>
                            </center>
                        </IconButton>
                    </Tooltip>
                }
                {this.props.currentOperation.etat !== "PREVUE" &&
                    <Tooltip title="Prévoir l'opération">
                        <IconButton
                            className={"buttonsActionsOperations color_PREVUE"}
                            id={"PREVUE"}>
                            <center id={"PREVUE"}>
                                <HistoryRounded id={"PREVUE"}/>
                            </center>
                        </IconButton>
                    </Tooltip>
                }
                {this.props.currentOperation.etat !== "ANNULEE" &&
                    <Tooltip title="Annuler l'opération">
                        <IconButton
                            className={"buttonsActionsOperations color_ANNULEE"}
                            id={"ANNULEE"}>
                            <center id={"ANNULEE"}>
                                <CloseRounded id={"ANNULEE"}/>
                            </center>
                        </IconButton>
                    </Tooltip>
                }
                {this.props.currentOperation.etat !== "SUPPRIMEE" &&
                    <Tooltip title="Supprimer l'opération">
                        <IconButton
                            className={"buttonsActionsOperations color_SUPPRIMEE"}
                            id={"SUPPRIMEE_A_CONFIRMER"}>
                            <center id={"SUPPRIMEE_A_CONFIRMER"}>
                                <DeleteForeverRounded id={"SUPPRIMEE_A_CONFIRMER"}
                                                      onClick={this.handleOperationAction}/>
                            </center>
                        </IconButton>
                    </Tooltip>
                }
                {this.props.currentOperation.etat !== "REPORTEE" &&
                    <Tooltip title="Reporter l'opération">
                        <IconButton
                            className={"buttonsActionsOperations color_REPORTEE"}
                            id={"REPORTEE"}>
                            <center id={"REPORTEE"}>
                                <ArrowForwardRounded id={"REPORTEE"}/>
                            </center>
                        </IconButton>
                    </Tooltip>
                }

                <Dialog open={this.state.showModale}>
                    <DialogTitle>Supprimer</DialogTitle>
                    <DialogContent>
                        <DialogContentText>Voulez vous supprimer ?</DialogContentText>
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
