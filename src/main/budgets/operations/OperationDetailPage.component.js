import React from 'react'
import {Box, Container, Stack, Typography} from "@mui/material";
import OperationValue from "./renderers/OperationSpanValue.renderer";
import * as Renderer from "./renderers/OperationItem.renderer";
import Grid2 from "@mui/material/Unstable_Grid2";
import OperationDetailActions from "./OperationDetailActions.component";
import * as AppConstants from "../../Utils/AppEnums.constants";


/**
 * Page de détail d'une opération
 * @param operation opération sélectionnée
 * @param budget budget associée
 * @param onActionOperationChange opération de mise à jour du budget
 * @returns {JSX.Element} composant
 * @constructor
 */
const OperationDetailPage = ({operation, budget, onActionOperationChange}) => {


    return (
        <Container fixed maxWidth={"md"}>
            <Stack direction={"column"} spacing={5} sx={{alignItems: "center"}}>
                <Box width={40} height={40}
                     sx={{
                         borderRadius: "50%",
                         backgroundColor: Renderer.getCategorieColor(operation.categorie), color: '#FFFFFF',
                         padding: '16px 8px 0px 8px',
                     }}>
                    <center>{Renderer.getSousCategorieIcon(operation.ssCategorie)}</center>
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
                        <Typography variant={"overline"}
                                    color={Renderer.getOperationStateColor(operation.etat)}>{operation.etat} </Typography>
                    </Grid2>
                    <Grid2 md={3}>
                        {(operation.mensualite != null ?
                                <Typography variant={"overline"}
                                            color={Renderer.getPeriodeColor(operation.mensualite.periode)}>{operation.mensualite.periode}</Typography> : <></>
                        )}
                    </Grid2>


                    <Grid2 md={6} paddingTop={3}>
                        {budget != null && budget.actif && operation.etat !== AppConstants.OPERATIONS_ENUM.SUPPRIMEE ?
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
                        {budget != null && budget.actif && operation.etat !== AppConstants.OPERATIONS_ENUM.SUPPRIMEE ?
                            <OperationDetailActions currentOperation={operation}
                                                    currentBudget={budget}
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

export default OperationDetailPage