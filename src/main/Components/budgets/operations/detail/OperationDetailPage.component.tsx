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
import { OPERATION_EDITION_FORM } from './OperationDetailPage.constants';
import { OperationDetailActions } from './actions/OperationDetailActions.component';
import OperationModel, { cloneOperation, createNewOperation } from '../../../../Models/Operation.model';
import BudgetMensuelModel from '../../../../Models/BudgetMensuel.model';
import CategorieOperationModel from '../../../../Models/CategorieOperation.model';
import CompteBancaireModel from '../../../../Models/CompteBancaire.model';
import {
    BUSINESS_GUID,
    OPERATION_ETATS_ENUM
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
 * @interface EditFormProps
 * @description Interface représentant les propriétés du formulaire d'édition.
 *
 * @property {boolean} value - Indique si la valeur est éditée.
 * @property {boolean} libelle - Indique si le libellé est éditée.
 * @property {boolean} dateOperation - Indique si la date de l'opération est éditée.
 * @property {boolean} mensualite - Indique si la mensualité est éditée.
 * @property {boolean} categories - Indique si les catégories sont éditée.
 * @property {boolean} formValidationEnabled - Indique si la validation du formulaire est éditée.
 */
export interface EditFormProps {
    value: boolean
    libelle: boolean
    dateOperation: boolean
    mensualite: boolean
    categories: boolean
    formValidationEnabled: boolean
}


/**
 * Interface représentant les erreurs possibles pour les détails d'une opération.
 *
 * @property {string | null} valeur - Erreur associée à la valeur de l'opération.
 * @property {string | null} libelle - Erreur associée au libellé de l'opération.
 * @property {string | null} categorie - Erreur associée à la catégorie de l'opération.
 * @property {string | null} compte - Erreur associée au compte de l'opération.
 */
export interface ErrorsFormProps {
    valeur: string | null
    dateOperation: string | null
    libelle: string | null
    categorie: string | null
    compte: string | null
    intercompte: string | null
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

    const [editForm, setEditForm] = useState<EditFormProps>({
        value: false,
        libelle: false,
        dateOperation: false,
        mensualite: false,
        categories: false,
        formValidationEnabled: false
    });
    const [refresh, setRefresh] = useState<boolean>(false);
    const [openLibelleAutoComplete, setOpenLibelleAutoComplete] = useState<boolean>(false);
    const [intercompte, setIntercompte] = useState<string | null>(null);
    const [errors, setErrors] = useState<ErrorsFormProps>({
        valeur: null,
        dateOperation: null,
        libelle: null,
        categorie: null,
        compte: null,
        intercompte
    });
    const [editOperation, setEditOperation] = useState<OperationModel>(createNewOperation());




    /**
     * Init de l'opération du formulaire à la sélection d'une nouvelle opération
     */
    useEffect(() => {
        console.log("Initialisation de l'opération d'édition", operation.id)
        setEditOperation(cloneOperation(operation));
        /*
        const operationInCreation = operation.id === "-1";
        setEditForm({
            value: operationInCreation,
            libelle: operationInCreation,
            dateOperation: operationInCreation,
            mensualite: operationInCreation,
            categories: operationInCreation,
            formValidationEnabled: false
        }); */

    }, [operation]);


    function openEditForm(editForm: EditFormProps) {
        console.log("OpenEditForm", editForm)
        setEditForm(editForm)
        setRefresh(!refresh)
    }



    function fillOperationForm(field: OPERATION_EDITION_FORM, value: string) {
        let editedOperation = editOperation != null ? editOperation : createNewOperation();

        switch (field) {
            case OPERATION_EDITION_FORM.LIBELLE:
                editedOperation.libelle = value
                break;
            case OPERATION_EDITION_FORM.DATE_OPERATION:
                editOperation.autresInfos.dateOperation = new Date(Date.parse(value))
                break;
            case OPERATION_EDITION_FORM.VALUE:
                editOperation.valeur = parseFloat(value);
                break;
            case OPERATION_EDITION_FORM.MENSUALITE:
                editedOperation.mensualite.periode = value
                break;
            case OPERATION_EDITION_FORM.CATEGORIE:
                //   fillCategorieForm(value)
                break;
            case OPERATION_EDITION_FORM.INTERCOMPTES:
                editOperation.intercompte = value
                break;
            case OPERATION_EDITION_FORM.FORM_VALIDATION:
                editForm.formValidationEnabled = (value === "true")
                break;
        }
        setEditOperation(editedOperation);
    }

    /**
     * RENDER
     * @returns {JSX.Element}
     */
    return (
        <Container id={OPERATION_EDITION_FORM.FORM}
            component="div"
            fixed maxWidth={"md"}
            onClick={(event) => handleOperationEditionClick(event, operation, budget, editOperation, editForm, openEditForm, errors, setErrors, onOperationChange)}
            onKeyUp={(event) => handleOperationEditionClick(event, operation, budget, editOperation, editForm, openEditForm, errors, setErrors, onOperationChange)}>

            <Stack direction={"column"} spacing={5} sx={{ alignItems: "center", marginTop: "20px" }}>
                <Box width={56} height={56}
                    sx={{
                        borderRadius: "50%",
                        backgroundColor: getCategorieColor(operation.categorie),
                        color: '#FFFFFF',
                        padding: '16px 8px 0px 8px'
                    }}>
                    <CenterComponent>{getCategorieIcon(operation.ssCategorie)}</CenterComponent>
                </Box>
                <Stack direction={"row"} spacing={2} sx={{ alignItems: "center" }}>
                    {JSON.stringify(editForm)}
                </Stack>
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
                        <OperationDetailIntercompte intercompte={intercompte}
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
                        onClick={() => handleValidateOperationForm(operation, budget, editOperation, editForm, setEditForm, errors, setErrors, onOperationChange)}>Valider</Button>
                }

            </Stack>
        </Container>
    )
}

export default OperationDetailPage