import React, {useEffect, useState} from 'react'
import {
    Autocomplete,
    Box,
    Button,
    Container,
    FormControl,
    FormHelperText,
    InputAdornment,
    MenuItem,
    Stack,
    TextField,
    Typography
} from "@mui/material";

import BudgetMensuelModel from '@/src/main/Models/BudgetMensuel.model';
import CompteBancaireModel from '@/src/main/Models/CompteBancaire.model';
import CategorieOperationModel from '@/src/main/Models/CategorieOperation.model';
import OperationModel, { cloneOperation, createNewOperation } from '@/src/main/Models/Operation.model';
import Grid2 from '@mui/material/Unstable_Grid2/Grid2';
import {getLibellesOperation} from './OperationDetailPage.extservices';
import {
    getListeAllCategories,
    handleDateOperationFromAction,
    handleOperationEditionClick,
    handleValidateOperationForm,
    isInCreateMode,
    isInEditMode
} from './OperationDetailPage.controller';
import {
    BUSINESS_GUID,
    OPERATION_ETATS_ENUM,
    PERIODES_MENSUALITE_ENUM,
    TYPES_OPERATION_ENUM
} from '@/src/main/Utils/AppBusinessEnums.constants';
import {getCategorieColor, getCategorieIcon} from '@/src/main/Utils/renderers/CategorieItem.renderer';
import CenterComponent from '../../../CenterComponent';
import {EMPTY_CATEGORIE, OPERATION_EDITION_FORM_IDS} from './OperationDetailPage.constants';
import OperationValue from '@/src/main/Utils/renderers/OperationValue.renderer';
import {AddRounded, EuroRounded, RemoveRounded} from '@mui/icons-material';
import {
    getOperationLibelle,
    getOperationStateColor,
    getPeriodeRenderer
} from '@/src/main/Utils/renderers/OperationItem.renderer';
import { OperationDetailActions } from '../actions/OperationDetailActions.component';


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
 * @param {OperationModel} props.operation - L'opération à afficher et à éditer.
 * @param {BudgetModel} props.budget - Le budget associé à l'opération.
 * @param {CategorieOperationModel[]} props.listeCategories - La liste des catégories disponibles.
 * @param {CompteBancaireModel[]} props.listeComptes - La liste des comptes bancaires disponibles.
 * @param {Function} props.onOperationChange - La fonction à appeler lorsque l'opération est modifiée.
 *
 * @returns {JSX.Element} - Le composant de page de détail d'une opération.
 */
export const OperationDetailPage: React.FC<OperationDetailPageProps> = ({
                                                                            operation,
                                                                            budget,
                                                                            listeCategories,
                                                                            listeComptes,
                                                                            onOperationChange
                                                                        }: OperationDetailPageProps): JSX.Element => {

    const [editForm, setEditForm] = useState<EditFormProps>({
        value: operation.id === "-1",
        libelle: operation.id === "-1",
        dateOperation: operation.id === "-1",
        mensualite: operation.id === "-1",
        categories: operation.id === "-1",
        formValidationEnabled: true,
    });
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
    const [listeLibellesOperation, setListeLibellesOperation] = useState<string[]>([]);
    const [editOperation, setEditOperation] = useState<OperationModel>(createNewOperation());


    /**
     * Init de l'opération du formulaire à la sélection d'une nouvelle opération
     */
    useEffect(() => {
        if (listeLibellesOperation == null) {
            getLibellesOperation(budget.idCompteBancaire, setListeLibellesOperation);
        }
        setEditOperation(cloneOperation(operation));
    }, [])


    /**
     * Réinit de l'opération du formulaire à la sélection d'une nouvelle opération
     * componentDidUpdate is a lifecycle method in React that is invoked immediately after updating occurs.
     * This method is not called for the initial render.
     *
     * In this case, it's used to check if the operation's id has changed. If it has, it sets the state of the
     * editOperation to a clone of the current operation. If the operation's id is -1, it's considered to be in
     * creation mode and the editForm state is set to true for all fields and getLibellesOperation method is called.
     * If the operation's id is not -1, it's considered to be in edit mode and handleCloseOperationForm method is called.
     *
     * @param {Object} prevProps - The previous props
     * @param {Object} prevState - The previous state
     * @param {Object} snapshot - The snapshot of the DOM at the time of the update

     componentDidUpdate(prevProps: Readonly<P>, prevState: Readonly<S>, snapshot: SS) {

     if (props.operation.id !== prevProps.operation.id) {
     setState({editOperation: cloneOperation(props.operation)});
     // Mode Création
     if (props.operation.id === -1) {
     setState({
     editForm: {
     libelle: true, value: true, dateOperation: true, mensualite: true, categories: true
     }
     })
     getLibellesOperation(props.budget.idCompteBancaire);

     } else {
     handleCloseOperationForm();
     }
     }
     }
     */


    /**
     * Active ou désactive le formulaire d'édition lors des autocomplétions
     * @param {boolean} activation - Indique si le formulaire doit être activé ou désactivé
     */
    function activateValidationForm(activation: boolean) {
        editForm.formValidationEnabled = activation
        setEditForm(editForm)
    }

    /**
     * Remplit le champ "libelle" de l'état à partir de la saisie de l'utilisateur
     * @param {Event} e - L'événement de saisie
     */
    function fillLibelleForm(e: any) {
        let editedOperation = editOperation != null ? editOperation : createNewOperation();
        editedOperation.libelle = e.target.value
        setEditOperation(editedOperation);
    }

    /**
     * Remplit le champ "dateOperation" de l'état à partir de la saisie de l'utilisateur
     * @param {Event} e - L'événement de saisie
     */
    function fillDateOperationForm(e: any) {
        let value = e.target.value;
        if (value === "") {
            value = null;
        }
        let editedOperation = editOperation != null ? editOperation : createNewOperation();
        editedOperation.autresInfos.dateOperation = value;
        setEditOperation(editedOperation);
    }

    /**
     * Remplit le champ "valeur" de l'état à partir de la saisie de l'utilisateur
     * @param {Event} e - L'événement de saisie
     */
    function fillValeurForm(e: any) {
        let editedOperation = editOperation != null ? editOperation : createNewOperation();
        editedOperation.valeur = e.target.value;  // @TODO : addEndingZeros addEndingZeros(e.target.value)
        setEditOperation(editedOperation);
    }

    /**
     * Remplit le champ "periode" de l'état à partir de la saisie de l'utilisateur
     * @param {Event} e - L'événement de saisie
     */
    function fillPeriodeForm(e: any) {
        let editedOperation = editOperation != null ? editOperation : createNewOperation();
        editedOperation.mensualite.periode = e.target.value
        setEditOperation(editedOperation);
    }

    /**
     * Remplit le champ "intercompte" de l'état à partir de la saisie de l'utilisateur
     * @param {Event} e - L'événement de saisie
     */
    function fillIntercompteForm(e: any) {
        setIntercompte(e.target.value)
    }

    /**
     * Remplit le champ "categorie" de l'état à partir de la saisie de l'utilisateur
     * @param {Event} e - L'événement de saisie
     */
    function fillCategorieForm(e: any) {
        const ssCat = getListeAllCategories(listeCategories)
            .filter((ssCat: CategorieOperationModel) => {
                return ssCat.libelle === e.target.textContent || ssCat.libelle === e.target.value
            })[0]
        if (ssCat !== null && ssCat !== undefined) {
            let editedOperation = editOperation;
            if (editedOperation === null) {
                editedOperation = createNewOperation();
            }
            if (ssCat.categorieParente) {
                editedOperation.categorie.id = ssCat.categorieParente.id;
                editedOperation.categorie.libelle = ssCat.categorieParente.libelle;
            }
            editedOperation.ssCategorie.id = ssCat.id
            editedOperation.ssCategorie.libelle = ssCat.libelle
            setEditOperation(editedOperation);

            /** Si type Virement **/
            editedOperation.typeOperation = (BUSINESS_GUID.CAT_VIREMENT === editedOperation.categorie.id && BUSINESS_GUID.SOUS_CAT_INTER_COMPTES !== editedOperation.ssCategorie.id) ? TYPES_OPERATION_ENUM.CREDIT : TYPES_OPERATION_ENUM.DEPENSE;

            /** Adaptation sur la sélection de catégorie **/
            if (ssCat.categorieParente) {
                operation.categorie.id = ssCat.categorieParente.id
                operation.categorie.libelle = ssCat.categorieParente.libelle
            }

            operation.ssCategorie.id = ssCat.id
            operation.ssCategorie.libelle = ssCat.libelle
            operation.typeOperation = editedOperation.typeOperation
        }
    }

    /**
     * RENDER
     * @returns {JSX.Element}
     */
    return (
        <Container id={OPERATION_EDITION_FORM_IDS.FORM}
                   component="div"
                   fixed maxWidth={"md"}
                   onClick={(event) => handleOperationEditionClick(event, operation, budget, editOperation, editForm, setEditForm, errors, setErrors, onOperationChange)}
                   onKeyUp={(event) => handleOperationEditionClick(event, operation, budget, editOperation, editForm, setEditForm, errors, setErrors, onOperationChange)}>

            <Stack direction={"column"} spacing={5} sx={{alignItems: "center", marginTop: "20px"}}>
                <Box width={56} height={56}
                     sx={{
                         borderRadius: "50%",
                         backgroundColor: getCategorieColor(operation.categorie),
                         color: '#FFFFFF',
                         padding: '16px 8px 0px 8px'
                     }}>
                    <CenterComponent>{getCategorieIcon(operation.ssCategorie)}</CenterComponent>
                </Box>

                { /** VALEUR **/}
                <Typography variant={"h4"} className={budget?.actif ? "editableField" : ""}
                            id={OPERATION_EDITION_FORM_IDS.VALUE}>
                    {(!editForm.value) ?
                        <OperationValue operation={operation} valueOperation={operation.valeur} showSign={true}
                                        id={OPERATION_EDITION_FORM_IDS.VALUE}/>
                        :
                        <TextField id={OPERATION_EDITION_FORM_IDS.VALUE + OPERATION_EDITION_FORM_IDS.INPUT}
                                   required label="Montant"
                                   InputProps={{
                                       startAdornment: (
                                           <InputAdornment position="start"> {operation.typeOperation === "CREDIT" ?
                                               <AddRounded/> : <RemoveRounded/>}</InputAdornment>
                                       ),
                                       endAdornment: (
                                           <InputAdornment position="end"><EuroRounded/></InputAdornment>
                                       )
                                   }}
                                   defaultValue={Math.abs(operation.valeur)}
                                   variant="standard" sx={{width: "850px"}}
                                   error={errors.valeur != null} helperText={errors.valeur}
                                   onChange={fillValeurForm}/>
                    }
                </Typography>

                { /** LIBELLE **/}
                {(!editForm.libelle) ?
                    <Typography variant={"button"} sx={{fontSize: "large"}}
                                className={budget?.actif ? "editableField" : ""}
                                id={OPERATION_EDITION_FORM_IDS.LIBELLE}>
                        {getOperationLibelle(operation.libelle, listeComptes, true)}
                    </Typography>
                    :
                    <FormControl fullWidth required error={errors.libelle != null}>
                        <Autocomplete id={OPERATION_EDITION_FORM_IDS.LIBELLE + OPERATION_EDITION_FORM_IDS.INPUT}
                            // required
                            // label={"Libellé"}
                                      defaultValue={operation.libelle}
                                      freeSolo={true}
                                      options={listeLibellesOperation}
                                      renderInput={(params) =>
                                          <TextField {...params} label="Description" variant="standard"
                                                     size={"small"}/>}
                                      sx={{width: "850px"}}
                                      onChange={fillLibelleForm}
                                      onFocus={() => activateValidationForm(false)}
                                      onBlur={e => {
                                          activateValidationForm(true);
                                          fillLibelleForm(e);
                                      }}
                        />
                        <FormHelperText>{errors.libelle}</FormHelperText>
                    </FormControl>
                }

                <Grid2 container width={"100%"}>
                    <Grid2 md={5}>
                        <Typography variant={"caption"} sx={{color: "#808080"}}>Catégorie</Typography>
                    </Grid2>
                    <Grid2 md={4}>
                        <Typography variant={"caption"} sx={{color: "#808080"}}>Etat</Typography>
                    </Grid2>
                    <Grid2 md={3}>
                        <Typography variant={"caption"} sx={{color: "#808080"}}>Période</Typography>
                    </Grid2>


                    <Grid2 md={5}>
                        {
                            /** CATEGORIES **/
                            !editForm.categories ?
                                <Typography variant={"overline"}>
                                    {operation.categorie.libelle} / {operation.ssCategorie.libelle}
                                </Typography>
                                :
                                <FormControl fullWidth required error={errors.categorie != null}>
                                    <Autocomplete
                                        id={OPERATION_EDITION_FORM_IDS.CATEGORIE + OPERATION_EDITION_FORM_IDS.INPUT}
                                        renderInput={(params) => <TextField {...params} variant={"standard"}/>}
                                        sx={{width: "90%"}}
                                        defaultValue={operation.ssCategorie != null ? operation.ssCategorie : EMPTY_CATEGORIE}
                                        options={getListeAllCategories(listeCategories)}
                                        groupBy={(option: CategorieOperationModel) => option.categorieParente ? option.categorieParente.libelle : ""}
                                        getOptionLabel={(option: CategorieOperationModel) => option.libelle != null ? option.libelle : ""}
                                        isOptionEqualToValue={(option, value) => {
                                            if (option.id != null) {
                                                return (option.id === (value != null ? value.id : null))
                                            } else {
                                                return false;
                                            }
                                        }}
                                        onChange={fillCategorieForm}
                                        onFocus={() => activateValidationForm(false)}
                                        onBlur={e => {
                                            activateValidationForm(true);
                                            fillCategorieForm(e);
                                        }}
                                    />
                                    <FormHelperText>{errors.categorie}</FormHelperText>
                                </FormControl>
                        }
                    </Grid2>
                    <Grid2 md={4}>
                        <Typography variant={"overline"} color={getOperationStateColor(operation.etat)}>
                            {operation.etat}
                        </Typography>
                    </Grid2>
                    <Grid2 md={3}>
                        { /** PERIODE **/
                            (!editForm.mensualite) ?
                                <Typography id={OPERATION_EDITION_FORM_IDS.MENSUALITE} variant={"overline"}
                                            className={budget?.actif ? "editableField" : ""}
                                            color={getPeriodeRenderer(operation.mensualite.periode).color}>
                                    {getPeriodeRenderer(operation.mensualite.periode).text}
                                </Typography>
                                :
                                <TextField
                                    id={OPERATION_EDITION_FORM_IDS.MENSUALITE + OPERATION_EDITION_FORM_IDS.INPUT}
                                    required select fullWidth
                                    value={operation.mensualite.periode}
                                    placeholder={"Sélectionnez une période"}
                                    onChange={fillPeriodeForm}
                                    variant="standard">
                                    {PERIODES_MENSUALITE_ENUM.map((option) => (
                                        <MenuItem key={option} value={option}
                                                  color={getPeriodeRenderer(option).color}>
                                            {getPeriodeRenderer(option).text}
                                        </MenuItem>
                                    ))}
                                </TextField>
                        }
                    </Grid2>


                    <Grid2 md={5} paddingTop={3}>
                        {isInCreateMode(editForm) && editOperation !== null && (BUSINESS_GUID.SOUS_CAT_INTER_COMPTES === editOperation.ssCategorie.id) ?
                            <Typography variant={"caption"} sx={{color: "#808080"}}>Compte de
                                transfert</Typography> : <></>}
                    </Grid2>
                    <Grid2 md={4} paddingTop={3}>
                        {budget?.actif && operation.etat !== OPERATION_ETATS_ENUM.SUPPRIMEE ?
                            <Typography variant={"caption"} sx={{color: "#808080"}}>Actions</Typography> : <></>
                        }
                    </Grid2>
                    <Grid2 md={3} paddingTop={3}>
                        <Typography variant={"caption"} sx={{color: "#808080"}}>Date d'opération</Typography>
                    </Grid2>


                    <Grid2 md={5}>
                        { /** COMPTE DE TRANSFERT  **/
                            isInCreateMode(editForm) && editOperation !== null && (BUSINESS_GUID.SOUS_CAT_INTER_COMPTES === editOperation.ssCategorie.id) ?
                                <TextField
                                    id={OPERATION_EDITION_FORM_IDS.INTERCOMPTES + OPERATION_EDITION_FORM_IDS.INPUT}
                                    required select sx={{width: "90%"}}
                                    value={intercompte}
                                    placeholder={"Sélectionnez un compte"}
                                    error={errors.intercompte != null}
                                    helperText={errors.intercompte}
                                    onChange={fillIntercompteForm}
                                    variant="standard">
                                    {listeComptes
                                        .filter((compte: CompteBancaireModel) => budget.idCompteBancaire !== compte.id)
                                        .map((compte) => (
                                            <MenuItem key={compte.id} value={compte.id}>
                                                <img src={"/img/banques/" + compte.icon}
                                                     width={20} height={20}
                                                     alt={compte.libelle}
                                                     style={{marginRight: "5px"}}/>
                                                {compte.libelle}
                                            </MenuItem>
                                        ))}
                                </TextField> : <></>}
                    </Grid2>
                    <Grid2 md={4}>
                        { /** ACTIONS SUR OPERATION **/}
                        {budget?.actif && operation.etat !== OPERATION_ETATS_ENUM.SUPPRIMEE ?
                            <OperationDetailActions operation={operation}
                                                    budget={budget}
                                                    isInCreateMode={isInCreateMode(editForm)}
                                                    onClickRealiseInCreateMode={handleDateOperationFromAction}
                                                    onOperationChange={onOperationChange}/> : <></>
                        }
                    </Grid2>
                    <Grid2 md={3}>
                        { /** DATE OPERATION **/}
                        {(!editForm.dateOperation) ?
                            <Typography id={OPERATION_EDITION_FORM_IDS.DATE_OPERATION} variant={"subtitle1"}
                                        className={budget?.actif ? "editableField" : ""}
                                        sx={{color: (operation.autresInfos.dateOperation != null ? "#FFFFFF" : "#121212")}}>
                                {operation.autresInfos.dateOperation != null ? operation.autresInfos.dateOperation.toLocaleDateString("fr") : "jj/mm/aaaa"}
                            </Typography>
                            :
                            <TextField
                                id={OPERATION_EDITION_FORM_IDS.DATE_OPERATION + OPERATION_EDITION_FORM_IDS.INPUT}
                                defaultValue={operation.autresInfos.dateOperation}
                                variant={"standard"} type={"date"} fullWidth
                                error={errors.dateOperation != null}
                                helperText={errors.dateOperation}
                                onChange={fillDateOperationForm}/>
                        }
                    </Grid2>
                </Grid2>

                {budget?.actif && isInEditMode(editForm) &&
                    <Button
                        fullWidth
                        variant="outlined" color="success"
                        onClick={() => handleValidateOperationForm(operation, budget, editOperation, editForm, setEditForm, errors, setErrors, onOperationChange)}>Valider</Button>
                }

            </Stack>
        </Container>
    )
}

export default OperationDetailPage
