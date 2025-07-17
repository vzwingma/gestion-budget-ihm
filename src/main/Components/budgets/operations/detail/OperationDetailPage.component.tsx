import React, {JSX, useContext, useEffect, useState} from 'react'
import {Box, Button, Container, Grid, Stack, Typography, useMediaQuery, useTheme} from "@mui/material";

import {
    handleDateOperationFromAction,
    handleOperationEditionClick,
    handleValidateOperationForm,
    isInCreateMode,
    isInEditMode
} from './OperationDetailPage.controller';
import CenterComponent from '../../../CenterComponent';
import {
    createEmptyEditForm,
    createEmptyErrors,
    EditFormProps,
    ErrorsFormProps,
    OPERATION_EDITION_FORM
} from './OperationDetailPage.constants';
import {OperationDetailActions} from './actions/OperationDetailActions.component';
import BudgetMensuelModel from '../../../../Models/budgets/BudgetMensuel.model';
import CategorieOperationModel from '../../../../Models/budgets/CategorieOperation.model';
import CompteBancaireModel from '../../../../Models/budgets/CompteBancaire.model';
import {
    BUSINESS_GUID,
    OPERATION_ETATS_ENUM,
    PERIODES_MENSUALITE_ENUM,
    TYPES_OPERATION_ENUM
} from '../../../../Utils/AppBusinessEnums.constants';
import {getCategorieColor, getCategorieIcon} from '../../../../Utils/renderers/CategorieItem.renderer';
import {getOperationStateColor,} from '../../../../Utils/renderers/OperationItem.renderer';
import {OperationDetailValeur} from './subcomponents/OperationDetailValeur.component';
import {OperationDetailLibelle} from './subcomponents/OperationDetailLibelle.component';
import {OperationDetailDate} from './subcomponents/OperationDetailDate.component';
import {OperationDetailIntercompte} from './subcomponents/OperationDetailIntercompte.component';
import {OperationDetailMensualite} from './subcomponents/OperationDetailMensualite.component';
import {OperationDetailCategories} from './subcomponents/OperationDetailCategories.component';
import OperationEditionModel, {
    cloneOperation,
    createNewOperationEdition
} from '../../../../Models/budgets/OperationEdition.model';
import {OperationDetailPageProps} from '../../../Components.props';
import {BudgetContext} from '../../../../Models/contextProvider/BudgetContextProvider';


/**
 * Composant de page de détail d'une opération.
 *
 * Ce composant affiche les détails d'une opération et permet de modifier ses informations.
 * Il gère également les états du formulaire d'édition et les interactions utilisateur.
 * @returns {JSX.Element} - Le composant de page de détail d'une opération.
 */
export const OperationDetailPage: React.FC<OperationDetailPageProps> = ({
    listeCategories,
    listeLibellesOperations,
    onOperationChange
}: OperationDetailPageProps): JSX.Element => {

    const [editForm, setEditForm] = useState<EditFormProps>(createEmptyEditForm(false));
    const [refresh, setRefresh] = useState<Date>(new Date());
    const [errors, setErrors] = useState<ErrorsFormProps>(createEmptyErrors());
    const [editOperation, setEditOperation] = useState<OperationEditionModel>(createNewOperationEdition());
    const { currentBudget, currentOperation, comptes } = useContext(BudgetContext)!;
    const operation = currentOperation!;
    const budget = currentBudget!;

    const isMobile = useMediaQuery(useTheme().breakpoints.down('lg'));
    /**
     * Init de l'opération du formulaire à la sélection d'une nouvelle opération
     */
    useEffect(() => {
        setEditOperation(cloneOperation(operation));
        setEditForm(createEmptyEditForm(operation.id === "-1"));
        setErrors(createEmptyErrors());
    }, [operation]);


    useEffect(() => { }, [refresh]);

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
        openEditForm(createEmptyEditForm(false));
        onOperationChange(budget);
    }

    /**
     * Mise à jour du formulaire d'édition
     * @param field champ du formulaire à mettre à jour
     * @param value valeur du champ
     */
    function fillOperationForm(field: OPERATION_EDITION_FORM, value: string) {
        switch (field) {
            case OPERATION_EDITION_FORM.LIBELLE:
                editOperation.libelle = value;
                break;
            case OPERATION_EDITION_FORM.DATE_OPERATION:
                if(value !== null && value !== undefined && value !== "") {
                    editOperation.autresInfos.dateOperation = new Date(Date.parse(value))
                }
                else{
                    editOperation.autresInfos.dateOperation = null
                }
                break;
            case OPERATION_EDITION_FORM.VALUE:
                editOperation.valeur = value;
                break;
            case OPERATION_EDITION_FORM.MENSUALITE:
                editOperation.mensualite.periode = Object.values(PERIODES_MENSUALITE_ENUM).filter((periode: PERIODES_MENSUALITE_ENUM) => periode === value)[0];
                break;
            case OPERATION_EDITION_FORM.CATEGORIE:
                if(value !== "") {
                    fillCategorieForm(value);
                }
                break;
            case OPERATION_EDITION_FORM.INTERCOMPTES:
                editOperation.intercompte = value
                break;
            case OPERATION_EDITION_FORM.FORM_VALIDATION:
                editForm.formValidationEnabled = (value === "true")
                break;
        }
        openEditForm(editForm);
        setEditOperation(editOperation);
    }

    /**
     * Validation d'une catégorie dans le formulaire
     * @param ssCatId  id de la sous catégorie
     */
    function fillCategorieForm(ssCatId: string) {
        const ssCat = listeCategories
            .flatMap((cat: CategorieOperationModel) => cat.listeSSCategories ?? [])
            .filter((ssCat: CategorieOperationModel) => ssCat != null && ssCat.id === ssCatId)[0]
        if (ssCat === undefined) {
            return;
        }
        if (ssCat.categorieParente !== null && ssCat.categorieParente !== undefined) {
            editOperation.categorie.id = ssCat.categorieParente.id;
            editOperation.categorie.libelle = ssCat.categorieParente.libelle;
        }
        editOperation.ssCategorie.id = ssCat.id;
        editOperation.ssCategorie.libelle = ssCat.libelle;

        /** Si type Rentrée d'argent, alors type opération = Crédit **/
        const editOperationTypeOperation = (BUSINESS_GUID.CAT_RENTREE_ARGENT === editOperation.categorie.id)  ? TYPES_OPERATION_ENUM.CREDIT : TYPES_OPERATION_ENUM.DEPENSE;
        editOperation.typeOperation = editOperationTypeOperation;
        setEditOperation(editOperation);

        /** Adaptation sur la sélection de catégorie **/
        if (ssCat.categorieParente) {
            operation.categorie.id = ssCat.categorieParente.id;
            operation.categorie.libelle = ssCat.categorieParente.libelle;
        }

        operation.ssCategorie.id = ssCat.id;
        operation.ssCategorie.libelle = ssCat.libelle;
        operation.typeOperation = editOperationTypeOperation;
    }

    /**
     * RENDER
     * @returns {JSX.Element}
     */
    return (
        <Container id={OPERATION_EDITION_FORM.FORM}
                   component="div" fixed
            onClick={(event : any) => handleOperationEditionClick(event, {operation, budget}, editOperation, editForm, openEditForm, setErrors, onOperationUpdate)}
            onKeyUp={(event : any) => handleOperationEditionClick(event, {operation, budget}, editOperation, editForm, openEditForm, setErrors, onOperationUpdate)}>

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
                <OperationDetailValeur formValueInEdition={editForm.value}
                                       errorValeur={errors.valeur}
                                       fillOperationForm={fillOperationForm}/>

                { /** LIBELLE **/}
                <OperationDetailLibelle
                    listeLibellesOperations={listeLibellesOperations}
                    formLibelleInEdition={editForm.libelle}
                    errorLibelle={errors.libelle}
                    fillOperationForm={fillOperationForm} />

                <Grid container width={"100%"}>
                    <Grid size={{md: 4.5, xl: 5}} paddingTop={3} paddingBottom={1}>
                        <Typography variant={"caption"} sx={{ color: "#808080" }}>Catégorie</Typography>
                    </Grid>
                    <Grid size={{md: 4.5, xl: 4}} paddingTop={3} paddingBottom={1}>
                        <Typography variant={"caption"} sx={{ color: "#808080" }}>Etat</Typography>
                    </Grid>
                    <Grid size={{md: 3, xl: 3}} paddingTop={3} paddingBottom={1}>
                        <Typography variant={"caption"} sx={{ color: "#808080" }}>Période</Typography>
                    </Grid>


                    <Grid size={{md: 4.5, xl: 5}}>
                        {  /** CATEGORIES **/}
                        <OperationDetailCategories
                            listeCategories={listeCategories}
                            formCatgoriesInEdition={editForm.categories}
                            errorsCategories={errors.categorie}
                            fillOperationForm={fillOperationForm} />
                    </Grid>
                    <Grid size={{md: 4.5, xl: 4}}>
                        <Typography variant={"overline"} color={getOperationStateColor(operation.etat)}>
                            {operation.etat}
                        </Typography>
                    </Grid>
                    <Grid size={{md: 3, xl: 3}}>
                        { /** PERIODE **/}
                        <OperationDetailMensualite
                            formMensualiteInEdition={editForm.mensualite}
                            fillOperationForm={fillOperationForm} />
                    </Grid>


                    <Grid size={{md: 4.5, xl: 5}} paddingTop={3} paddingBottom={1}>
                        {isInCreateMode(editForm) && editOperation !== null && (BUSINESS_GUID.SS_CAT_VIREMENT_INTERNE === editOperation.ssCategorie.id) ?
                            <Typography variant={"caption"} sx={{ color: "#808080" }}>Compte de transfert</Typography> : <></>}
                    </Grid>
                    <Grid size={{md: 4.5, xl: 4}} paddingTop={3} paddingBottom={1}>
                        {currentBudget?.actif && currentOperation?.etat !== OPERATION_ETATS_ENUM.SUPPRIMEE ?
                            <Typography variant={"caption"} sx={{ color: "#808080" }}>Actions</Typography> : <></>
                        }
                    </Grid>
                    <Grid size={{md: 3, xl: 3}} paddingTop={3} paddingBottom={1}>
                        <Typography variant={"caption"} sx={{ color: "#808080" }}>Date d'opération</Typography>
                    </Grid>


                    <Grid size={{md: 4.5, xl: 5}}>
                        { /** COMPTE DE TRANSFERT  **/}
                        <OperationDetailIntercompte intercompte={editOperation.intercompte}
                                                    libelle={editOperation.libelle}
                            formIntercompteInEdition={
                                isInCreateMode(editForm)
                                && (BUSINESS_GUID.SS_CAT_VIREMENT_INTERNE === editOperation.ssCategorie.id)
                            }
                            listeAutresComptes={
                                comptes.filter((compte: CompteBancaireModel) => currentBudget?.idCompteBancaire !== compte.id)}
                            errorIntercompte={errors.intercompte}
                            fillOperationForm={fillOperationForm} />
                    </Grid>
                    <Grid size={{md: 4.5, xl: 4}}>
                        { /** ACTIONS SUR OPERATION **/}
                        {currentBudget?.actif && currentOperation?.etat !== OPERATION_ETATS_ENUM.SUPPRIMEE ?
                            <OperationDetailActions
                                isInCreateMode={isInCreateMode(editForm)}
                                editOperation={editOperation}
                                onClickRealiseInCreateMode={() => handleDateOperationFromAction(editOperation, setEditOperation)}
                                onOperationChange={onOperationChange}
                            />
                            : <></>
                        }
                    </Grid>
                    <Grid size={{md: 3, xl: 3}}>
                        { /** DATE OPERATION **/}
                        <OperationDetailDate
                            formDateInEdition={editForm.dateOperation}
                            errorDateOperation={errors.dateOperation}
                            fillOperationForm={fillOperationForm} />
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

export default OperationDetailPage
