import React from 'react'
import {Box, Stack, Typography} from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2";
import OperationValue from "./renderers/OperationSpanValue.component";
import * as Controller from "./OperationItem.controller";

const OperationItem = ({operation, onClick}) => {


    return (
        <Box sx={{
            height: 56,
            '&:hover': {
                backgroundColor: '#f5f6fb',
                color: '#808080',
                cursor: 'pointer',
            }
        }} onClick={() => onClick(operation)}>
            <Grid2 container spacing={6}>
                <Grid2 md={1}>
                    <Box width={25} height={25}
                         sx={{
                             borderRadius: "50%",
                             backgroundColor: Controller.getCategorieColor(operation.categorie),
                             border: '5px solid ' + Controller.getOperationStateColor(operation.etat),
                             padding: '6px',
                             color: '#FFFFFF'
                         }}>
                        <center>{Controller.getSousCategorieIcon(operation.ssCategorie)}</center>
                    </Box>
                </Grid2>
                <Grid2 md={7}>
                    <Stack direction={"column"}>
                        <Typography variant={"subtitle1"} component="div" align={"left"} sx={{spacing: 2}}>
                            {operation.libelle}
                        </Typography>
                        <Typography variant={"caption"} component="div" align={"left"}
                                    sx={{spacing: 2, color: "#808080"}}>
                            {operation.categorie.libelle} / {operation.ssCategorie.libelle}
                        </Typography>
                    </Stack>

                </Grid2>
                <Grid2 md={3}>
                    <Typography variant={"subtitle1"} component="div" align={"right"} sx={{spacing: 2}}>
                        <OperationValue operation={operation} valueOperation={operation.valeur} showSign={true}/>
                    </Typography>
                </Grid2>
            </Grid2>
        </Box>

    )
};

export default OperationItem
