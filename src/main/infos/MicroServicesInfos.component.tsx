import React from 'react'
import {TableCell, TableRow, Typography} from "@mui/material";
import PropTypes from "prop-types";
import MsInfo from '../Models/MsInfo.model';

/**
 * Affichage d'une tuile sur un des backend
 * @param nom nom du µS
 * @param version version du µS
 * @returns {JSX.Element}
 * @constructor
 */
const MicroServicesInfos: React.FC<MsInfo> = ({nom, version}): JSX.Element => {
    return (
        <TableRow>
            <TableCell><Typography variant={"subtitle2"}>{nom}</Typography></TableCell>
            <TableCell><Typography variant={"body2"}>{version}</Typography></TableCell>
        </TableRow>
    )
};
export default MicroServicesInfos
