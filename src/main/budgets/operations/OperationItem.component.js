import React from 'react'
import {Box, Stack, Typography} from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2";
import OperationValue from "./renderers/OperationSpanValue.component";
import * as Controller from "./OperationItem.controller";

const OperationItem = ({operation}) => {


    return (
        <Box sx={{
            height: 56,
            '&:hover': {
                backgroundColor: 'primary.main',
                color: 'white',
                opacity: [0.7, 0.6, 0.5],
            },
        }}>
            <Grid2 container spacing={6}>
                <Grid2 md={1}>
                    <Box width={25} height={25}
                         sx={{
                             borderRadius: "50%",
                             backgroundColor: Controller.getCategorieColor(operation.categorie),
                             border: '5px solid grey',
                             padding: '6px'
                         }}>
                        <center>{Controller.getSousCategorieIcon(operation.ssCategorie)}</center>
                    </Box>

                </Grid2>
                <Grid2 md={7}>
                    <Stack direction={"column"}>
                        <Typography variant={"h6"} component="div" align={"left"} sx={{spacing: 2}}>
                            {operation.libelle}
                        </Typography>
                        <Typography variant={"body2"} component="div" align={"left"}
                                    sx={{spacing: 2, color: "#808080"}}>
                            {operation.categorie.libelle} / {operation.ssCategorie.libelle}
                        </Typography>
                    </Stack>

                </Grid2>
                <Grid2 md={3}>
                    <Typography variant={"h6"} component="div" align={"left"} sx={{spacing: 2}}>
                        <OperationValue valueOperation={operation.valeur} showSign={true}/>
                    </Typography>
                </Grid2>
            </Grid2>
        </Box>

    )
};

export default OperationItem
