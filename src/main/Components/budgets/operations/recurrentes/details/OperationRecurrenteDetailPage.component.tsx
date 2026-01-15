import React, { JSX, useContext, useEffect, useState } from 'react'
import { Box, Button, Container, Grid, Stack, Typography, useMediaQuery, useTheme } from "@mui/material";


import { CenterComponent } from '../../../../CenterComponent.tsx';
import { BudgetContext } from '../../../../../Models/contextProvider/BudgetContextProvider.tsx';
import CompteBancaireModel from '../../../../../Models/budgets/CompteBancaire.model.ts';
import { operationIsIntercompteFromLibelle } from '../../../../../Utils/OperationData.utils.ts';
import { getOperationLibelle, getPeriodeRenderer } from '../../../../../Utils/renderers/OperationItem.renderer.tsx';
import { getCategorieColor, getCategorieIcon } from '../../../../../Utils/renderers/CategorieItem.renderer.tsx';
import OperationValue from '../../../../../Utils/renderers/OperationValue.renderer.tsx';
import { OperationDetailDateFin } from './subcomponents/OperationRecurrenteDetailDateFin.component.tsx';
import OperationEditionModel, { createNewOperationEdition } from '../../../../../Models/budgets/OperationEdition.model.ts';
import { createEmptyEditForm, createEmptyErrors, EditFormProps, ErrorsFormProps, getProchaineEcheance, isDerniereEcheanceRO, OPERATION_RECURRENTE_EDITION_FORM } from './OperationRecurrenteDetailPage.constants.ts';
import { handleOperationRecurrenteEditionClick, handleValidateOperationForm, isInEditMode } from './OperationRecurrenteDetailPage.controller.ts';
import BudgetMensuelModel from '../../../../../Models/budgets/BudgetMensuel.model.ts';
import { OperationRecurrenteDetailPageProps } from '../../../../Components.props.ts';
import { getAffichageIntercompteRO } from '../../courantes/detail/subcomponents/OperationDetailIntercompte.component.tsx';
import OperationStatus from '../../../../../Utils/renderers/OperationStatus.renderer.tsx';




/**
 * Composant de page de détail d'une opération.
 *
 * Ce composant affiche les détails d'une opération et permet de modifier ses informations.
 * Il gère également les états du formulaire d'édition et les interactions utilisateur.
 * @returns {JSX.Element} - Le composant de page de détail d'une opération.
 */
export const OperationRecurrenteDetailPage: React.FC<OperationRecurrenteDetailPageProps> = ({
    onOperationChange
}: OperationRecurrenteDetailPageProps): JSX.Element => {

    const [editForm, setEditForm] = useState<EditFormProps>(createEmptyEditForm());
    const [refresh, setRefresh] = useState<Date>(new Date());
    const [errors, setErrors] = useState<ErrorsFormProps>(createEmptyErrors());
    const [editOperation, setEditOperation] = useState<OperationEditionModel>(createNewOperationEdition());
    const { currentBudget, currentOperation, comptes } = useContext(BudgetContext);
    const operation = currentOperation;
    const budget = currentBudget;

    const isMobile = useMediaQuery(useTheme().breakpoints.down('lg'));

    useEffect(() => { }, [refresh]);

    /**
     * Init de l'opération du formulaire à la sélection d'une nouvelle opération
     */
    useEffect(() => {
        setEditOperation(createNewOperationEdition());
        setEditForm(createEmptyEditForm());
        setErrors(createEmptyErrors());
    }, [operation]);

    /**
     * Ouverture du formulaire d'édition
     * @param editForm formulaire d'édition
     */
    function openEditForm(editForm: EditFormProps) {
        setEditForm(editForm)
        setRefresh(new Date())
    }

    /**
     * callback de mise à jour de l'opération
     * @param budget budget mis à jour
     */
    function onOperationUpdate(budget: BudgetMensuelModel) {
        openEditForm(createEmptyEditForm());
        onOperationChange(budget);
    }


    /**
     * Mise à jour du formulaire d'édition
     * @param field champ du formulaire à mettre à jour
     * @param value valeur du champ
     */
    function fillOperationRecurrenteForm(field: OPERATION_RECURRENTE_EDITION_FORM, value: string) {
        const editOperationUpdated = { ...editOperation };
        if (field === OPERATION_RECURRENTE_EDITION_FORM.DATE_FIN) {
            if (value !== null && value !== undefined && value !== "") {
                editOperationUpdated.mensualite.dateFin = new Date(Date.parse(value));
            }
            else {
                editOperationUpdated.mensualite.dateFin = null
            }
        }
        openEditForm(editForm);
        setEditOperation(editOperationUpdated);
    }

    /**
     * RENDER
     * @returns {JSX.Element} Le composant JSX de la page de détail d'une opération.
     */
    return (
        <Container component="div" fixed
            onClick={(event: any) => handleOperationRecurrenteEditionClick(event, { operation, budget }, editOperation, editForm, openEditForm, setErrors, onOperationUpdate)}
            onKeyUp={(event: any) => handleOperationRecurrenteEditionClick(event, { operation, budget }, editOperation, editForm, openEditForm, setErrors, onOperationUpdate)}>

            <Stack direction={"column"} spacing={isMobile ? 3 : 6}
                sx={{ alignItems: "center", justifyContent: "center", marginTop: "20px" }}>
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
                    <OperationValue id={"OPERATION_RECURRENTE_VALUE"} operation={operation} valueOperation={operation.valeur} showSign={true} />
                </Typography>
                { /** LIBELLE **/}
                <Typography variant={"button"} sx={{ fontSize: isMobile ? "medium" : "large" }}
                    id={"OPERATION_EDITION_FORM.LIBELLE"}>
                    {getOperationLibelle(operation.libelle, comptes, true)}
                </Typography>

                <Grid container width={"100%"}>
                    <Grid size={{ md: 4.5, xl: 5 }} paddingTop={3} paddingBottom={1}>
                        <Typography variant={"caption"} sx={{ color: "#808080" }}>Catégorie</Typography>
                    </Grid>
                    <Grid size={{ md: 4.5, xl: 4 }} paddingTop={3} paddingBottom={1}>
                        <Typography variant={"caption"} sx={{ color: "#808080" }}>Période</Typography>
                    </Grid>
                    <Grid size={{ md: 3, xl: 3 }} paddingTop={3} paddingBottom={1}>
                        <Typography variant={"caption"} sx={{ color: "#808080" }}>Prochaine échéance</Typography>
                    </Grid>


                    <Grid size={{ md: 4.5, xl: 5 }}>
                        {  /** CATEGORIES **/}
                        <Typography variant={"overline"}>{operation.categorie.libelle} / {operation.ssCategorie.libelle}</Typography>
                    </Grid>
                    <Grid size={{ md: 4.5, xl: 4 }}>
                        { /** PERIODE **/}
                        <Typography id={"OPERATION_EDITION_FORM.MENSUALITE"} variant={"overline"} color={getPeriodeRenderer(operation.mensualite.periode).color} 
                                    style={{ border: '1px solid ' + getPeriodeRenderer(operation.mensualite.periode).color, padding: '10px', paddingRight: '10px', borderRadius: '4px' }}>
                            {getPeriodeRenderer(operation.mensualite.periode).text}
                        </Typography>
                    </Grid>
                    <Grid size={{ md: 3, xl: 3 }}>
                        { /** DATE OPERATION **/}
                        <Typography id={"OPERATION_EDITION_FORM.DATE_OPERATION"} variant={"subtitle1"}
                            sx={{ color: (operation.mensualite.prochaineEcheance == null ? "#121212" : "#FFFFFF") }}>
                            {operation.mensualite.prochaineEcheance == null ? "jj/mm/aaaa" : getProchaineEcheance(operation.autresInfos.dateOperation, operation.mensualite.prochaineEcheance)}
                        </Typography>
                    </Grid>


                    <Grid size={{ md: 4.5, xl: 5 }} paddingTop={3} paddingBottom={1}>
                        {(operation.libelle != null && operationIsIntercompteFromLibelle(operation.libelle)) ?
                            <Typography variant={"caption"} sx={{ color: "#808080" }}>Compte de transfert</Typography> : <></>
                        }
                    </Grid>
                    <Grid size={{ md: 4.5, xl: 4 }} paddingTop={3} paddingBottom={1}>

                        <Typography variant={"caption"} sx={{ color: "#808080" }}>Dernière échéance</Typography>
                    </Grid>
                    <Grid size={{ md: 3, xl: 3 }} paddingTop={3} paddingBottom={1}>
                        <Typography variant={"caption"} sx={{ color: "#808080" }}>Se termine</Typography>
                    </Grid>


                    <Grid size={{ md: 4.5, xl: 5 }}>
                        { /** COMPTE DE TRANSFERT  **/}
                        {getAffichageIntercompteRO(operation.libelle, comptes.filter((compte: CompteBancaireModel) => currentBudget?.idCompteBancaire !== compte.id), isMobile)}
                    </Grid>
                    <Grid size={{ md: 4.5, xl: 4 }}>
                        { /** DERNIERE ECHEANCE **/}
                        {isDerniereEcheanceRO(operation, budget.id) ?
                            <Stack direction="row" spacing={1} alignItems="center">
                                <OperationStatus statutsOperation={operation.statuts} detailPage={true} />
                                <Typography variant={"overline"} sx={{ color: "#4caf50" }}>Oui</Typography>
                            </Stack>
                            :
                            <Typography variant={"overline"} >Non</Typography>}
                    </Grid>
                    <Grid size={{ md: 3, xl: 3 }}>
                        { /** DATE FIN **/}
                        <OperationDetailDateFin formDateInEdition={editForm.dateFin}
                            errorDateOperation={errors.dateFin}
                            fillOperationForm={fillOperationRecurrenteForm} />
                    </Grid>
                </Grid>

                {currentBudget?.actif && isInEditMode(editForm) &&
                    <Button fullWidth variant="outlined" color="success"
                        onClick={() => handleValidateOperationForm(operation, budget, editOperation, editForm, setErrors, onOperationUpdate)}>Valider</Button>
                }
            </Stack>
        </Container>
    )
}

export default OperationRecurrenteDetailPage
