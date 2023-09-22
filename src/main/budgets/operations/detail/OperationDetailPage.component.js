import React, {Component} from 'react'
import {Box, Container, InputAdornment, MenuItem, Stack, TextField, Typography} from "@mui/material";
import OperationValue from "../renderers/OperationSpanValue.renderer";
import * as Renderer from "../renderers/OperationItem.renderer";
import Grid2 from "@mui/material/Unstable_Grid2";
import OperationDetailActions from "./OperationDetailActions.component";
import * as Controller from "./OperationDetailPage.controller";
import {OPERATION_EDITION_FORM_IDS} from "./OperationDetailPage.constants";
import * as Service from "./OperationDetailPage.extservices";
import {AddRounded, EditRounded, EuroRounded, RemoveRounded} from "@mui/icons-material";
import {addEndingZeros} from '../../../Utils/DataUtils.utils'
import {OPERATIONS_ENUM, PERIODES_MENSUALITE_ENUM} from "../../../Utils/AppBusinessEnums.constants";

/**
 * Page de détail d'une opération
 * @param operation opération sélectionnée
 * @param budget budget associée
 * @param onActionOperationChange opération de mise à jour du budget
 * @returns {JSX.Element} composant
 * @constructor
 */
class OperationDetailPage extends Component {


    /** Etats pour la page de détail d'une opération **/
    state = {
        editForm: {
            value: false,
            libelle: false,
            dateOperation: false,
        },
        errors: {
            valeur: null,
            libelle: null
        }
    }

    /** Constructeur **/
    constructor(props) {
        super(props);
        this.handleOperationEditionClick = Controller.handleOperationEditionClick.bind(this);
        this.isInEditMode = Controller.isInEditMode.bind(this);

        this.handleValidateOperationForm = Controller.handleValidateOperationForm.bind(this);
        this.handleCloseOperationForm = Controller.handleCloseOperationForm.bind(this);

        this.saveOperation = Service.saveOperation.bind(this);
    }




    /**
     * Init de l'opération du formulaire à la sélection d'une nouvelle opération
     */
    componentDidMount() {
        this.setState({editOperation: Controller.cloneOperation(this.props.operation)});
    }


    /**
     * Réinit de l'opération du formulaire à la sélection d'une nouvelle opération
     */
    componentDidUpdate(prevProps: Readonly<P>, prevState: Readonly<S>, snapshot: SS) {
        if (this.props.operation.id !== prevProps.operation.id) {
            this.setState({editOperation: Controller.cloneOperation(this.props.operation)});
            this.handleCloseOperationForm();
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
        editOperation.autresInfos.dateOperation = e.target.value
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
                             backgroundColor: Renderer.getCategorieColor(operation.categorie), color: '#FFFFFF',
                             padding: '16px 8px 0px 8px'
                         }}>
                        <center>{Renderer.getSousCategorieIcon(operation.ssCategorie)}</center>
                    </Box>

                    { /** VALEUR **/}
                    <Typography variant={"h4"} className={"editableField"}>
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
                                       variant="standard"
                                       error={this.state.errors.valeur != null} helperText={this.state.errors.valeur}
                                       onChange={(e) => this.fillValeurForm(e)}/>
                        }
                    </Typography>

                    { /** LIBELLE **/}
                    <Typography variant={"button"} sx={{fontSize: "large"}} className={"editableField"}>
                        {(!this.state.editForm.libelle) ?
                            <span className={"editableField"}
                                  id={OPERATION_EDITION_FORM_IDS.LIBELLE}>{operation.libelle}</span>
                            :
                            <TextField id={OPERATION_EDITION_FORM_IDS.LIBELLE + OPERATION_EDITION_FORM_IDS.INPUT}
                                       required label="Libellé"
                                       InputProps={{
                                           startAdornment: (
                                               <InputAdornment position="start"><EditRounded/></InputAdornment>
                                           )
                                       }}
                                       defaultValue={operation.libelle}
                                       variant="standard" sx={{width: "800px"}}
                                       error={this.state.errors.libelle != null} helperText={this.state.errors.libelle}
                                       onChange={(e) => this.fillLibelleForm(e)}/>
                        }

                    </Typography>


                    <Grid2 container width={"100%"}>
                        <Grid2 md={6}>
                            <Typography variant={"caption"} sx={{color: "#808080"}}>Catégories</Typography>
                        </Grid2>
                        <Grid2 md={3}>
                            <Typography variant={"caption"} sx={{color: "#808080"}}>Etat</Typography>
                        </Grid2>
                        <Grid2 md={3}>
                            <Typography variant={"caption"} sx={{color: "#808080"}}>Période</Typography>
                        </Grid2>

                        <Grid2 md={6}>
                            <Typography
                                variant={"overline"}> {operation.categorie.libelle} / {operation.ssCategorie.libelle} </Typography>
                        </Grid2>
                        <Grid2 md={3}>
                            <Typography variant={"overline"} color={Renderer.getOperationStateColor(operation.etat)}>
                                {operation.etat}
                            </Typography>
                        </Grid2>
                        <Grid2 md={3}>
                            { /** PERIODE **/

                                (!this.state.editForm.mensualite) ?
                                    <Typography id={OPERATION_EDITION_FORM_IDS.MENSUALITE} variant={"overline"}
                                                className={"editableField"}
                                                color={Renderer.getPeriodeRenderer(operation.mensualite.periode).color}>
                                        {Renderer.getPeriodeRenderer(operation.mensualite.periode).text}
                                    </Typography>
                                    :
                                    <TextField
                                        id={OPERATION_EDITION_FORM_IDS.MENSUALITE + OPERATION_EDITION_FORM_IDS.INPUT}
                                        required size="sm" select
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


                        <Grid2 md={6} paddingTop={3}>
                            {budget != null && budget.actif && operation.etat !== OPERATIONS_ENUM.SUPPRIMEE ?
                                <Typography variant={"caption"} sx={{color: "#808080"}}>Actions</Typography> : <></>
                            }

                        </Grid2>
                        <Grid2 md={3} paddingTop={3}>
                            <Typography variant={"caption"} sx={{color: "#808080"}}>Date
                                d'opération</Typography> : <></>
                        </Grid2>
                        <Grid2 md={3} paddingTop={3}>

                        </Grid2>
                        <Grid2 md={6}>
                            {budget != null && budget.actif && operation.etat !== OPERATIONS_ENUM.SUPPRIMEE ?
                                <OperationDetailActions currentOperation={operation}
                                                        currentBudget={budget}
                                                        saveOperation={this.saveOperation}/> : <></>
                            }
                        </Grid2>
                        { /** DATE OPERATION **/}
                        <Grid2 md={3}>
                            {(!this.state.editForm.dateOperation) ?

                                <Typography id={OPERATION_EDITION_FORM_IDS.DATE_OPERATION} variant={"subtitle1"}
                                            className={"editableField"}>
                                    {operation.autresInfos.dateOperation != null ? new Date(Date.parse(operation.autresInfos.dateOperation)).toLocaleDateString("fr") : "jj/mm/aaaa"}
                                </Typography>
                                :
                                <TextField
                                    id={OPERATION_EDITION_FORM_IDS.DATE_OPERATION + OPERATION_EDITION_FORM_IDS.INPUT}
                                    defaultValue={operation.autresInfos.dateOperation}
                                    variant={"standard"} type={"date"}
                                    error={this.state.errors.dateOperation != null}
                                    helperText={this.state.errors.dateOperation}
                                    onChange={(e) => this.fillDateOperationForm(e)}/>
                            }

                        </Grid2>
                        <Grid2 md={4}>

                        </Grid2>
                    </Grid2>

                </Stack>
            </Container>
        )
    }


}

export default OperationDetailPage
