/**
 * Affichage d'une valeur dans la liste des opérations
 */
import React, { JSX } from 'react';
import { FlagCircleRounded, WatchLaterRounded } from '@mui/icons-material';
import { Tooltip, useMediaQuery, useTheme } from '@mui/material';
import { OPERATION_STATUS_ENUM } from '../AppBusinessEnums.constants.ts';


interface OperationStatusProps {
    statutsOperation: OPERATION_STATUS_ENUM[];
    detailPage?: boolean;
}

    const ICON_SIZE_MOBILE = 20;
    const ICON_SIZE_DESKTOP = 26;
/**
 * Affichage du statut (en retard, dernière échéance) d'une opération
 * @param statutsOperation : OPERATION_STATUS_ENUM[] statuts de l'opération
 * @param operation : OperationModel opération
 * @returns {JSX.Element} JSX
 * @constructor
 */
const OperationStatus: React.FC<OperationStatusProps> = ({ statutsOperation, detailPage}: OperationStatusProps): JSX.Element => {
    const iconSize = useMediaQuery(useTheme().breakpoints.down('lg')) ? ICON_SIZE_MOBILE : ICON_SIZE_DESKTOP;
    
    if (statutsOperation === null || statutsOperation === undefined) {
        return <></>
    } else if (statutsOperation.includes(OPERATION_STATUS_ENUM.EN_RETARD)) {
        // définition du libellé
        return (
            <Tooltip title="En retard">
                <WatchLaterRounded
                    sx={{
                        color: "#FB923C",
                        width: iconSize + "px",
                        height: iconSize + "px",
                        marginRight: "4px"
                    }} />
            </Tooltip>
        )
    } else if (statutsOperation.includes(OPERATION_STATUS_ENUM.DERNIERE_ECHEANCE)) {
        // définition du libellé
        return (
            <Tooltip title="Dernière échéance ce mois">
                <FlagCircleRounded
                    sx={{
                        color: "#60A5FA",
                        width: iconSize + "px",
                        height: iconSize + "px",
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
