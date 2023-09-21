import React, {Component} from 'react'
import {Box, Container, InputAdornment, Stack, TextField, Typography} from "@mui/material";
import OperationValue from "../renderers/OperationSpanValue.renderer";
import * as Renderer from "../renderers/OperationItem.renderer";
import Grid2 from "@mui/material/Unstable_Grid2";
import OperationDetailActions from "./OperationDetailActions.component";
import * as AppConstants from "../../../Utils/AppEnums.constants";
import * as Controller from "./OperationDetailPage.controller";
import {OPERATION_EDITION_FORM_IDS} from "./OperationDetailPage.controller";
import * as Service from "./OperationDetailPage.extservices";
import {AddRounded, EditRounded, EuroRounded, RemoveRounded} from "@mui/icons-material";


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
            libelle: false
        },
        errors: {
            valeur: null
        }
    }

    /** Constructeur **/
    constructor(props) {
        super(props);
        this.fillOperationFormFromOperation = Controller.fillOperationFormFromOperation.bind(this)

        this.handleOperationEditionClick = Controller.handleOperationEditionClick.bind(this);

        this.handleValidateOperationForm = Controller.handleValidateOperationForm.bind(this);
        this.handleCancelOperationForm = Controller.handleCloseOperationForm.bind(this);

        this.saveOperation = Service.saveOperation.bind(this);
    }


    /**
     * Réinit de l'opération du formulaire à la sélection d'une nouvelle opération
     */
    componentDidUpdate(prevProps: Readonly<P>, prevState: Readonly<S>, snapshot: SS) {
        if (this.props.operation.id !== prevProps.operation.id) {
            this.setState({editOperation: this.fillOperationFormFromOperation(this.props.operation)});
        }
    }


    /**
     * Fonctions pour remplir l'état à partir de la saisie
     * @param e
     */
    fillLibelleForm(e) {
        let editOperation = this.state.editOperation
        editOperation.libelle = e.target.value
        this.setState({editOperation: editOperation})
    }

    fillValeurForm(e) {
        let editOperation = this.state.editOperation
        let value = e.target.value.replaceAll(",", ".")
        if (value.indexOf(".") === -1) {
            value += ".00"
        }
        editOperation.valeur = value
        this.setState({editOperation: editOperation})
    }


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
                            <Typography variant={"overline"}
                                        color={Renderer.getOperationStateColor(operation.etat)}>{operation.etat} </Typography>
                        </Grid2>
                        <Grid2 md={3}>
                            {(operation.mensualite != null ?
                                    <Typography variant={"overline"}
                                                color={Renderer.getPeriodeColor(operation.mensualite.periode)}>{operation.mensualite.periode}</Typography>
                                    :
                                    <Typography variant={"overline"}
                                                color={Renderer.getPeriodeColor("PONCTUELLE")}>PONCTUELLE</Typography>
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
                                                        saveOperation={this.saveOperation}/> : <></>
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
    }


}

export default OperationDetailPage
