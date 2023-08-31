import React from "react";

import {Box, ButtonGroup, Tooltip} from "@mui/material";
import {
    ArrowForwardRounded,
    CheckCircleOutlined,
    CloseRounded,
    DeleteForeverRounded,
    HistoryRounded
} from "@mui/icons-material";

const OperationItemActions = ({operation}) => {


    return (
        <ButtonGroup aria-label="Actions" variant={"light"}>
            {operation.etat !== "REALISEE" &&
                <Tooltip title="Valider l'opération">
                    <Box width={28} height={28} sx={{
                        borderRadius: "50%",
                        backgroundColor: '#2e7d32', color: '#FFFFFF',
                        padding: '4px 2px 0px 2px'
                    }}>
                        <center><CheckCircleOutlined/></center>
                    </Box>
                </Tooltip>
            }
            {operation.etat !== "PREVUE" &&
                <Tooltip title="Prévoir l'opération">
                    <Box width={28} height={28} sx={{
                        borderRadius: "50%",
                        backgroundColor: '#ed6c02', color: '#FFFFFF',
                        padding: '4px 3px 0px 2px'
                    }}>
                        <center><HistoryRounded/></center>
                    </Box>
                </Tooltip>
            }
            {operation.etat !== "ANNULEE" &&
                <Tooltip title="Annuler l'opération">
                    <Box width={28} height={28} sx={{
                        borderRadius: "50%",
                        backgroundColor: '#cbcbcb', color: '#FFFFFF',
                        padding: '4px 3px 0px 2px'
                    }}>
                        <center><CloseRounded/></center>
                    </Box>
                </Tooltip>
            }
            {operation.etat !== "SUPPRIMEE" &&
                <Tooltip title="Supprimer l'opération">
                    <Box width={28} height={28} sx={{
                        borderRadius: "50%",
                        backgroundColor: '#ed1b24', color: '#FFFFFF',
                        padding: '4px 2px 0px 2px'
                    }}>
                        <center><DeleteForeverRounded/></center>
                    </Box>
                </Tooltip>
            }
            {operation.etat !== "REPORTEE" &&
                <Tooltip title="Reporter l'opération">
                    <Box width={28} height={28} sx={{
                        borderRadius: "50%",
                        backgroundColor: '#9c27b0', color: '#FFFFFF',
                        padding: '4px 2px 0px 2px'
                    }}>
                        <center><ArrowForwardRounded/></center>
                    </Box>
                </Tooltip>
            }
        </ButtonGroup>
    )
}
export default OperationItemActions
