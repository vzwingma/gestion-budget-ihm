import React, {JSX, useContext} from 'react'
import {Box, Container, Grid, Stack, Typography, useMediaQuery, useTheme} from "@mui/material";

import { CenterComponent } from '../../CenterComponent.tsx';
import CompteBancaireModel from '../../../Models/budgets/CompteBancaire.model.ts';
import {getCategorieColor, getCategorieIcon} from '../../../Utils/renderers/CategorieItem.renderer.tsx';
import {getOperationIntercompteCatLibelle, getOperationLibelle, getOperationStateColor, getPeriodeRenderer,} from '../../../Utils/renderers/OperationItem.renderer.tsx';
import {BudgetContext} from '../../../Models/contextProvider/BudgetContextProvider.tsx';
import OperationValue from '../../../Utils/renderers/OperationValue.renderer.tsx';
import { operationIsIntercompteFromLibelle } from '../../../Utils/OperationData.utils.ts';
import { getLabelFRFromDate } from '../../../Utils/Date.utils.ts';


/**
 * Composant de page de détail d'une opération.
 *
 * Ce composant affiche les détails d'une opération et permet de modifier ses informations.
 * Il gère également les états du formulaire d'édition et les interactions utilisateur.
 * @returns {JSX.Element} - Le composant de page de détail d'une opération.
 */
export const OperationRecurrenteDetailPage: React.FC = (): JSX.Element => {

    const { currentBudget, currentOperation, comptes } = useContext(BudgetContext);
    const operation = currentOperation;

    const isMobile = useMediaQuery(useTheme().breakpoints.down('lg'));

    /**
     * @returns {JSX.Element} Affichage de l'intercompte en lecture seule
     */
    function getAffichageIntercompteRO(libelle: string, listeAutresComptes: CompteBancaireModel[]): JSX.Element {
        if (libelle != null && operationIsIntercompteFromLibelle(libelle)) {
            return getOperationIntercompteCatLibelle(libelle, listeAutresComptes, isMobile)
        }
        else {
            return <></>
        }
    }

    function getProchaineEcheance(dateOperation: Date, prochaineEcheance: number): string {
        if (prochaineEcheance < 0) {
            return "Aucune"
        } else {
            let dateNow = dateOperation ? new Date(dateOperation) : new Date();
            dateNow.setMonth(dateNow.getMonth() + prochaineEcheance);
            return getLabelFRFromDate(dateNow)
        }
    }
    /**
     * RENDER
     * @returns {JSX.Element} Le composant JSX de la page de détail d'une opération.
     */
    return (
        <Container component="div" fixed>

            <Stack direction={"column"} spacing={isMobile ? 3 : 6}
                   sx={{alignItems: "center", justifyContent: "center", marginTop: "20px"}}>
                <CenterComponent>
                    <Box width={56} height={56}
                        sx={{
                            borderRadius: "50%",
                            backgroundColor: getCategorieColor(operation.categorie.id),
                            color: '#FFFFFF',
                            padding: '15px 0px 0px 15px'
                        }}>
                        {getCategorieIcon(operation.ssCategorie)}
                    </Box>
                </CenterComponent>
                { /** VALEUR **/}
                <Typography variant={"h4"}>
                    <OperationValue id={"OPERATION_RECURRENTE_VALUE"} operation={operation} valueOperation={operation.valeur} showSign={true}/>
                </Typography>
                { /** LIBELLE **/}
                <Typography variant={"button"} sx={{fontSize: isMobile ? "medium" : "large"}}
                                id={"OPERATION_EDITION_FORM.LIBELLE"}>
                                {getOperationLibelle(operation.libelle, comptes, true)}
                            </Typography>

                <Grid container width={"100%"}>
                    <Grid size={{md: 4.5, xl: 5}} paddingTop={3} paddingBottom={1}>
                        <Typography variant={"caption"} sx={{ color: "#808080" }}>Catégorie</Typography>
                    </Grid>
                    <Grid size={{md: 4.5, xl: 4}} paddingTop={3} paddingBottom={1}>
                        <Typography variant={"caption"} sx={{ color: "#808080" }}>Période</Typography>
                    </Grid>
                    <Grid size={{md: 3, xl: 3}} paddingTop={3} paddingBottom={1}>
                        <Typography variant={"caption"} sx={{ color: "#808080" }}>Prochaine échéance</Typography>
                    </Grid>


                    <Grid size={{md: 4.5, xl: 5}}>
                        {  /** CATEGORIES **/}
                        <Typography variant={"overline"}>{operation.categorie.libelle} / {operation.ssCategorie.libelle}</Typography>
                    </Grid>
                    <Grid size={{md: 4.5, xl: 4}}>
                        { /** PERIODE **/}
                        <Typography id={"OPERATION_EDITION_FORM.MENSUALITE"} variant={"overline"}
                                        color={getPeriodeRenderer(operation.mensualite.periode).color}>
                                        {getPeriodeRenderer(operation.mensualite.periode).text}
                                    </Typography>
                    </Grid>
                    <Grid size={{md: 3, xl: 3}}>
                        { /** DATE OPERATION **/}
                        <Typography id={"OPERATION_EDITION_FORM.DATE_OPERATION"} variant={"subtitle1"}
                                        sx={{ color: (operation.mensualite.prochaineEcheance == null ? "#121212" : "#FFFFFF") }}>
                                        {operation.mensualite.prochaineEcheance == null ? "jj/mm/aaaa" : getProchaineEcheance(operation.autresInfos.dateOperation, operation.mensualite.prochaineEcheance)}
                                    </Typography>
                    </Grid>


                    <Grid size={{md: 4.5, xl: 5}} paddingTop={3} paddingBottom={1}>
                        { (operation.libelle != null && operationIsIntercompteFromLibelle(operation.libelle))  ?  
                            <Typography variant={"caption"} sx={{ color: "#808080" }}>Compte de transfert</Typography>  : <></>
                        }
                    </Grid>
                    <Grid size={{md: 4.5, xl: 4}} paddingTop={3} paddingBottom={1}>
                        
                            <Typography variant={"caption"} sx={{ color: "#808080" }}>.</Typography> 
                    </Grid>
                    <Grid size={{md: 3, xl: 3}} paddingTop={3} paddingBottom={1}>
                        <Typography variant={"caption"} sx={{ color: "#808080" }}>Se termine</Typography>
                    </Grid>


                    <Grid size={{md: 4.5, xl: 5}}>
                        { /** COMPTE DE TRANSFERT  **/}
                        {getAffichageIntercompteRO(operation.libelle, comptes.filter((compte: CompteBancaireModel) => currentBudget?.idCompteBancaire !== compte.id))}
                    </Grid>
                    <Grid size={{md: 4.5, xl: 4}}>
                        { /** ACTIONS SUR OPERATION **/}
                         .
                    </Grid>
                    <Grid size={{md: 3, xl: 3}}>
                        { /** DATE OPERATION **/}
                        <Typography id={"OPERATION_EDITION_FORM.DATE_OPERATION"} variant={"subtitle1"}
                                        sx={{ color: (operation.autresInfos.dateOperation == null ? "#121212" : "#FFFFFF") }}>
                                        {operation.autresInfos.dateOperation == null ? "jj/mm/aaaa" : getLabelFRFromDate(operation.autresInfos.dateOperation)}
                                    </Typography>
                    </Grid>
                </Grid>
            </Stack>
        </Container>
    )
}

export default OperationRecurrenteDetailPage
