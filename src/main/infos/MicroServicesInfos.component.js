import React from 'react'
import {TableCell, TableRow} from "@mui/material";
import PropTypes from "prop-types";

/**
  * Affichage d'une tuile sur un des backend
  * @param name nom du µS
  * @param version version du µS
  * @returns {JSX.Element}
  * @constructor
  */
 const MicroServicesInfos = ({ name, version }) => {
      return (
            <TableRow>
              <TableCell>{name}</TableCell><TableCell>{version}</TableCell>
            </TableRow>
      )
    };
 // Properties Types
 MicroServicesInfos.propTypes = {
     name: PropTypes.string.isRequired,
     version: PropTypes.string.isRequired
 }
 export default MicroServicesInfos
