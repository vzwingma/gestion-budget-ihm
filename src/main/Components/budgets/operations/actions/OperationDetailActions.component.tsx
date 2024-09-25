import React, { useState } from "react";

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
import OperationModel from "@/src/main/Models/Operation.model";
import { OPERATION_ETATS_ENUM } from "@/src/main/Utils/AppBusinessEnums.constants";
import CenterComponent from "../../../CenterComponent";
import BudgetMensuelModel from "@/src/main/Models/BudgetMensuel.model";
import { handleOperationAction } from "./OperationDetailActions.controller";


interface OperationDetailActionsProps {
    operation: OperationModel
    budget: BudgetMensuelModel
    isInCreateMode: boolean,
    onClickRealiseInCreateMode : (valeurDate: Date, editOperation: OperationModel, setEditOperation: React.Dispatch<React.SetStateAction<OperationModel>>) => void
    onOperationChange: (budget: BudgetMensuelModel) => void
}

/**
 * Composant affichant la liste des actions possibles sur l'opération
 * @param currentOperation opération
 * @param currentBudget budget
 * @param isInCreateMode booléen mode création ?
 * @param saveOperation fonction appelée pour déclencher la sauvegarde de l'opération
 * @returns {JSX.Element}
 * @constructor
 */

export const OperationDetailActions: React.FC<OperationDetailActionsProps> = ({ operation, budget, isInCreateMode, onClickRealiseInCreateMode : handleDateOperationFromCreateAction, onOperationChange }: OperationDetailActionsProps): JSX.Element => {

    

    const [showModale, setShowModale] = useState<boolean>(false);
 // TODO :  sur le button group

    return (
        <ButtonGroup onClick={(e : any) => handleOperationAction(e, operation, budget, isInCreateMode, handleDateOperationFromCreateAction, onOperationChange, setShowModale)} >
            {operation.etat !== OPERATION_ETATS_ENUM.REALISEE &&
                <Tooltip title="Valider l'opération">
                    <IconButton
                        className={"buttonsActionsOperations color_" + OPERATION_ETATS_ENUM.REALISEE}
                        id={OPERATION_ETATS_ENUM.REALISEE}>
                        <center>
                            <CheckCircleOutlined id={OPERATION_ETATS_ENUM.REALISEE} />
                        </center>
                    </IconButton>
                </Tooltip>
            }
            {operation.etat !== OPERATION_ETATS_ENUM.PREVUE &&
                <Tooltip title="Prévoir l'opération">
                    <IconButton
                        className={"buttonsActionsOperationsP color_" + OPERATION_ETATS_ENUM.PREVUE}
                        id={OPERATION_ETATS_ENUM.PREVUE}>
                        <center>
                            <HistoryRounded id={OPERATION_ETATS_ENUM.PREVUE} />
                        </center>
                    </IconButton>
                </Tooltip>
            }
            {operation.etat !== OPERATION_ETATS_ENUM.REPORTEE &&
                <Tooltip title="Reporter l'opération">
                    <IconButton
                        className={"buttonsActionsOperations color_" + OPERATION_ETATS_ENUM.REPORTEE}
                        id={OPERATION_ETATS_ENUM.REPORTEE}>
                        <center>
                            <ArrowForwardRounded id={OPERATION_ETATS_ENUM.REPORTEE} />
                        </center>
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
                            <DeleteForeverRounded id={"SUPPRIMEE_A_CONFIRMER"}
                                 />
                        </CenterComponent>
                    </IconButton>
                </Tooltip>

                // TODO : onClick={handleOperationAction} sur supprimer
            }


            <Dialog open={showModale}>
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