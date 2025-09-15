import React, {JSX} from 'react'
import {TableCell, TableRow} from "@mui/material";
import MsInfoModel from "../../Models/infos/MsInfo.model.ts";
/**
 * Affichage d'une tuile sur un des backend
 * @param nom nom du µS
 * @param version version du µS
 * @returns {JSX.Element}
 * @constructor
 */
const MicroServicesInfos: React.FC<MsInfoModel> = ({nom, version}): JSX.Element => {
    return (
        <TableRow>
            <TableCell>{nom}</TableCell> <TableCell>{version}</TableCell>
        </TableRow>
    )
};
export default MicroServicesInfos
