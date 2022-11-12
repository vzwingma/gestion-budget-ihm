 import React from 'react'
 import {TableCell, TableRow} from "@mui/material";

 const MicroServicesInfos = ({ name, version }) => {
      return (
            <TableRow>
              <TableCell>{name}</TableCell><TableCell>{version}</TableCell>
            </TableRow>
      )
    };

 export default MicroServicesInfos