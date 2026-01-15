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

    const ICON_SIZE_MOBILE = 16;
    const ICON_SIZE_DESKTOP = 22;
    const ICON_SIZE_DETAIL_MOBILE = 22;
    const ICON_SIZE_DETAIL_DESKTOP = 30;
/**
 * Affichage du statut (en retard, dernière échéance) d'une opération
 * @param statutsOperation : OPERATION_STATUS_ENUM[] statuts de l'opération
 * @param operation : OperationModel opération
 * @returns {JSX.Element} JSX
 * @constructor
 */
const OperationStatus: React.FC<OperationStatusProps> = ({ statutsOperation, detailPage}: OperationStatusProps): JSX.Element => {
    const isMobile = useMediaQuery(useTheme().breakpoints.down('lg'));

    function getIconSize(){
        const mobileIconSize = detailPage ? ICON_SIZE_DETAIL_MOBILE : ICON_SIZE_MOBILE;
        const desktopIconSize = detailPage ? ICON_SIZE_DETAIL_DESKTOP : ICON_SIZE_DESKTOP;
        return isMobile ? mobileIconSize : desktopIconSize;
    }
    
    if (statutsOperation === null) {
        return <span style={{ color: "#808080" }}>.</span>
    } else if (statutsOperation.includes(OPERATION_STATUS_ENUM.EN_RETARD)) {
        // définition du libellé
        return (
            <Tooltip title="En retard">
                <WatchLaterRounded
                    sx={{
                        color: "#A0A0A0",
                        width: getIconSize() + "px",
                        height: getIconSize() + "px",
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
                        color: "#14db14",
                        width: getIconSize() + "px",
                        height: getIconSize() + "px",
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
