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
 * @returns {JSX.Element}
 * @constructor
 */
const OperationItemActions = ({operation, budget, onActionEtat, handleBudgetUpdate}) => {

    return (
        <ButtonGroup onClick={(e) => onActionEtat(e, budget, operation, handleBudgetUpdate)}>
            {operation.etat !== "REALISEE" &&
                <Tooltip title="Valider l'opération">
                    <IconButton
                        sx={{backgroundColor: '#2e7d32', color: '#FFFFFF', padding: '5px 5px 0px 5px', marginX: '1px'}}
                        id={"REALISEE"}>
                        <center id={"REALISEE"}><CheckCircleOutlined id={"REALISEE"}/></center>
                    </IconButton>
                </Tooltip>
            }
            {operation.etat !== "PREVUE" &&
                <Tooltip title="Prévoir l'opération">
                    <IconButton
                        sx={{backgroundColor: '#ed6c02', color: '#FFFFFF', padding: '5px 5px 0px 5px', marginX: '1px'}}
                        id={"PREVUE"}>
                        <center id={"PREVUE"}><HistoryRounded id={"PREVUE"}/></center>
                    </IconButton>
                </Tooltip>
            }
            {operation.etat !== "ANNULEE" &&
                <Tooltip title="Annuler l'opération">
                    <IconButton
                        sx={{backgroundColor: '#cbcbcb', color: '#FFFFFF', padding: '5px 5px 0px 5px', marginX: '1px'}}
                        id={"ANNULEE"}>
                        <center id={"ANNULEE"}><CloseRounded id={"ANNULEE"}/></center>
                    </IconButton>
                </Tooltip>
            }
            {operation.etat !== "SUPPRIMEE" &&
                <Tooltip title="Supprimer l'opération">
                    <IconButton
                        sx={{backgroundColor: '#ed1b24', color: '#FFFFFF', padding: '5px 5px 0px 5px', marginX: '1px'}}
                        id={"SUPPRIMEE"}>
                        <center id={"SUPPRIMEE"}><DeleteForeverRounded id={"SUPPRIMEE"}/></center>
                    </IconButton>
                </Tooltip>
            }
            {operation.etat !== "REPORTEE" &&
                <Tooltip title="Reporter l'opération">
                    <IconButton
                        sx={{backgroundColor: '#9c27b0', color: '#FFFFFF', padding: '5px 5px 0px 5px', marginX: '1px'}}
                        id={"REPORTEE"}>
                        <center id={"REPORTEE"}><ArrowForwardRounded id={"REPORTEE"}/></center>
                    </IconButton>
                </Tooltip>
            }
        </ButtonGroup>
    )
}
export default OperationItemActions
