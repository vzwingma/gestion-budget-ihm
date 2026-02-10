import React, { JSX, useContext, useEffect, useState } from 'react'
import { Box, Button, Container, Grid, Stack, Typography, useMediaQuery, useTheme } from "@mui/material";

import {
    handleDateOperationFromAction,
    handleOperationEditionClick,
    handleValidateOperationForm,
    isInCreateMode,
    isInEditMode
} from './OperationDetailPage.controller.ts';
import { CenterComponent } from '../../../../shared/CenterComponent.tsx';
import {
    createEmptyEditForm,
    createEmptyErrors,
    EditFormProps,
    ErrorsFormProps,
    OPERATION_EDITION_FORM
} from './OperationDetailPage.constants.ts';
import { OperationDetailActions } from './actions/OperationDetailActions.component.tsx';
import BudgetMensuelModel from '../../../../../Models/budgets/BudgetMensuel.model.ts';
import CategorieOperationModel from '../../../../../Models/budgets/CategorieOperation.model.ts';
import CompteBancaireModel from '../../../../../Models/budgets/CompteBancaire.model.ts';
import {
    BUSINESS_GUID,
    OPERATION_ETATS_ENUM,
    PERIODES_MENSUALITE_ENUM,
    TYPES_CATEGORIES_OPERATION_ENUM,
    TYPES_OPERATION_ENUM
} from '../../../../../Utils/AppBusinessEnums.constants.ts';
import { getCategorieColor, getCategorieIcon } from '../../../../../Utils/renderers/CategorieItem.renderer.tsx';
import { getOperationStateColor, } from '../../../../../Utils/renderers/OperationItem.renderer.tsx';
import { OperationDetailValeur } from './subcomponents/OperationDetailValeur.component.tsx';
import { OperationDetailLibelle } from './subcomponents/OperationDetailLibelle.component.tsx';
import { getAffichageIntercompteRO, OperationDetailIntercompte } from './subcomponents/OperationDetailIntercompte.component.tsx';
import { OperationDetailMensualite } from './subcomponents/OperationDetailMensualite.component.tsx';
import { OperationDetailCategories } from './subcomponents/OperationDetailCategories.component.tsx';
import OperationEditionModel, {
    cloneOperation,
    createNewOperationEdition
} from '../../../../../Models/budgets/OperationEdition.model.ts';
import { OperationDetailPageProps } from '../../../../Components.props.ts';
import { BudgetContext } from '../../../../../Models/contextProvider/BudgetContextProvider.tsx';
import { OperationDetailDate } from './subcomponents/OperationDetailDateOperation.component.tsx';
import OperationDetailStatus from '../../../../../Utils/renderers/OperationDetailStatus.renderer.tsx';
import { OperationDetailDateFin } from '../../recurrentes/details/subcomponents/OperationRecurrenteDetailDateFin.component.tsx';
import { OperationDetailCategorieType } from './subcomponents/OperationDetailCategorieType.component.tsx';


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
    const { currentBudget, currentOperation, comptes } = useContext(BudgetContext);
    const operation = currentOperation;
    const budget = currentBudget;

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
                if (value !== null && value !== undefined && value !== "") {
                    editOperation.autresInfos.dateOperation = new Date(Date.parse(value))
                }
                else {
                    editOperation.autresInfos.dateOperation = null
                }
                break;
            case OPERATION_EDITION_FORM.VALUE:
                editOperation.valeur = value;
                break;
            case OPERATION_EDITION_FORM.MENSUALITE:
                editOperation.mensualite.periode = Object.values(PERIODES_MENSUALITE_ENUM).find((periode: PERIODES_MENSUALITE_ENUM) => periode === value);
                break;
            case OPERATION_EDITION_FORM.DATE_FIN:
                if (value !== null && value !== undefined && value !== "") {
                    editOperation.mensualite.dateFin = new Date(Date.parse(value))
                }
                else {
                    editOperation.mensualite.dateFin = null
                }
                break;
            case OPERATION_EDITION_FORM.CATEGORIE:
                if (value !== "") {
                    fillCategorieForm(value);
                }
                break;
            case OPERATION_EDITION_FORM.CATEGORIE_TYPE:
                editOperation.ssCategorie.type = Object.values(TYPES_CATEGORIES_OPERATION_ENUM).find((type: TYPES_CATEGORIES_OPERATION_ENUM) => type === value);
                break;
            case OPERATION_EDITION_FORM.INTERCOMPTES:
                editOperation.intercompte = value
                break;
            case OPERATION_EDITION_FORM.FORM_VALIDATION:
                editForm.formValidationEnabled = (value === "true")
                break;
        }
        openEditForm(editForm);
        setEditOperation({ ...editOperation });
    }

    /**
     * Validation d'une catégorie dans le formulaire
     * @param ssCatId  id de la sous catégorie
     */
    function fillCategorieForm(ssCatId: string) {
        const ssCat = listeCategories
            .flatMap((cat: CategorieOperationModel) => cat.listeSSCategories ?? [])
            .find((ssCat: CategorieOperationModel) => ssCat?.id === ssCatId)
        if (ssCat === undefined) {
            return;
        }
        if (ssCat.categorieParente !== null && ssCat.categorieParente !== undefined) {
            editOperation.categorie.id = ssCat.categorieParente.id;
            editOperation.categorie.libelle = ssCat.categorieParente.libelle;
        }
        editOperation.ssCategorie.id = ssCat.id;
        editOperation.ssCategorie.libelle = ssCat.libelle;
        editOperation.ssCategorie.type = ssCat.type;

        /** Adaptation sur la sélection de catégorie **/
        if (ssCat.categorieParente) {
            operation.categorie.id = ssCat.categorieParente.id;
            operation.categorie.libelle = ssCat.categorieParente.libelle;
        }
        operation.ssCategorie.id = ssCat.id;
        operation.ssCategorie.libelle = ssCat.libelle;
        operation.ssCategorie.type = ssCat.type;

        /** Si type Rentrée d'argent, alors type opération = Crédit **/
        if(BUSINESS_GUID.CAT_RENTREE_ARGENT === ssCat.categorieParente.id) {
            editOperation.typeOperation = TYPES_OPERATION_ENUM.CREDIT;
            editOperation.ssCategorie.type = TYPES_CATEGORIES_OPERATION_ENUM.REVENUS;            
            operation.typeOperation = TYPES_OPERATION_ENUM.CREDIT;
            operation.ssCategorie.type = TYPES_CATEGORIES_OPERATION_ENUM.REVENUS;
            console.log("Changement type opération en fonction de la catégorie sélectionnée :", operation.typeOperation);
        }
    }

    /**
     * RENDER
     * @returns {JSX.Element}
     */
    return (
        <Container id={OPERATION_EDITION_FORM.FORM}
            component="div" fixed
            onClick={(event: any) => handleOperationEditionClick(event, { operation, budget }, editOperation, editForm, openEditForm, setErrors, onOperationUpdate)}
            onKeyUp={(event: any) => handleOperationEditionClick(event, { operation, budget }, editOperation, editForm, openEditForm, setErrors, onOperationUpdate)}>

            <Stack direction={"column"} sx={{ justifyContent: isMobile ? "none" : "center", paddingTop: isMobile ? "15px" : "10vh" }}>
                <Stack direction={"column"} spacing={isMobile ? 1 : 4} className="budget-page-container"
                    sx={{ alignItems: "center", justifyContent: "center", padding: isMobile ? "15px" : "30px", backgroundColor: "var(--color-dark-container)" }}>
                    <Grid container width={"90%"}>
                        <Grid size={{ md: 4, xl: 4 }} />
                        <Grid size={{ md: 4, xl: 4 }}>
                            <CenterComponent>
                                <Box width={56} height={56}
                                    sx={{
                                        borderRadius: "50%",
                                        backgroundColor: getCategorieColor(operation.categorie.id),
                                        color: 'var(--color-white)',
                                        padding: '15px 0px 0px 15px'
                                    }}>
                                    {getCategorieIcon(operation.ssCategorie)}
                                </Box>
                            </CenterComponent>
                        </Grid>
                        <Grid size={{ md: 4, xl: 4 }} sx={{ display: "flex", justifyContent: "flex-end" }}>
                            { /** STATUT **/}
                            {currentOperation?.statuts !== null && currentOperation?.statuts !== undefined ?
                                <OperationDetailStatus statutsOperation={operation.statuts} /> : <></>
                            }
                        </Grid>
                    </Grid>
                    <Grid container width={"90%"} sx={{ alignItems: "center", justifyContent: "center" }}>
                        { /** VALEUR **/}
                        <OperationDetailValeur formValueInEdition={editForm.value}
                            errorValeur={errors.valeur}
                            fillOperationForm={fillOperationForm} />
                    </Grid>
                    <Grid container width={"90%"} sx={{ alignItems: "center", justifyContent: "center" }}>

                        { /** LIBELLE **/}
                        <OperationDetailLibelle
                            listeLibellesOperations={listeLibellesOperations}
                            formLibelleInEdition={editForm.libelle}
                            errorLibelle={errors.libelle}
                            fillOperationForm={fillOperationForm} />
                    </Grid>

                    {/** 
                     * CATEGORIES 
                     **/}

                    <Grid container width={"90%"} columnSpacing={2} rowSpacing={isMobile ? 1 : 2} sx={{ borderTop: isInCreateMode(editForm) ? 'none' : '1px solid var(--color-operations-primary)', paddingTop: 2 }}>
                        <Grid size={{ md: 8, xl: 8 }}>
                            <Typography variant={"caption"} sx={{ color: "var(--color-heading-text)" }}>Catégorie</Typography>
                            {isInCreateMode(editForm) && editOperation !== null && (BUSINESS_GUID.SS_CAT_VIREMENT_INTERNE === editOperation.ssCategorie.id) ?
                                <Typography variant={"caption"} sx={{ color: "var(--color-heading-text)" }}>Compte de transfert</Typography> : <></>}

                        </Grid>
                        <Grid size={{ md: 4, xl: 4 }}>
                            <Typography variant={"caption"} sx={{ color: "var(--color-heading-text)" }}>Type Catégorie</Typography>
                        </Grid>

                        <Grid size={{ md: 8, xl: 8 }}>
                            {  /** CATEGORIES **/}
                            <OperationDetailCategories
                                listeCategories={listeCategories}
                                formCatgoriesInEdition={editForm.categories}
                                errorsCategories={errors.categorie}
                                fillOperationForm={fillOperationForm} />
                            { /** COMPTE DE TRANSFERT  **/}
                            {isInCreateMode(editForm) && (BUSINESS_GUID.SS_CAT_VIREMENT_INTERNE === editOperation.ssCategorie.id) ?
                                <OperationDetailIntercompte intercompte={editOperation.intercompte}
                                    listeAutresComptes={
                                        comptes.filter((compte: CompteBancaireModel) => currentBudget?.idCompteBancaire !== compte.id)}
                                    errorIntercompte={errors.intercompte}
                                    fillOperationForm={fillOperationForm} />
                                : getAffichageIntercompteRO(editOperation.libelle, comptes.filter((compte: CompteBancaireModel) => currentBudget?.idCompteBancaire !== compte.id), isMobile)}

                        </Grid>
                        <Grid size={{ md: 4, xl: 4 }} >
                            { /** Détail catégorie **/}
                            <OperationDetailCategorieType
                                formCategorieTypeInEdition={editForm.categorieType}
                                editOperation={editOperation}
                                fillOperationForm={fillOperationForm} />
                        </Grid>

                        {/** 
                         * MENSUALITES
                         **/}

                        <Grid size={{ md: 8, xl: 8 }}>
                            <Typography variant={"caption"} sx={{ color: "var(--color-heading-text)" }}>Période</Typography>
                        </Grid>
                        <Grid size={{ md: 4, xl: 4 }}>
                            {(operation.mensualite.periode !== undefined && operation.mensualite.periode !== PERIODES_MENSUALITE_ENUM.PONCTUELLE) &&
                                <Typography variant={"caption"} sx={{ color: "var(--color-heading-text)" }}>Date de fin</Typography>
                            }
                        </Grid>
                        <Grid size={{ md: 8, xl: 8 }}>
                            { /** Période **/}
                            <OperationDetailMensualite
                                formMensualiteInEdition={editForm.mensualite}
                                fillOperationForm={fillOperationForm} />
                        </Grid>
                        <Grid size={{ md: 4, xl: 4 }}>
                            { /** DATE FIN **/}
                            {(operation.mensualite.periode !== undefined && operation.mensualite.periode !== PERIODES_MENSUALITE_ENUM.PONCTUELLE) &&
                                <OperationDetailDateFin formDateInEdition={editForm.dateFin}
                                    errorDateOperation={errors.dateFin}
                                    fillOperationForm={fillOperationForm} />}
                        </Grid>


                        {/** 
                         * ETATS et Actions 
                         **/}
                        <Grid size={{ md: 8, xl: 8 }}>
                            <Typography variant={"caption"} sx={{ color: "var(--color-heading-text)" }}>Etat</Typography>
                        </Grid>
                        <Grid size={{ md: 4, xl: 4 }}>
                            <Typography variant={"caption"} sx={{ color: "var(--color-heading-text)" }}>Date d'opération</Typography>
                        </Grid>


                        <Grid size={{ md: 8, xl: 8 }}>
                            <Typography variant={"overline"} color={getOperationStateColor(operation.etat)} style={{ border: '1px solid ' + getOperationStateColor(operation.etat), padding: '8px', paddingRight: '10px', borderRadius: '4px' }}>
                                {operation.etat}
                            </Typography>
                        </Grid>

                        <Grid size={{ md: 4, xl: 4 }}>
                            { /** DATE OPERATION **/}
                            <OperationDetailDate
                                formDateInEdition={editForm.dateOperation}
                                errorDateOperation={errors.dateOperation}
                                fillOperationForm={fillOperationForm} />
                        </Grid>

                    </Grid>

                    <Grid container width={"90%"} sx={{ alignItems: "center", justifyContent: "center" }}>
                        {currentBudget?.actif &&
                            <>
                                <Grid size={{ md: 2, xl: 2 }}>
                                    <Typography variant={"caption"} sx={{ color: "var(--color-heading-text)" }}>Actions</Typography>
                                </Grid>
                                <Grid size={{ md: 8, xl: 8 }} paddingBottom={2}>
                                    <Stack direction={"column"} sx={{ alignItems: "center", justifyContent: "center", width: "100%" }}>
                                        { /** ACTIONS **/}
                                        {currentOperation?.etat === OPERATION_ETATS_ENUM.SUPPRIMEE ?
                                            <></>
                                            : <OperationDetailActions
                                                isInCreateMode={isInCreateMode(editForm)}
                                                editOperation={editOperation}
                                                onClickRealiseInCreateMode={() => handleDateOperationFromAction(editOperation, setEditOperation)}
                                                onOperationChange={onOperationChange}
                                            />
                                        }
                                    </Stack>
                                </Grid>
                                <Grid size={{ md: 2, xl: 2 }}></Grid>
                            </>

                        }
                        {currentBudget?.actif && isInEditMode(editForm) &&
                            <Button fullWidth variant="outlined" color="success"
                                onClick={() => handleValidateOperationForm(operation, budget, editOperation, editForm, setErrors, onOperationUpdate)}>Valider</Button>
                        }
                    </Grid>
                </Stack>
            </Stack>
        </Container>
    )
}

export default OperationDetailPage
