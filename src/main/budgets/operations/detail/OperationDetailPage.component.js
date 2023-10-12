import React, {Component} from 'react'
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
import OperationValue from "../../../Utils/renderers/OperationValue.renderer";
import * as Renderer from "../../../Utils/renderers/OperationItem.renderer";
import * as CategorieRenderer from "../../../Utils/renderers/CategorieItem.renderer";

import Grid2 from "@mui/material/Unstable_Grid2";
import OperationDetailActions from "../actions/OperationDetailActions.component";
import * as Controller from "./OperationDetailPage.controller";
import {OPERATION_EDITION_FORM_IDS} from "./OperationDetailPage.constants";
import * as Service from "./OperationDetailPage.extservices";
import {AddRounded, EditRounded, EuroRounded, RemoveRounded} from "@mui/icons-material";
import {addEndingZeros, getLabelDate, sortLibellesCategories} from '../../../Utils/DataUtils.utils'
import {
    BUSINESS_GUID,
    OPERATION_ETATS_ENUM,
    PERIODES_MENSUALITE_ENUM,
    TYPES_OPERATION_ENUM
} from "../../../Utils/AppBusinessEnums.constants";
import PropTypes from "prop-types";

/**
 * Page de détail d'une opération
 * @param operation opération sélectionnée
 * @param budget budget associée
 * @param onActionOperationChange opération de mise à jour du budget
 * @returns {JSX.Element} composant
 * @constructor
 */
class OperationDetailPage extends Component {




    /** Constructeur **/
    constructor(props) {
        super(props);
        let editMode = this.props.operation.id === -1;

        /** Etats pour la page de détail d'une opération **/
        this.state = (
            {
                editForm: {
                    value: editMode,
                    libelle: editMode,
                    dateOperation: editMode,
                    mensualite: editMode,
                    categories: editMode
                },
                intercompte: null,
                errors: {
                    valeur: null,
                    libelle: null,
                    categorie: null,
                    compte: null
                },
                listeAllCategories: null,
                editOperation: null
            }
        )

        this.handleOperationEditionClick = Controller.handleOperationEditionClick.bind(this);
        this.isInEditMode = Controller.isInEditMode.bind(this);
        this.isInCreateMode = Controller.isInCreateMode.bind(this);

        this.handleValidateOperationForm = Controller.handleValidateOperationForm.bind(this);
        this.validateForm = Controller.validateForm.bind(this);
        this.handleCloseOperationForm = Controller.handleCloseOperationForm.bind(this);

        this.saveOperation = Service.saveOperation.bind(this);
        this.saveOperationIntercompte = Service.saveOperationIntercompte.bind(this);
    }


    /**
     * Init de l'opération du formulaire à la sélection d'une nouvelle opération
     */
    componentDidMount() {

        if (this.state.listeAllCategories == null) {
            /**
             * Chargement des catégories
             */
            const mapSsCategories = this.props.listeCategories
                .flatMap(cat => {
                    for (let ssCat in cat.listeSSCategories) {
                        cat.listeSSCategories[ssCat].categorieParente = cat
                    }
                    return cat.listeSSCategories
                })
                .sort(sortLibellesCategories)

            this.setState({listeAllCategories: mapSsCategories})
        }
        this.setState({editOperation: Controller.cloneOperation(this.props.operation)});
    }


    /**
     * Réinit de l'opération du formulaire à la sélection d'une nouvelle opération
     */
    componentDidUpdate(prevProps: Readonly<P>, prevState: Readonly<S>, snapshot: SS) {

        if (this.props.operation.id !== prevProps.operation.id) {
            this.setState({editOperation: Controller.cloneOperation(this.props.operation)});

            if (this.props.operation.id === -1) {
                this.setState({
                    editForm: {
                        libelle: true, value: true, dateOperation: true, mensualite: true, categories: true
                    }
                })
            } else {
                this.handleCloseOperationForm();
            }
        }
    }



    /**
     * Fonctions pour remplir l'état à partir de la saisie
     * @param e click
     */
    fillLibelleForm(e) {
        let editOperation = this.state.editOperation
        editOperation.libelle = e.target.value
        this.setState({editOperation: editOperation})
    }

    fillDateOperationForm(e) {
        let editOperation = this.state.editOperation
        let value = e.target.value
        if (value === "") {
            value = null;
        }
        editOperation.autresInfos.dateOperation = value;
        this.setState({editOperation: editOperation})
    }

    fillValeurForm(e) {
        let editOperation = this.state.editOperation
        editOperation.valeur = addEndingZeros(e.target.value)
        this.setState({editOperation: editOperation})
    }

    fillPeriodeForm(e) {
        let editOperation = this.state.editOperation
        editOperation.mensualite.periode = e.target.value
        this.setState({editOperation: editOperation})
    }

    fillIntercompteForm(e) {
        this.setState({intercompte: e.target.value})
    }

    fillCategorieForm(e) {
        const ssCat = this.state.listeAllCategories
            .filter(ssCat => {
                return ssCat.libelle === e.target.textContent
            })[0]

        let editOperation = this.state.editOperation
        editOperation.categorie.id = ssCat.categorieParente.id
        editOperation.categorie.libelle = ssCat.categorieParente.libelle
        editOperation.ssCategorie.id = ssCat.id
        editOperation.ssCategorie.libelle = ssCat.libelle
        this.setState({editOperation: editOperation})

        /** Si type Virement **/
        editOperation.typeOperation = (BUSINESS_GUID.CAT_VIREMENT === editOperation.categorie.id && BUSINESS_GUID.SOUS_CAT_INTER_COMPTES !== editOperation.ssCategorie.id) ? TYPES_OPERATION_ENUM.CREDIT : TYPES_OPERATION_ENUM.DEPENSE;

        /** Adaptation sur la sélection de catégorie **/

        let currentOperation = this.props.operation
        currentOperation.categorie.id = ssCat.categorieParente.id
        currentOperation.categorie.libelle = ssCat.categorieParente.libelle
        currentOperation.ssCategorie.id = ssCat.id
        currentOperation.ssCategorie.libelle = ssCat.libelle
        currentOperation.typeOperation = editOperation.typeOperation
    }




    /**
     * RENDER
     * @returns {JSX.Element}
     */

    render() {
        let {operation, budget} = this.props;

        return (
            <Container id={OPERATION_EDITION_FORM_IDS.FORM}
                       fixed maxWidth={"md"}
                       onClick={this.handleOperationEditionClick}
                       onKeyUp={this.handleOperationEditionClick}>

                <Stack direction={"column"} spacing={5} sx={{alignItems: "center"}}>
                    <Box width={40} height={40}
                         sx={{
                             borderRadius: "50%",
                             backgroundColor: CategorieRenderer.getCategorieColor(operation.categorie),
                             color: '#FFFFFF',
                             padding: '16px 8px 0px 8px'
                         }}>
                        <center>{CategorieRenderer.getCategorieIcon(operation.ssCategorie)}</center>
                    </Box>

                    { /** VALEUR **/}
                    <Typography variant={"h4"} className={budget?.actif ? "editableField" : ""}
                                id={OPERATION_EDITION_FORM_IDS.VALUE}>
                        {(!this.state.editForm.value) ?
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
                                       error={this.state.errors.valeur != null} helperText={this.state.errors.valeur}
                                       onChange={(e) => this.fillValeurForm(e)}/>
                        }
                    </Typography>

                    { /** LIBELLE **/}
                    <Typography variant={"button"} sx={{fontSize: "large"}}
                                className={budget?.actif ? "editableField" : ""}
                                id={OPERATION_EDITION_FORM_IDS.LIBELLE}>
                        {(!this.state.editForm.libelle) ?
                            <span
                                id={OPERATION_EDITION_FORM_IDS.LIBELLE}>{Renderer.getOperationLibelle(operation.libelle, this.props.listeComptes, true)}</span>
                            :
                            <TextField id={OPERATION_EDITION_FORM_IDS.LIBELLE + OPERATION_EDITION_FORM_IDS.INPUT}
                                       required label="Libellé"
                                       InputProps={{
                                           startAdornment: (
                                               <InputAdornment position="start"><EditRounded/></InputAdornment>
                                           )
                                       }}
                                       defaultValue={operation.libelle}
                                       variant="standard" sx={{width: "850px"}}
                                       error={this.state.errors.libelle != null} helperText={this.state.errors.libelle}
                                       onChange={(e) => this.fillLibelleForm(e)}/>
                        }

                    </Typography>


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
                                !this.state.editForm.categories ?
                                    <Typography variant={"overline"}>
                                        {operation.categorie.libelle} / {operation.ssCategorie.libelle}
                                    </Typography>
                                    :
                                    <FormControl fullWidth required error={this.state.errors.categorie != null}>
                                        <Autocomplete
                                            id={OPERATION_EDITION_FORM_IDS.CATEGORIE + OPERATION_EDITION_FORM_IDS.INPUT}
                                            renderInput={(params) => <TextField {...params} variant={"standard"}/>}
                                            sx={{width: "90%"}}
                                            options={this.state.listeAllCategories}
                                            groupBy={(option) => option.categorieParente.libelle}
                                            autoComplete={true}
                                            getOptionLabel={option => option.libelle}
                                            isOptionEqualToValue={(option, value) => {
                                                return option.id === (value != null ? value.id : null)
                                            }}
                                            onChange={(e) => this.fillCategorieForm(e)}
                                        />
                                        <FormHelperText>{this.state.errors.categorie}</FormHelperText>
                                    </FormControl>
                            }
                        </Grid2>
                        <Grid2 md={4}>
                            <Typography variant={"overline"} color={Renderer.getOperationStateColor(operation.etat)}>
                                {operation.etat}
                            </Typography>
                        </Grid2>
                        <Grid2 md={3}>
                            { /** PERIODE **/
                                (!this.state.editForm.mensualite) ?
                                    <Typography id={OPERATION_EDITION_FORM_IDS.MENSUALITE} variant={"overline"}
                                                className={budget?.actif ? "editableField" : ""}
                                                color={Renderer.getPeriodeRenderer(operation.mensualite.periode).color}>
                                        {Renderer.getPeriodeRenderer(operation.mensualite.periode).text}
                                    </Typography>
                                    :
                                    <TextField
                                        id={OPERATION_EDITION_FORM_IDS.MENSUALITE + OPERATION_EDITION_FORM_IDS.INPUT}
                                        required select fullWidth
                                        value={operation.mensualite.periode}
                                               placeholder={"Sélectionnez une période"}
                                        onChange={(e) => this.fillPeriodeForm(e)}
                                               variant="standard">
                                        {PERIODES_MENSUALITE_ENUM.map((option) => (
                                            <MenuItem key={option} value={option}
                                                      color={Renderer.getPeriodeRenderer(option).color}>
                                                {Renderer.getPeriodeRenderer(option).text}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                            }
                        </Grid2>


                        <Grid2 md={5} paddingTop={3}>
                            {this.isInCreateMode() && this.state.editOperation !== null && (BUSINESS_GUID.SOUS_CAT_INTER_COMPTES === this.state.editOperation.ssCategorie.id) ?
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
                                this.isInCreateMode() && this.state.editOperation !== null && (BUSINESS_GUID.SOUS_CAT_INTER_COMPTES === this.state.editOperation.ssCategorie.id) ?
                                    <TextField
                                        id={OPERATION_EDITION_FORM_IDS.INTERCOMPTES + OPERATION_EDITION_FORM_IDS.INPUT}
                                        required select sx={{width: "90%"}}
                                        value={this.state.intercompte}
                                        placeholder={"Sélectionnez un compte"}
                                        error={this.state.errors.intercompte != null}
                                        helperText={this.state.errors.intercompte}
                                        onChange={(e) => this.fillIntercompteForm(e)}
                                        variant="standard">
                                        {this.props.listeComptes
                                            .filter((compte) => this.props.budget.idCompteBancaire !== compte.id)
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
                                <OperationDetailActions currentOperation={operation}
                                                        currentBudget={budget}
                                                        isInCreateMode={this.isInCreateMode}
                                                        saveOperation={this.saveOperation}/> : <></>
                            }
                        </Grid2>
                        <Grid2 md={3}>
                            { /** DATE OPERATION **/}
                            {(!this.state.editForm.dateOperation) ?
                                <Typography id={OPERATION_EDITION_FORM_IDS.DATE_OPERATION} variant={"subtitle1"}
                                            className={budget?.actif ? "editableField" : ""}
                                            sx={{color: (operation.autresInfos.dateOperation != null ? "#000000" : "#E0E0E0")}}>
                                    {operation.autresInfos.dateOperation != null ? getLabelDate(operation.autresInfos.dateOperation) : "jj/mm/aaaa"}
                                </Typography>
                                :
                                <TextField
                                    id={OPERATION_EDITION_FORM_IDS.DATE_OPERATION + OPERATION_EDITION_FORM_IDS.INPUT}
                                    defaultValue={operation.autresInfos.dateOperation}
                                    variant={"standard"} type={"date"} fullWidth
                                    error={this.state.errors.dateOperation != null}
                                    helperText={this.state.errors.dateOperation}
                                    onChange={(e) => this.fillDateOperationForm(e)}/>
                            }
                        </Grid2>
                    </Grid2>

                    {budget?.actif && this.isInEditMode() &&
                        <Button
                            fullWidth
                            variant="outlined" color="success"
                            onClick={this.handleValidateOperationForm}>Valider</Button>
                    }

                </Stack>
            </Container>
        )
    }
}

// Properties Types
OperationDetailPage.propTypes = {
    operation: PropTypes.object.isRequired,
    budget: PropTypes.object.isRequired,
    listeCategories: PropTypes.array.isRequired,
    listeComptes: PropTypes.array.isRequired,
    onOperationChange: PropTypes.func.isRequired
}
export default OperationDetailPage
