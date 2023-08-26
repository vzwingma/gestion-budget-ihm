import React from 'react'
import {TableCell, TableRow} from "@mui/material";

const CompteItem = ({compte}) => {
    return (
        <TableRow>
            <TableCell>{compte.icon}</TableCell><TableCell>{compte.libelle}</TableCell><TableCell>2000 €</TableCell>
        </TableRow>
    )
};

export default CompteItem
