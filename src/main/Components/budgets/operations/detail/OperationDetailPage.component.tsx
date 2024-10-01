import React, { useEffect, useState } from 'react'
import {
    Box,
    Button,
    Container,
    Grid2,
    Stack,
    Typography
} from "@mui/material";

import {
    handleDateOperationFromAction,
    handleOperationEditionClick,
    handleValidateOperationForm,
    isInCreateMode,
    isInEditMode
} from './OperationDetailPage.controller';
import CenterComponent from '../../../CenterComponent';
import { createEmptyEditForm, createEmptyErrors, EditFormProps, ErrorsFormProps, OPERATION_EDITION_FORM } from './OperationDetailPage.constants';
import { OperationDetailActions } from './actions/OperationDetailActions.component';
import OperationModel from '../../../../Models/Operation.model';
import BudgetMensuelModel from '../../../../Models/BudgetMensuel.model';
import CategorieOperationModel from '../../../../Models/CategorieOperation.model';
import CompteBancaireModel from '../../../../Models/CompteBancaire.model';
import {
    BUSINESS_GUID,
    OPERATION_ETATS_ENUM,
    PERIODES_MENSUALITE_ENUM,
    TYPES_OPERATION_ENUM
} from '../../../../Utils/AppBusinessEnums.constants';
import { getCategorieColor, getCategorieIcon } from '../../../../Utils/renderers/CategorieItem.renderer';
import {
    getOperationStateColor,
} from '../../../../Utils/renderers/OperationItem.renderer';
import { OperationDetailValeur } from './subcomponents/OperationDetailValeur.component';
import { OperationDetailLibelle } from './subcomponents/OperationDetailLibelle.component';
import { OperationDetailDate } from './subcomponents/OperationDetailDate.component';
import { OperationDetailIntercompte } from './subcomponents/OperationDetailIntercompte.component';
import { OperationDetailMensualite } from './subcomponents/OperationDetailMensualite.component';
import { OperationDetailCategories } from './subcomponents/OperationDetailCategories.component';
import OperationEditionModel, { cloneOperation, createNewOperationEdition } from '../../../../Models/OperationEdition.model';


/**
 * Propriétés pour le composant OperationDetailPage.
 *
 * @typedef {Object} OperationDetailPageProps
 * @property {OperationModel} operation - Le modèle de l'opération en cours de détail.
 * @property {BudgetMensuelModel} budget - Le modèle du budget mensuel associé.
 * @property {CategorieOperationModel[]} listeCategories - La liste des catégories d'opérations disponibles.
 * @property {CompteBancaireModel[]} listeComptes - La liste des comptes bancaires disponibles.
 * @property {(budget: BudgetMensuelModel, operationsGroupedByDateOperation: { [key: string]: OperationModel[] }) => void} onOperationChange - Fonction appelée lors du changement d'une opération, prenant en paramètres le budget mis à jour et les opérations groupées par date.
 */
export interface OperationDetailPageProps {
    operation: OperationModel
    budget: BudgetMensuelModel
    listeCategories: CategorieOperationModel[]
    listeComptes: CompteBancaireModel[]
    listeLibellesOperations: string[]
    onOperationChange: (budget: BudgetMensuelModel) => void
}


/**
 * Composant de page de détail d'une opération.
 *
 * Ce composant affiche les détails d'une opération et permet de modifier ses informations.
 * Il gère également les états du formulaire d'édition et les interactions utilisateur.
 *
 * @param {OperationDetailPageProps} props - Les propriétés du composant.
 * @returns {JSX.Element} - Le composant de page de détail d'une opération.
 */
export const OperationDetailPage: React.FC<OperationDetailPageProps> = ({ operation,
    budget,
    listeCategories,
    listeComptes,
    listeLibellesOperations,
    onOperationChange
}: OperationDetailPageProps): JSX.Element => {

    const [editForm, setEditForm] = useState<EditFormProps>(createEmptyEditForm(false));
    const [refresh, setRefresh] = useState<boolean>(false);
    const [errors, setErrors] = useState<ErrorsFormProps>(createEmptyErrors());
    const [editOperation, setEditOperation] = useState<OperationEditionModel>(createNewOperationEdition());




    /**
     * Init de l'opération du formulaire à la sélection d'une nouvelle opération
     */
    useEffect(() => {
        setEditOperation(cloneOperation(operation));
        setEditForm(createEmptyEditForm(operation.id === "-1"));
        setErrors(createEmptyErrors());
    }, [operation]);


    /**
     * Ouverture du formulaire d'édition
     * @param editForm formulaire d'édition
     */
    function openEditForm(editForm: EditFormProps) {
        setEditForm(editForm)
        setRefresh(!refresh)
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
                editOperation.autresInfos.dateOperation = new Date(Date.parse(value))
                break;
            case OPERATION_EDITION_FORM.VALUE:
                editOperation.valeur = value;
                break;
            case OPERATION_EDITION_FORM.MENSUALITE:
                editOperation.mensualite.periode = Object.values(PERIODES_MENSUALITE_ENUM).filter((periode: PERIODES_MENSUALITE_ENUM) => periode === value)[0];
                break;
            case OPERATION_EDITION_FORM.CATEGORIE:
                fillCategorieForm(value)
                break;
            case OPERATION_EDITION_FORM.INTERCOMPTES:
                editOperation.intercompte = value
                break;
            case OPERATION_EDITION_FORM.FORM_VALIDATION:
                editForm.formValidationEnabled = (value === "true")
                break;
        }
        setEditOperation(editOperation);
        setRefresh(!refresh);
    }

    /**
     * Validation d'une catégorie dans le formulaire
     * @param ssCatId  id de la sous catégorie
     */
    function fillCategorieForm(ssCatId: string) {
        const ssCat = listeCategories
            .flatMap((cat: CategorieOperationModel) => cat.listeSSCategories !== null && cat.listeSSCategories != undefined ? cat.listeSSCategories : [])
            .filter((ssCat: CategorieOperationModel) => ssCat != null && ssCat.id === ssCatId)[0]

            if (ssCat.categorieParente) {
                editOperation.categorie.id = ssCat.categorieParente.id;
                editOperation.categorie.libelle = ssCat.categorieParente.libelle;
            }
            editOperation.ssCategorie.id = ssCat.id
            editOperation.ssCategorie.libelle = ssCat.libelle
            setEditOperation(editOperation);

            /** Si type Virement **/
            editOperation.typeOperation = (BUSINESS_GUID.CAT_VIREMENT === editOperation.categorie.id && BUSINESS_GUID.SOUS_CAT_INTER_COMPTES !== editOperation.ssCategorie.id) ? TYPES_OPERATION_ENUM.CREDIT : TYPES_OPERATION_ENUM.DEPENSE;

            /** Adaptation sur la sélection de catégorie **/
            if (ssCat.categorieParente) {
                operation.categorie.id = ssCat.categorieParente.id
                operation.categorie.libelle = ssCat.categorieParente.libelle
            }

            operation.ssCategorie.id = ssCat.id
            operation.ssCategorie.libelle = ssCat.libelle
            operation.typeOperation = editOperation.typeOperation 
        }

    /**
     * RENDER
     * @returns {JSX.Element}
     */
    return (
        <Container id={OPERATION_EDITION_FORM.FORM}
            component="div"
            fixed maxWidth={"md"}
            onClick={(event) => handleOperationEditionClick(event, operation, budget, editOperation, editForm, openEditForm, setErrors, onOperationUpdate)}
            onKeyUp={(event) => handleOperationEditionClick(event, operation, budget, editOperation, editForm, openEditForm, setErrors, onOperationUpdate)}>

            <Stack direction={"column"} spacing={5} sx={{ alignItems: "center", marginTop: "20px" }}>
                <CenterComponent>
                    <Box width={56} height={56}
                        sx={{
                            borderRadius: "50%",
                            backgroundColor: getCategorieColor(operation.categorie),
                            color: '#FFFFFF',
                            padding: '15px 0px 0px 15px'
                        }}>
                        {getCategorieIcon(operation.ssCategorie)}
                    </Box>
                </CenterComponent>
                { /** VALEUR **/}
                <OperationDetailValeur operation={operation} formValueInEdition={editForm.value}
                    errorValeur={errors.valeur} budgetActif={budget?.actif}
                    fillOperationForm={fillOperationForm} />

                { /** LIBELLE **/}
                <OperationDetailLibelle operation={operation} budgetActif={budget?.actif} listeComptes={listeComptes}
                    listeLibellesOperations={listeLibellesOperations}
                    formLibelleInEdition={editForm.libelle}
                    errorLibelle={errors.libelle}
                    fillOperationForm={fillOperationForm} />

                <Grid2 container width={"100%"}>
                    <Grid2 size={{ md: 5 }}>
                        <Typography variant={"caption"} sx={{ color: "#808080" }}>Catégorie</Typography>
                    </Grid2>
                    <Grid2 size={{ md: 4 }}>
                        <Typography variant={"caption"} sx={{ color: "#808080" }}>Etat</Typography>
                    </Grid2>
                    <Grid2 size={{ md: 3 }}>
                        <Typography variant={"caption"} sx={{ color: "#808080" }}>Période</Typography>
                    </Grid2>


                    <Grid2 size={{ md: 5 }}>
                        {  /** CATEGORIES **/}
                        <OperationDetailCategories operation={operation}
                            listeCategories={listeCategories}
                            formCatgoriesInEdition={editForm.categories}
                            errorsCategories={errors.categorie}
                            fillOperationForm={fillOperationForm} />
                    </Grid2>
                    <Grid2 size={{ md: 4 }}>
                        <Typography variant={"overline"} color={getOperationStateColor(operation.etat)}>
                            {operation.etat}
                        </Typography>
                    </Grid2>
                    <Grid2 size={{ md: 3 }}>
                        { /** PERIODE **/}
                        <OperationDetailMensualite operation={operation} budgetActif={budget?.actif}
                            formMensualiteInEdition={editForm.mensualite}
                            fillOperationForm={fillOperationForm} />
                    </Grid2>


                    <Grid2 size={{ md: 5 }} paddingTop={3}>
                        {isInCreateMode(editForm) && editOperation !== null && (BUSINESS_GUID.SOUS_CAT_INTER_COMPTES === editOperation.ssCategorie.id) ?
                            <Typography variant={"caption"} sx={{ color: "#808080" }}>Compte de transfert</Typography> : <></>}
                    </Grid2>
                    <Grid2 size={{ md: 4 }} paddingTop={3}>
                        {budget?.actif && operation.etat !== OPERATION_ETATS_ENUM.SUPPRIMEE ?
                            <Typography variant={"caption"} sx={{ color: "#808080" }}>Actions</Typography> : <></>
                        }
                    </Grid2>
                    <Grid2 size={{ md: 3 }} paddingTop={3}>
                        <Typography variant={"caption"} sx={{ color: "#808080" }}>Date d'opération</Typography>
                    </Grid2>


                    <Grid2 size={{ md: 5 }}>
                        { /** COMPTE DE TRANSFERT  **/}
                        <OperationDetailIntercompte intercompte={editOperation.intercompte}
                            formIntercompteInEdition={
                                isInCreateMode(editForm)
                                && editOperation !== null
                                && (BUSINESS_GUID.SOUS_CAT_INTER_COMPTES === editOperation.ssCategorie.id)
                            }
                            listeAutresComptes={
                                listeComptes
                                    .filter((compte: CompteBancaireModel) => budget.idCompteBancaire !== compte.id)}
                            errorIntercompte={errors.intercompte}
                            fillOperationForm={fillOperationForm} />
                    </Grid2>
                    <Grid2 size={{ md: 4 }}>
                        { /** ACTIONS SUR OPERATION **/}
                        {budget?.actif && operation.etat !== OPERATION_ETATS_ENUM.SUPPRIMEE ?
                            <OperationDetailActions operation={operation}
                                budget={budget}
                                isInCreateMode={isInCreateMode(editForm)}
                                onClickRealiseInCreateMode={handleDateOperationFromAction}
                                onOperationChange={onOperationChange} />
                            : <></>
                        }
                    </Grid2>
                    <Grid2 size={{ md: 3 }}>
                        { /** DATE OPERATION **/}
                        <OperationDetailDate operation={operation} budgetActif={budget?.actif}
                            formDateInEdition={editForm.dateOperation}
                            errorDateOperation={errors.dateOperation}
                            fillOperationForm={fillOperationForm} />
                    </Grid2>
                </Grid2>

                {budget?.actif && isInEditMode(editForm) &&
                    <Button fullWidth variant="outlined" color="success"
                        onClick={() => handleValidateOperationForm(operation, budget, editOperation, editForm, setErrors, onOperationUpdate)}>Valider</Button>
                }

            </Stack>
        </Container>
    )
}

export default OperationDetailPage