import React from 'react'
import {TableCell, TableRow, Typography} from "@mui/material";
import PropTypes from "prop-types";

/**
 * Affichage d'une tuile sur un des backend
 * @param name nom du µS
 * @param version version du µS
 * @returns {JSX.Element}
 * @constructor
 */
interface MicroServicesInfosProps {
    name: string;
    version: string;
}

const MicroServicesInfos: React.FC<MicroServicesInfosProps> = ({name, version}) => {
    return (
        <TableRow>
            <TableCell><Typography variant={"subtitle2"}>{name}</Typography></TableCell>
            <TableCell><Typography variant={"body2"}>{version}</Typography></TableCell>
        </TableRow>
    )
};
// Properties Types
MicroServicesInfos.propTypes = {
    name: PropTypes.string.isRequired,
    version: PropTypes.string.isRequired
}
export default MicroServicesInfos
