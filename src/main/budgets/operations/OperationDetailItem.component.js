import React from 'react'
import {Box, Container, Stack, Typography} from "@mui/material";
import OperationValue from "./renderers/OperationSpanValue.component";
import * as Controller from "./renderers/OperationItem.controller";
import Grid2 from "@mui/material/Unstable_Grid2";
import OperationItemActionsComponent from "./OperationItemActions.component";

const OperationDetailItem = ({operation, budget}) => {


    return (
        <Container fixed maxWidth={"md"}>
            <Stack direction={"column"} spacing={5} sx={{alignItems: "center"}}>
                <Box width={40} height={40}
                     sx={{
                         borderRadius: "50%",
                         backgroundColor: Controller.getCategorieColor(operation.categorie), color: '#FFFFFF',
                         padding: '16px 6px 0px 6px',
                     }}>
                    <center>{Controller.getSousCategorieIcon(operation.ssCategorie)}</center>
                </Box>

                <Typography variant={"h4"}>
                    <OperationValue operation={operation} valueOperation={operation.valeur} showSign={true}/>
                </Typography>

                <Typography variant={"button"} sx={{fontSize: "large"}}>{operation.libelle}</Typography>


                <Grid2 container width={"100%"}>
                    <Grid2 md={6}>
                        <Typography variant={"caption"} sx={{color: "#808080"}}>Catégories</Typography>
                    </Grid2>
                    <Grid2 md={3}>
                        <Typography variant={"caption"} sx={{color: "#808080"}}>Etat</Typography>
                    </Grid2>
                    <Grid2 md={3}>
                        <Typography variant={"caption"} sx={{color: "#808080"}}>Période</Typography>
                    </Grid2>

                    <Grid2 md={6}>
                        <Typography
                            variant={"overline"}> {operation.categorie.libelle} / {operation.ssCategorie.libelle} </Typography>
                    </Grid2>
                    <Grid2 md={3}>
                        <Typography variant={"overline"}>{operation.etat} </Typography>
                    </Grid2>
                    <Grid2 md={3}>
                        {(operation.mensualite != null ?
                                <Typography variant={"overline"}>{operation.mensualite.periode}</Typography> : <></>
                        )}
                    </Grid2>


                    <Grid2 md={6} paddingTop={3}>
                        {budget != null && budget.actif ?
                            <Typography variant={"caption"} sx={{color: "#808080"}}>Actions</Typography> : <></>
                        }

                    </Grid2>
                    <Grid2 md={3} paddingTop={3}>
                        {operation.autresInfos.dateOperation != null ?
                            <Typography variant={"caption"} sx={{color: "#808080"}}>Date
                                d'opération</Typography> : <></>
                        }
                    </Grid2>
                    <Grid2 md={3} paddingTop={3}>

                    </Grid2>
                    <Grid2 md={6}>
                        {budget != null && budget.actif ?
                            <OperationItemActionsComponent operation={operation}/> : <></>
                        }
                    </Grid2>
                    <Grid2 md={3}>
                        {operation.autresInfos.dateOperation != null ?
                            <Typography
                                variant={"subtitle1"}> {operation.autresInfos.dateOperation} </Typography> : <></>
                        }
                    </Grid2>
                    <Grid2 md={4}>

                    </Grid2>
                </Grid2>


            </Stack>
        </Container>
    )
};

export default OperationDetailItem
