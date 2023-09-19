import React from 'react'
import {Box, Container, Stack, Typography} from "@mui/material";
import OperationValue from "./renderers/OperationSpanValue.component";
import * as Controller from "./renderers/OperationItem.controller";
import Grid2 from "@mui/material/Unstable_Grid2";
import OperationDetailActions from "./OperationDetailActions.component";

/**
 * Page de détail d'une opération
 * @param operation opération sélectionnée
 * @param budget budget associée
 * @param onActionOperationChange opération de mise à jour du budget
 * @returns {JSX.Element} composant
 * @constructor
 */
const OperationDetailItem = ({operation, budget, onActionOperationChange}) => {


    return (
        <Container fixed maxWidth={"md"}>
            <Stack direction={"column"} spacing={5} sx={{alignItems: "center"}}>
                <Box width={40} height={40}
                     sx={{
                         borderRadius: "50%",
                         backgroundColor: Controller.getCategorieColor(operation.categorie), color: '#FFFFFF',
                         padding: '16px 8px 0px 8px',
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
                        {(operation.mensualite != null ?
                                <Typography variant={"caption"} sx={{color: "#808080"}}>Période</Typography> : <></>
                        )}
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
                        {budget != null && budget.actif && operation.etat !== "SUPPRIMEE" && operation.etat !== "REPORTEE" ?
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
                        {budget != null && budget.actif && operation.etat !== "SUPPRIMEE" && operation.etat !== "REPORTEE" ?
                            <OperationDetailActions currentOperation={operation} currentBudget={budget}
                                                    onActionOperationChange={onActionOperationChange}/> : <></>
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
