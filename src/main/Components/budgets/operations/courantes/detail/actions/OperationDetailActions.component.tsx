import React, {JSX, useContext, useState} from "react";

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
import {OPERATION_ETATS_ENUM} from "../../../../../../Utils/AppBusinessEnums.constants.ts";
import { CenterComponent } from "../../../../../shared/CenterComponent.tsx";
import {OperationDetailActionsProps} from "../../../../../Components.props.ts";
import {BudgetContext} from "../../../../../../Models/contextProvider/BudgetContextProvider.tsx";
import { handleOperationAction } from "./OperationDetailActions.controller.ts";


/**
 * Composant affichant la liste des actions possibles sur l'opération
 * @param currentOperation opération
 * @param isInCreateMode booléen mode création ?
 * @returns {JSX.Element}
 * @constructor
 */
export const OperationDetailActions: React.FC<OperationDetailActionsProps> = ({   isInCreateMode,
                                                                                  editOperation,
                                                                                  onClickRealiseInCreateMode: handleDateOperationFromCreateAction,
                                                                                  onOperationChange
                                                                              }: OperationDetailActionsProps): JSX.Element => {

    const [showModale, setShowModale] = useState<boolean>(false);
    const { currentBudget, currentOperation } = useContext(BudgetContext);
    const operation = currentOperation;
    const budget = currentBudget;
    return (
        <ButtonGroup
            variant="contained"
            onClick={(e) => handleOperationAction(e, operation, budget, isInCreateMode, editOperation, handleDateOperationFromCreateAction, onOperationChange, setShowModale)}>
            {operation.etat !== OPERATION_ETATS_ENUM.REALISEE &&
                <Tooltip title="Valider l'opération">
                    <IconButton
                        className={"buttonsActionsOperations color_" + OPERATION_ETATS_ENUM.REALISEE}
                        id={OPERATION_ETATS_ENUM.REALISEE}>
                        <CenterComponent>
                            <CheckCircleOutlined id={OPERATION_ETATS_ENUM.REALISEE} />
                        </CenterComponent>
                    </IconButton>
                </Tooltip>
            }
            {operation.etat !== OPERATION_ETATS_ENUM.PREVUE &&
                <Tooltip title="Prévoir l'opération">
                    <IconButton
                        className={"buttonsActionsOperations color_" + OPERATION_ETATS_ENUM.PREVUE}
                        id={OPERATION_ETATS_ENUM.PREVUE}>
                        <CenterComponent>
                            <HistoryRounded id={OPERATION_ETATS_ENUM.PREVUE} />
                        </CenterComponent>
                    </IconButton>
                </Tooltip>
            }
            {operation.etat !== OPERATION_ETATS_ENUM.REPORTEE &&
                <Tooltip title="Reporter l'opération">
                    <IconButton
                        className={"buttonsActionsOperations color_" + OPERATION_ETATS_ENUM.REPORTEE}
                        id={OPERATION_ETATS_ENUM.REPORTEE}>
                        <CenterComponent>
                            <ArrowForwardRounded id={OPERATION_ETATS_ENUM.REPORTEE} />
                        </CenterComponent>
                    </IconButton>
                </Tooltip>
            }
            {operation.etat !== OPERATION_ETATS_ENUM.ANNULEE && !isInCreateMode &&
                <Tooltip title="Annuler l'opération">
                    <IconButton
                        className={"buttonsActionsOperations color_" + OPERATION_ETATS_ENUM.ANNULEE}
                        id={OPERATION_ETATS_ENUM.ANNULEE}>
                        <CenterComponent>
                            <CloseRounded id={OPERATION_ETATS_ENUM.ANNULEE} />
                        </CenterComponent>
                    </IconButton>
                </Tooltip>
            }
            {operation.etat !== OPERATION_ETATS_ENUM.SUPPRIMEE && !isInCreateMode &&
                <Tooltip title="Supprimer l'opération">
                    <IconButton
                        className={"buttonsActionsOperations color_" + OPERATION_ETATS_ENUM.SUPPRIMEE}
                        id={"SUPPRIMEE_A_CONFIRMER"}>
                        <CenterComponent>
                            <DeleteForeverRounded id={"SUPPRIMEE_A_CONFIRMER"} />
                        </CenterComponent>
                    </IconButton>
                </Tooltip>
            }


            <Dialog open={showModale}>
                <DialogTitle>Suppression de l'opération</DialogTitle>
                <DialogContent>
                    <DialogContentText>Voulez vous supprimer l'opération ?</DialogContentText>
                </DialogContent>

                <DialogActions sx={{ justifyContent: "center", gap: 1 }}>
                    <Button id="ANNULER" color="error" sx={{ flex: 1 }}>Annuler</Button>
                    <Button id="SUPPRIMEE" color="success" sx={{ flex: 1 }}>Confirmer</Button>
                </DialogActions>
            </Dialog>
        </ButtonGroup>

    );
}
