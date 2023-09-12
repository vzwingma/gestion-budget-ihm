import React from "react";

import {ButtonGroup, IconButton, Tooltip} from "@mui/material";
import {
    ArrowForwardRounded,
    CheckCircleOutlined,
    CloseRounded,
    DeleteForeverRounded,
    HistoryRounded
} from "@mui/icons-material";

/**
 * Composant affichant la liste des actions possibles sur l'opération
 * @param operation opération
 * @param budget budget
 * @param onActionEtat fonction appelée lors d'un changement d'état
 * @param handleBudgetUpdate fonction appelée pour déclencher la mise à jour du budget
 * @returns {JSX.Element}
 * @constructor
 */
const OperationItemActions = ({operation, budget, onActionEtat, handleBudgetUpdate}) => {

    return (
        <ButtonGroup>
            {operation.etat !== "REALISEE" &&
                <Tooltip title="Valider l'opération">
                    <IconButton
                        className={"buttonsActionsOperations color_REALISEE"}
                        id={"REALISEE"} onClick={(e) => onActionEtat(e, budget, operation, handleBudgetUpdate)}>
                        <center id={"REALISEE"}>
                            <CheckCircleOutlined id={"REALISEE"}
                                                 onClick={(e) => onActionEtat(e, budget, operation, handleBudgetUpdate)}/>
                        </center>
                    </IconButton>
                </Tooltip>
            }
            {operation.etat !== "PREVUE" &&
                <Tooltip title="Prévoir l'opération">
                    <IconButton
                        className={"buttonsActionsOperations color_PREVUE"}
                        id={"PREVUE"} onClick={(e) => onActionEtat(e, budget, operation, handleBudgetUpdate)}>
                        <center id={"PREVUE"}>
                            <HistoryRounded id={"PREVUE"}
                                            onClick={(e) => onActionEtat(e, budget, operation, handleBudgetUpdate)}/>
                        </center>
                    </IconButton>
                </Tooltip>
            }
            {operation.etat !== "ANNULEE" &&
                <Tooltip title="Annuler l'opération">
                    <IconButton
                        className={"buttonsActionsOperations color_ANNULEE"}
                        id={"ANNULEE"} onClick={(e) => onActionEtat(e, budget, operation, handleBudgetUpdate)}>
                        <center id={"ANNULEE"}>
                            <CloseRounded id={"ANNULEE"}
                                          onClick={(e) => onActionEtat(e, budget, operation, handleBudgetUpdate)}/>
                        </center>
                    </IconButton>
                </Tooltip>
            }
            {operation.etat !== "SUPPRIMEE" &&
                <Tooltip title="Supprimer l'opération">
                    <IconButton
                        className={"buttonsActionsOperations color_SUPPRIMEE"}
                        id={"SUPPRIMEE"} onClick={(e) => onActionEtat(e, budget, operation, handleBudgetUpdate)}>
                        <center id={"SUPPRIMEE"}>
                            <DeleteForeverRounded id={"SUPPRIMEE"}
                                                  onClick={(e) => onActionEtat(e, budget, operation, handleBudgetUpdate)}/>
                        </center>
                    </IconButton>
                </Tooltip>
            }
            {operation.etat !== "REPORTEE" &&
                <Tooltip title="Reporter l'opération">
                    <IconButton
                        className={"buttonsActionsOperations color_REPORTEE"}
                        id={"REPORTEE"} onClick={(e) => onActionEtat(e, budget, operation, handleBudgetUpdate)}>
                        <center id={"REPORTEE"}>
                            <ArrowForwardRounded id={"REPORTEE"}
                                                 onClick={(e) => onActionEtat(e, budget, operation, handleBudgetUpdate)}/>
                        </center>
                    </IconButton>
                </Tooltip>
            }
        </ButtonGroup>
    )
}
export default OperationItemActions
