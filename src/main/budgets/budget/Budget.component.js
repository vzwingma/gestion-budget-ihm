import React, {Component} from "react";

import {sortOperations} from "../../Utils/DataUtils.utils"
import BudgetActionsButtonGroupComponent from "./actions/BudgetActionsButtonGroup.component";
import * as Controller from './Budget.controller'
import * as Services from './Budget.extservices'
import Grid2 from "@mui/material/Unstable_Grid2";
import BudgetsSoldes from "./BudgetSoldes.component";
import {Box, CircularProgress, Divider, Stack} from "@mui/material";
import OperationItem from "../operations/OperationItem.component";
import OperationDetailItem from "../operations/OperationDetail.component";
import MenuIcon from '@mui/icons-material/Menu';

/**
 * Page principale des budgets
 */
export default class Budget extends Component {


    /** Etats pour la page Budget **/
        state = {
            currentBudget: null,
            currentOperation: null,
            categories: null,
            showModale: false
        }



    /** Constructeur **/
    constructor(props){
        super(props);

        this.handleBudgetUpdate = Controller.handleBudgetUpdate.bind(this);
        this.handleOperationSelect = Controller.handleOperationSelect.bind(this);
        this.refreshBudget = Services.reloadBudget.bind(this);
        this.loadCategories = Services.loadCategories.bind(this);
        this.categoriesLoaded = Services.categoriesLoaded.bind(this);

        this.getPreferenceUtilisateur = Services.getPreferenceUtilisateur.bind(this);

        this.setState({
            selectedCompte: this.props.selectedCompte,
            selectedDate: this.props.selectedDate
        });
    }


    /** Chargement des catégories **/
    componentDidMount(){
        this.loadCategories();
        this.getPreferenceUtilisateur();
        this.refreshBudget(this.props.selectedCompte.id, this.props.selectedDate);
    }


    /** Appels WS vers pour charger la liste des opérations pour le mois et le budget **/
    // Mise à jour du contexte de budget
    shouldComponentUpdate(nextProps, nextStates){
        let componentUpdate = false;
        let budgetUpdate;
        if (this.state.currentBudget !== nextStates.currentBudget) {
            console.log("[TRIGGER] Context budget=" + nextStates.currentBudget.id )
            componentUpdate = true;
            budgetUpdate = false;
        }
        if (this.state.currentOperation !== nextStates.currentOperation) {
            console.log("[TRIGGER] Context operation=" + nextStates.currentOperation.id)
            componentUpdate = true;
            budgetUpdate = false;
        }
        if(budgetUpdate){
            console.log("[TRIGGER] Update budget")
            this.refreshBudget(nextStates.selectedCompte !== null ? nextStates.selectedCompte.value : null, nextStates.selectedDate);
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
                                                               onActionBudgetChange={this.handleBudgetUpdate}/> :
                            <CircularProgress/>
                    }
                </Grid2>
            </Grid2>
            <Divider variant="middle" sx={{margin: 1}}/>
            <Grid2 container>
                <Grid2 md={4} direction={"column"}>
                    { /** Liste des opérations **/
                        (this.state.currentBudget != null ?
                            <Stack spacing={1} divider={<Divider orientation="horizontal" flexItem/>}
                                   sx={{overflowY: "auto", overflowX: "hidden"}} maxHeight={window.innerHeight - 195}>
                                {
                                    this.state.currentBudget.listeOperations
                                        .filter(operation => operation.etat !== "PLANIFIEE")
                                        .sort((ope1, ope2) => sortOperations(ope1, ope2))
                                        .map((operation) => (
                                            <OperationItem operation={operation} onClick={this.handleOperationSelect}/>
                                        ))
                                }
                            </Stack> : <CircularProgress/>)
                    }
                </Grid2>
                <Grid2 md={8}>
                    {this.state.currentOperation != null && this.state.currentBudget != null ?
                            <Box height={window.innerHeight - 195}>
                                <OperationDetailItem operation={this.state.currentOperation}
                                                     budget={this.state.currentBudget}
                                                     onActionOperationChange={this.handleBudgetUpdate}/>
                            </Box>
                        :
                        <></>
                    }
                </Grid2>
            </Grid2>
        </Box>
    )
    }
}
