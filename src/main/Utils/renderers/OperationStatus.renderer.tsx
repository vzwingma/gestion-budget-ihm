/**
 * Affichage d'une valeur dans la liste des opérations
 */
import React, { JSX } from 'react';
import { WatchLaterRounded } from '@mui/icons-material';
import { Tooltip, useMediaQuery, useTheme } from '@mui/material';
import { OPERATION_STATUS_ENUM } from '../AppBusinessEnums.constants.ts';


interface OperationStatusProps {
    statutsOperation: OPERATION_STATUS_ENUM[];
}

/**
 * Affichage du statut (en retard, dernière échéance) d'une opération
 * @param statutsOperation : OPERATION_STATUS_ENUM[] statuts de l'opération
 * @param operation : OperationModel opération
 * @returns {JSX.Element} JSX
 * @constructor
 */
const OperationStatus: React.FC<OperationStatusProps> = ({ statutsOperation}: OperationStatusProps): JSX.Element => {
    const isMobile = useMediaQuery(useTheme().breakpoints.down('lg'));
    if (statutsOperation === null) {
        return <span style={{ color: "#808080" }}>.</span>
    } else if (statutsOperation.includes(OPERATION_STATUS_ENUM.EN_RETARD)) {
        // définition du libellé
        return (
            <Tooltip title="En retard">
                <WatchLaterRounded
                    sx={{
                        color: "#A0A0A0",
                        width: isMobile ? "16px" : "22px",
                        height: isMobile ? "16px" : "22px",
                        marginRight: "4px"
                    }} />
            </Tooltip>
        )
    } else if (statutsOperation.includes(OPERATION_STATUS_ENUM.DERNIERE_ECHEANCE)) {
        // définition du libellé
        return (
            <Tooltip title="Dernière échéance ce mois">
                <WatchLaterRounded
                    sx={{
                        color: "#14db14",
                        width: isMobile ? "16px" : "22px",
                        height: isMobile ? "16px" : "22px",
                        marginRight: "4px"
                    }} />
            </Tooltip>
        )
    }
    else{
        return <span style={{ color: "#f70505" }}>{statutsOperation.join("||")}</span>
    }
};
export default OperationStatus
