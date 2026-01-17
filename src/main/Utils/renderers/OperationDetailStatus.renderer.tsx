/**
 * Affichage d'une valeur dans la liste des opérations
 */
import React, { JSX } from 'react';
import { FlagCircleRounded, WatchLaterRounded } from '@mui/icons-material';
import { Stack, Tooltip, Typography, useMediaQuery, useTheme } from '@mui/material';
import { OPERATION_STATUS_ENUM } from '../AppBusinessEnums.constants.ts';


interface OperationStatusProps {
    statutsOperation: OPERATION_STATUS_ENUM[];
}
const ICON_SIZE_DETAIL_MOBILE = 22;
const ICON_SIZE_DETAIL_DESKTOP = 30;
/**
 * Affichage du statut (en retard, dernière échéance) d'une opération
 * @param statutsOperation : OPERATION_STATUS_ENUM[] statuts de l'opération
 * @param operation : OperationModel opération
 * @returns {JSX.Element} JSX
 * @constructor
 */
const OperationDetailStatus: React.FC<OperationStatusProps> = ({ statutsOperation }: OperationStatusProps): JSX.Element => {
    const isMobile = useMediaQuery(useTheme().breakpoints.down('lg'));

    function getIconSize() {
        return isMobile ? ICON_SIZE_DETAIL_MOBILE : ICON_SIZE_DETAIL_DESKTOP;
    }


    if (statutsOperation === null || statutsOperation === undefined) {
        return <></>
    } else if (statutsOperation.includes(OPERATION_STATUS_ENUM.EN_RETARD)) {
        // définition du libellé
        return (
            <Tooltip title="En retard">
                <Stack 
                    direction="row" 
                    spacing={1} 
                    alignItems="center" 
                    className="operation-status-badge operation-status-en-retard"
                >
                    <WatchLaterRounded
                        sx={{
                            color: "#FB923C",
                            width: getIconSize() + "px",
                            height: getIconSize() + "px",
                            marginRight: "4px"
                        }} />
                    <Typography variant={"overline"} color="#FB923C">EN RETARD</Typography>
                </Stack>
            </Tooltip>
        )
    } else if (statutsOperation.includes(OPERATION_STATUS_ENUM.DERNIERE_ECHEANCE)) {
        // définition du libellé
        return (
            <Tooltip title="Dernière échéance ce mois">
                <Stack direction="row" spacing={1} alignItems="center" className="operation-status-badge operation-status-derniere-echeance">
                    <FlagCircleRounded sx={{
                        color: "#60A5FA",
                        width: getIconSize() + "px",
                        height: getIconSize() + "px",
                        marginRight: "4px"
                    }} />
                    <Typography variant={"overline"} color="#60A5FA">DERNIÈRE ÉCHÉANCE</Typography>
                </Stack>                
                
            </Tooltip>
        )
    }
    else {
        return <span className="operation-status-error">{statutsOperation.join("||")}</span>
    }
};
export default OperationDetailStatus
