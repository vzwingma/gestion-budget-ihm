import React, {Component} from "react";

import BudgetActionsButtonGroupComponent from "./actions/BudgetActionsButtonGroup.component";
import * as Controller from './Budget.controller'
import * as Services from './Budget.extservices'
import Grid2 from "@mui/material/Unstable_Grid2";
import BudgetTitre from "./BudgetTitre.component";
import {Box, CircularProgress, Divider, InputBase, Paper} from "@mui/material";
import OperationDetailPage from "../operations/detail/OperationDetailPage.component";
import MenuIcon from '@mui/icons-material/Menu';
import OperationsListe from "../operations/OperationsListe.component";
import PropTypes from "prop-types";
import {SearchRounded} from "@mui/icons-material";

/**
 * Page principale des budgets
 * @param selectedCompte : object compte sélectionné
 * @param selectedDate : object date sélectionnée
 * @param listeComptes : array liste des comptes
 * @param onOpenMenu : function callback d'ouverture du menu
 */
export default class Budget extends Component {


    /** Etats pour la page Budget **/
    state = {
        currentBudget: null,
        user_droits: null,
        currentOperation: null,
        operationsGroupedByDateOperation: null,

        selectedCompte: this.props.selectedCompte,
        selectedDate: this.props.selectedDate,

        filterOperations: null,
        categories: null
    }


    /** Constructeur **/
    constructor(props){
        super(props);

        this.handleBudgetUpdate = Controller.handleBudgetUpdate.bind(this);

        this.handleOperationSelect = Controller.handleOperationSelect.bind(this);
        this.handleButtonCreateClick = Controller.handleButtonCreateClick.bind(this);
        this.handleOperationFilter = Controller.handleOperationFilter.bind(this);
        this.createNewOperation = Controller.createNewOperation.bind(this);

        this.refreshBudget = Services.reloadBudget.bind(this);
        this.loadCategories = Services.loadCategories.bind(this);
        this.categoriesLoaded = Services.categoriesLoaded.bind(this);

        this.getPreferenceUtilisateur = Services.getPreferenceUtilisateur.bind(this);


    }


    /** Chargement des catégories **/
    componentDidMount(){
        this.loadCategories();
        this.getPreferenceUtilisateur();
        this.refreshBudget(this.props.selectedCompte.id, this.props.selectedDate);
    }


    /**
     * Mise à jour du contexte de budget
     * @param nextProps next Props
     * @param nextStates nexte States
     * @param {any} nextContext  next Context
     * @returns {boolean} s'il faut mettre à jour
     */
    shouldComponentUpdate(nextProps, nextStates, nextContext) {

        let componentUpdate = false;
        if (this.state.currentBudget !== nextStates.currentBudget) {
            console.log("[TRIGGER] Context budget=" + nextStates.currentBudget.id )
            componentUpdate = true;
        }
        if (this.state.currentOperation !== nextStates.currentOperation) {
            console.log("[TRIGGER] Context operation=" + (nextStates.currentOperation !== null ? nextStates.currentOperation.id : "Nouvelle opération"))
            componentUpdate = true;
        }
        if (this.state.filterOperations !== nextStates.filterOperations) {
            componentUpdate = true;
        }
        return componentUpdate;
    }


    /**
     * Render du budget
     */
    render() { return (
        <Box sx={{overflow: "hidden"}} maxHeight>
            <Grid2 container marginTop={1} sx={{overflow: "hidden"}}>
                <Grid2 md={0.3}><MenuIcon onClick={this.props.onOpenMenu} className={"editableField"}
                                          fontSize={"large"}/></Grid2>
                <Grid2 md={2.7} paddingTop={"6px"}>
                    <Paper component="form"
                           sx={{p: '2px 4px', display: 'flex', alignItems: 'center', width: '100%'}}>
                        <InputBase
                            sx={{ml: 1, flex: 1, color: "#808080"}}
                            placeholder="Filtrage des opérations"
                            inputProps={{'aria-label': 'Filtrage des opérations'}}
                            onChange={this.handleOperationFilter}
                        />
                        <SearchRounded/>
                    </Paper>
                </Grid2>
                <Grid2 md={2}></Grid2>
                <Grid2 md={6}>
                    { /** Titre **/}
                    {this.state.currentBudget != null ?
                        <BudgetTitre currentCompte={this.props.selectedCompte}
                                     currentDate={this.props.selectedDate}
                                     currentBudget={this.state.currentBudget}/> : <CircularProgress/>
                    }
                </Grid2>
                <Grid2 md={1}>
                    {/** Actions sur le budget (close / reinit) **/
                        (this.state.currentBudget != null && this.state.user_droits != null) ?
                            <BudgetActionsButtonGroupComponent budget={this.state.currentBudget}
                                                               droits={this.state.user_droits}
                                                               onActionBudgetChange={this.handleBudgetUpdate}
                                                               onActionOperationCreate={this.handleButtonCreateClick}/> :
                            <CircularProgress/>
                    }
                </Grid2>
            </Grid2>
            <Divider variant="middle" sx={{margin: 1}}/>
            <Grid2 container sx={{overflow: "hidden"}}>
                <Grid2 md={4} direction={"column"} sx={{overflow: "hidden"}} maxHeight>
                    { /** Liste des opérations **/
                        (this.state.currentBudget != null ?
                                <OperationsListe operationGroupedByDate={this.state.operationsGroupedByDateOperation}
                                                 filterOperations={this.state.filterOperations}
                                                 listeComptes={this.props.listeComptes}
                                                 onClick={this.handleOperationSelect}/>
                                :
                                <CircularProgress/>
                        )
                    }
                </Grid2>
                <Grid2 md={8} sx={{overflow: "hidden", height: window.innerHeight - 175}}>
                        {this.state.currentBudget != null && this.state.currentOperation != null ?
                            /** Affichage d'une opération **/
                            <OperationDetailPage operation={this.state.currentOperation}
                                                 budget={this.state.currentBudget}
                                                 listeCategories={this.state.categories}
                                                 listeComptes={this.props.listeComptes}
                                                 onOperationChange={this.handleBudgetUpdate}/>
                            : <></>
                        }
                </Grid2>
            </Grid2>
        </Box>
    )
    }
}

Budget.propTypes = {
    selectedCompte: PropTypes.object.isRequired,
    selectedDate: PropTypes.object.isRequired,
    listeComptes: PropTypes.array.isRequired,
    onOpenMenu: PropTypes.func.isRequired
}
