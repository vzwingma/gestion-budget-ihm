import React from 'react'
import {Box, Stack, Typography} from "@mui/material";
import OperationValue from "./renderers/OperationSpanValue.component";
import * as Controller from "./OperationItem.controller";
import Grid2 from "@mui/material/Unstable_Grid2";
import OperationItemActionsComponent from "./OperationItemActions.component";

const OperationDetailItem = ({operation, onClick}) => {


    return (
        <Stack direction={"column"} spacing={16}>
            <center>
                <Box width={40} height={40}
                     sx={{
                         borderRadius: "50%",
                         backgroundColor: Controller.getCategorieColor(operation.categorie), color: '#FFFFFF',
                         padding: '16px 6px 0px 6px'
                     }}>
                    <center>{Controller.getSousCategorieIcon(operation.ssCategorie)}</center>
                </Box>
                <Typography variant={"h4"} component="div" sx={{spacing: 2}}>
                    <OperationValue operation={operation} valueOperation={operation.valeur} showSign={true}/>
                </Typography>

                <Typography variant={"overline"} component="div" sx={{spacing: 2}}>
                    {operation.libelle}
                </Typography>


                <Grid2 container={"fluid"}>
                    <Grid2 md={2}/>
                    <Grid2 md={3}>
                        <Typography variant={"caption"} component="div" align={"left"}
                                    sx={{spacing: 2, color: "#808080"}}>
                            Catégories
                        </Typography>
                    </Grid2>
                    <Grid2 md={3}>
                        <Typography variant={"caption"} component="div" align={"left"}
                                    sx={{spacing: 2, color: "#808080"}}>
                            Etat
                        </Typography>
                    </Grid2>
                    <Grid2 md={3}>
                        <Typography variant={"caption"} component="div" align={"left"}
                                    sx={{spacing: 2, color: "#808080"}}>
                            Période
                        </Typography>
                    </Grid2>
                    <Grid2 md={1}/>

                    <Grid2 md={2}/>
                    <Grid2 md={3}>
                        <Typography variant={"subtitle1"} component="div" align={"left"} sx={{spacing: 2}}>
                            {operation.categorie.libelle} / {operation.ssCategorie.libelle}
                        </Typography>
                    </Grid2>
                    <Grid2 md={3}>
                        <Typography variant={"subtitle1"} component="div" align={"left"} sx={{spacing: 2}}>
                            {operation.etat}
                        </Typography>
                    </Grid2>
                    <Grid2 md={3}>
                        {(operation.mensualite != null ?
                        <Typography variant={"subtitle1"} component="div" align={"left"} sx={{spacing: 2}}>
                            {operation.mensualite.periode}
                        </Typography> : <></>)}
                    </Grid2>
                    <Grid2 md={1}/>
                </Grid2>


                <Grid2 container={"fluid"}>
                    <Grid2 md={2}/>
                    <Grid2 md={3}>
                        {(operation.autresInfos.dateOperation != null ?
                                <Typography variant={"caption"} component="div" align={"left"}
                                            sx={{spacing: 2, color: "#808080"}}>
                                    Date d'opération
                                </Typography> : <></>
                        )}
                    </Grid2>
                    <Grid2 md={3}>

                    </Grid2>
                    <Grid2 md={3}>

                    </Grid2>
                    <Grid2 md={1}/>

                    <Grid2 md={2}/>
                    <Grid2 md={3}>
                        {(operation.autresInfos.dateOperation != null ?
                            <Typography variant={"subtitle1"} component="div" align={"left"} sx={{spacing: 2}}>
                                {operation.autresInfos.dateOperation}
                            </Typography> : <></>)}
                    </Grid2>
                    <Grid2 md={3}>

                    </Grid2>
                    <Grid2 md={3}>

                    </Grid2>
                    <Grid2 md={1}/>
                </Grid2>


                <OperationItemActionsComponent operation={operation}/>
            </center>
        </Stack>
    )
};

export default OperationDetailItem
