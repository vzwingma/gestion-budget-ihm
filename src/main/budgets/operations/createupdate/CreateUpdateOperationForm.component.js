import React, {Component} from 'react';

import {
    Box,
    Button,
    ButtonGroup, Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle, FormControl,
    FormLabel, Input, InputAdornment, TextField,
    Tooltip
} from '@mui/material';
import * as ExtServices from './CreateUpdateOperationForm.extservices'
import * as Controller from './CreateUpdateOperationForm.controller'
import {getLibelleDate} from '../../../Utils/DataUtils.utils'
import BaseSelect from "react-select";
import Select from "react-select";
import RequiredSelect from "../../../Utils/RequiredSelect";
import Grid2 from "@mui/material/Unstable_Grid2";
import { getBackground } from "../../../Utils/DataUtils.utils";

/**
 * Formulaire sur le Bouton création
 */
export default class CreateUpdateOperationForm extends Component {


    /**
     * Liste des états d'opérations, affichés
     * @type {[{icon, text: string, value: string},{icon, text: string, value: string},{icon, text: string, value: string},{icon, text: string, value: string}]}
     */
    listeEtats = [
        {   value: "PREVUE", text: "Prévue",
            icon: <img src={"/img/statuts/circle_clock.png"} className="d-inline-block align-top" alt="Prévue"/>        },
        {   value: "REALISEE", text: "Réalisée",
            icon: <img src={"/img/statuts/circle_ok.png"} className="d-inline-block align-top" alt="Réalisée"/>         },
        {   value: "REPORTEE", text: "Reportée",
            icon: <img src={"/img/statuts/circle_arrow_right.png"} className="d-inline-block align-top" alt="Reportée"/>},
        {   value: "ANNULEE", text: "Annulée",
            icon: <img src={"/img/statuts/circle_cancel.png"} className="d-inline-block align-top" alt="Annulée"/>      }
    ]

    listePeriodes = [
        { value: "PONCTUELLE", text: "Ponctuelle" },
        { value: "MENSUELLE", text: "Mensuelle" },
        { value: "TRIMESTRIELLE", text: "Trimestrielle" },
        { value: "SEMESTRIELLE", text: "Semestrielle" },
        { value: "ANNUELLE", text: "Annuelle" }
    ]

    listeType = [
        { value:"DEPENSE" , text: "-" },
        { value: "CREDIT", text:"+" }
    ]

    /**
     * States
     **/
    state = {
        // Data d'affichages du formulaire
        categoriesSelect: [],
        ssCategoriesSelect: [],
        ssCategoriesAll: [],
        comptes: [],
        // Formulaire
        formCategorie           : null,
        formSsCategorie         : null,
        formCompteCible         : null,
        formDescription         : "",
        formValeur              : "",
        // TODO : Utiliser la préférence utilisateur
        formEtat                : this.listeEtats[0],
        formDateOperation       : "",
        formOperationType       : this.listeType[0],
        formOperationPeriodique : this.listePeriodes[0],
        formProchaineMensualite : null,
        formTagDerniereOperation: false,
        // Affichage & Validation du formulaire
        showIntercompte: false,
        formValidated: false,
        // Notif
        toastShow: false,
        toastMessage: ""
    }


    /**
     * Constructeur du formulaire
     * @param props
     */
    constructor(props) {
        super(props);

        this.handleSelectCategorie = Controller.handleSelectCategorie.bind(this);
        this.handleSelectSsCategorie = Controller.handleSelectSsCategorie.bind(this);
        this.handleSelectDescription = Controller.handleSelectDescription.bind(this);
        this.handleSelectCompteCible = Controller.handleSelectCompteCible.bind(this);
        this.handleSelectType = Controller.handleSelectType.bind(this);
        this.handleSelectValeur = Controller.handleSelectValeur.bind(this);
        this.handleCompleteValeur = Controller.handleCompleteValeur.bind(this);
        this.handleSelectEtat = Controller.handleSelectEtat.bind(this);
        this.handleSelectDateOperation = Controller.handleSelectDateOperation.bind(this);
        this.handleSelectPeriode = Controller.handleSelectPeriode.bind(this);

        this.fillFormFromOperation = Controller.fillFormFromOperation.bind(this);
        this.fillOperationFromForm = Controller.fillOperationFromForm.bind(this);

        this.handleSubmitForm = Controller.handleSubmitForm.bind(this);
        this.checkValidityForm = Controller.checkValidityForm.bind(this);
        this.razForm = Controller.razForm.bind(this);
        this.createOperation = Controller.createOperation.bind(this);
        this.updateOperation = Controller.updateOperation.bind(this);

        this.loadCategories = ExtServices.loadCategories.bind(this);
        this.categoriesLoaded = Controller.categoriesLoaded.bind(this);
        this.loadComptes = ExtServices.loadComptes.bind(this);
        this.saveOperation = ExtServices.saveOperation.bind(this);
        this.saveOperationIntercompte = ExtServices.saveOperationIntercompte.bind(this);

        this.hideModal = Controller.hideModal.bind(this);
        this.cancelForm = this.cancelForm.bind(this);
   //
    }



    /**
     * Chargement des catégories
     **/
    // TODO : Ce n'est pas au bon endroit (double appel à chaque fois)
    componentDidMount() {
        if(!this.props.modeEdition){
            this.loadCategories();
            this.setState({formDateOperation: getLibelleDate(new Date(), "AAAA-MM-DD")});
        }
        if(this.props.modeEdition && this.props.idOperation !== null && this.props.budget !== null){
            this.fillFormFromOperation(this.props.idOperation, this.props.budget.listeOperations, this.state.categories);
        }

    }

    /**
     * Annulation du formulaire
     */
    cancelForm(){
        this.razForm();
        this.props.hideModale();
    }

    /**
     *  RENDER
     */
    render() {
        return (
            <>
                { /** Fenêtre modale - Formulaire  **/ }
                <Dialog open={this.props.showModale}>

                    <DialogTitle bgcolor={"#1976d2"} color={"white"}>
                        { this.props.modeEdition ? "Edition" : "Création"} d'une opération
                    </DialogTitle>

                    <DialogContent>
                        <Box marginTop={"10px"}>
                        <Grid2 container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                            <Grid2 item xs={4}  columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                                <FormLabel>Catégories</FormLabel>
                            </Grid2>
                            <Grid2 item direction={"column"} xs={8} className={"MuiDataGrid-main"}>
                                <FormControl fullWidth required error={this.state.errorCategorie}>
                                    <RequiredSelect SelectComponent={BaseSelect}
                                                    required isDisabled={ this.props.modeEdition } isSearchable={true}
                                                    placeholder={"Sélectionnez une catégorie"}
                                                    value={this.state.formCategorie} options={this.state.categoriesSelect}
                                                    onChange={this.handleSelectCategorie}
                                                    getOptionLabel={e => (
                                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                                            <span style={{ fontSize:".875rem" }}>{e.text}</span>
                                                        </div>
                                                    )}>
                                    </RequiredSelect>
                                </FormControl>
                                <FormControl fullWidth required error={this.state.errorSsCategorie}>
                                    <RequiredSelect required className={"MuiDataGrid-main"} isDisabled={ this.props.modeEdition } SelectComponent={BaseSelect}
                                                    placeholder={"Sélectionnez une sous catégorie"} isSearchable={true}
                                                    value={this.state.formSsCategorie} options={this.state.ssCategoriesSelect}
                                                    onChange={this.handleSelectSsCategorie}
                                                    getOptionLabel={e => (
                                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                                            <span style={{ fontSize:".875rem" }}>{e.text}</span>
                                                        </div>
                                                    )}>
                                    </RequiredSelect>
                                </FormControl>
                                { this.state.showIntercompte &&
                                    <FormControl fullWidth required error={this.state.errorInterCompte}>
                                    <RequiredSelect SelectComponent={BaseSelect} className={"MuiDataGrid-main"}
                                                    placeholder="Sélectionnez le compte"
                                                    value={this.state.selectedCompte}
                                                    options={this.state.comptes}
                                                    isDisabled={ this.props.modeEdition } isSearchable={true}
                                                    onChange={this.handleSelectCompteCible}
                                                    getOptionLabel={e => (
                                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                                            {e.icon} <span style={{ marginLeft: 5, fontSize:12 }}>{e.text}</span>
                                                        </div>
                                                    )}
                                    />
                                    </FormControl>
                                }
                            </Grid2>
                            <Grid2 item xs={4}>
                                <Tooltip title={this.props.modeEdition ? "Prochaine mensualité : " + this.state.formProchaineMensualite : "" }>
                                    <FormLabel>Dépense périodique</FormLabel>
                                </Tooltip>
                            </Grid2>
                            <Grid2 item xs={8}>
                                <Select required size="sm" value={this.state.formOperationPeriodique} placeholder={"Sélectionnez une période"}
                                        onChange={this.handleSelectPeriode}
                                        options={this.listePeriodes} className={"MuiDataGrid-main"}
                                        getOptionLabel={e => (
                                            <div><Chip color={getBackground(e.value)} label="  " size={"small"} /> <span style={{ fontSize:".875rem" }}>{e.text}</span></div>
                                        )} />
                            </Grid2>
                            <Grid2 item xs={4}>
                                <FormLabel>Description</FormLabel>
                            </Grid2>
                            <Grid2 item xs={8}>
                                <FormControl required fullWidth sx={{ m: 1 }} error={this.state.errorDescription} >
                                    <Input defaultValue={this.state.formDescription} value={this.state.formDescription} onChange={this.handleSelectDescription}  />
                                </FormControl>
                            </Grid2>
                            <Grid2 item xs={4}>
                                <FormLabel>Montant</FormLabel>
                            </Grid2>
                            <Grid2 item xs={8} direction={"row"}>
                                { /*  pattern="[0-9]*\.[0-9]{2}" */}
                                <FormControl sx={{ m: 1 }} fullWidth error={this.state.errorValeur} >
                                    <Input defaultValue={this.state.formValeur} value={this.state.formValeur}
                                            onChange={this.handleSelectValeur} onBlur={this.handleCompleteValeur}
                                            style={this.state.formOperationType.text==="+" ? {color : "#93c54b" } : {color : "#e74c3c" } }
                                            endAdornment={<InputAdornment position="start">€</InputAdornment>} />
                                </FormControl>
                            </Grid2>
                            <Grid2 item xs={4}>
                                <FormLabel>Etat</FormLabel>
                            </Grid2>
                            <Grid2 item xs={8}>
                                <Select value={this.state.formEtat} options={this.listeEtats}
                                        onChange={this.handleSelectEtat} isSearchable={true} className={"MuiDataGrid-main"}
                                        getOptionLabel={e => (
                                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                                {e.icon} <span style={{ marginLeft: 15, fontSize:".875rem" }}>{e.text}</span>
                                            </div>
                                        )}
                                />
                            </Grid2>
                            <Grid2 item xs={4}>
                                <FormLabel>Date opération</FormLabel>
                            </Grid2>
                            <Grid2 item xs={8}>
                                <FormControl fullWidth className="MuiInputBase-datelabel" error={this.state.errorDateOperation}>
                                <TextField variant={"outlined"} type={"date"} className="MuiInputBase-datelabel"
                                           defaultValue={this.state.formDateOperation}  value={this.state.formDateOperation}  onChange={this.handleSelectDateOperation} />
                                </FormControl>
                            </Grid2>
                        </Grid2>
                        </Box>
                    </DialogContent>

                    <DialogActions>
                        <ButtonGroup>
                            <Tooltip title="Annuler la saisie">
                                <Button id="btnClose" color="error" onClick={ this.cancelForm } >Annuler</Button>
                            </Tooltip>
                            { !this.props.modeEdition && <>
                                <Tooltip title="Valider la saisie et continuer sur une autre saisie">
                                    <Button id="btnValidContinue" color="primary" onClick={this.handleSubmitForm} >Valider et continuer</Button>
                                </Tooltip>
                                <Tooltip title="Valider la saisie et fermer le formulaire">
                                    <Button id="btnValidClose" color="success" onClick={this.handleSubmitForm} >{!this.props.modeEdition ? "Valider et fermer" : "Valider" }</Button>
                                </Tooltip>
                            </> }
                            { this.props.modeEdition &&
                                <Tooltip title="Valider la modification">
                                    <Button id="btnValidModif" color="success" onClick={this.handleSubmitForm} >Valider</Button>
                                </Tooltip>
                            }
                        </ButtonGroup>
                    </DialogActions>
                </Dialog>
            </>
        )
    }
}