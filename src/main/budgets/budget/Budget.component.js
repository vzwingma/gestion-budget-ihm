import React, {Component} from "react";

import BudgetActionsButtonGroupComponent from "./actions/BudgetActionsButtonGroup.component";
import * as Controller from './Budget.controller'
import * as Services from './Budget.extservices'
import Grid2 from "@mui/material/Unstable_Grid2";
import BudgetsSoldes from "./BudgetSoldes.component";
import {Box, CircularProgress, Divider} from "@mui/material";
import OperationDetailPage from "../operations/detail/OperationDetailPage.component";
import MenuIcon from '@mui/icons-material/Menu';
import OperationsListe from "../operations/OperationsListe.component";


/**
 * Page principale des budgets
 */
export default class Budget extends Component {


    /** Etats pour la page Budget **/
    state = {
        currentBudget: null,
        currentOperation: null,
        operationsGroupedByDateOperation: null,

        selectedCompte: this.props.selectedCompte,
        selectedDate: this.props.selectedDate,

        categories: null
    }


    /** Constructeur **/
    constructor(props){
        super(props);

        this.handleBudgetUpdate = Controller.handleBudgetUpdate.bind(this);

        this.handleOperationSelect = Controller.handleOperationSelect.bind(this);
        this.handleButtonCreateClick = Controller.handleButtonCreateClick.bind(this);

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
        return componentUpdate;
    }


    /**
     * Render du budget
     */
    render() { return (
        <Box sx={{overflow: "hidden"}}>
            <Grid2 container marginTop={1}>
                <Grid2 md={4}><MenuIcon onClick={this.props.onOpenMenu}/></Grid2>
                <Grid2 md={7}>
                    { /** Soldes **/}
                    {this.state.currentBudget != null ?
                        <BudgetsSoldes currentCompte={this.props.selectedCompte}
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
            <Grid2 container>
                <Grid2 md={4} direction={"column"}>
                    { /** Liste des opérations **/
                        (this.state.currentBudget != null ?
                                <OperationsListe operationGroupedByDate={this.state.operationsGroupedByDateOperation}
                                                 onClick={this.handleOperationSelect}/>
                                :
                                <CircularProgress/>
                        )
                    }
                </Grid2>
                <Grid2 md={8}>
                    <Box height={window.innerHeight - 195}>

                        {this.state.currentBudget != null && this.state.currentOperation != null ?
                            /** Affichage d'une opération **/
                            <OperationDetailPage operation={this.state.currentOperation}
                                                 budget={this.state.currentBudget}
                                                 listeCategories={this.state.categories}
                                                 onOperationChange={this.handleBudgetUpdate}/>
                            : <></>
                        }

                    </Box>
                </Grid2>
            </Grid2>
        </Box>
    )
    }
}
