import React, {Component} from "react";

import ComptesList from "../budgetsMenuBar/ComptesList.component"
import DateRange from "../budgetsMenuBar/DateRange.component"
import OperationsList from "../operations/OperationsTableList.component"

import BudgetActionsButtonGroupComponent from "./actions/BudgetActionsButtonGroup.component";
import * as Controller from './Budgets.controller'
import * as Services from './Budgets.extservices'
import {ToastContainer} from "react-toastify";
import Grid2 from "@mui/material/Unstable_Grid2";
import BudgetsSoldes from "./BudgetsSoldes.component";

/*
 * Page principale des budgets
 */
export default class Budgets extends Component {


    /** Etats pour la page Budget **/
        state = {
            selectedCompte : null,
            selectedDate :  new Date(new Date(Date.now()).getFullYear(), new Date(Date.now()).getMonth(), 1, 0, 0, 0),
            currentBudget: null,
            categories: null
        }



    /** Constructeur **/
    constructor(props){
        super(props);
        this.handleCompteChange = Controller.handleCompteChange.bind(this);
        this.handleDateChange = Controller.handleDateChange.bind(this);
        this.handleBudgetUpdate = Controller.handleBudgetUpdate.bind(this);

        this.refreshBudget = Services.reloadBudget.bind(this);
        this.loadCategories = Services.loadCategories.bind(this);
        this.categoriesLoaded = Services.categoriesLoaded.bind(this);

        this.getPreferenceUtilisateur = Services.getPreferenceUtilisateur.bind(this);
    }


    /** Chargement des catégories **/
    componentDidMount(){
        this.loadCategories();
        this.getPreferenceUtilisateur();
    }


    /** Appels WS vers pour charger la liste des opérations pour le mois et le budget **/
    // Mise à jour du contexte de budget
    shouldComponentUpdate(nextProps, nextStates){
        let componentUpdate = false;
        let budgetUpdate;
        if ((this.state.selectedCompte !== null && nextStates.selectedCompte !== null)
            && (this.state.selectedCompte !== nextStates.selectedCompte)) {
            console.log("[TRIGGER] Context compte=" + nextStates.selectedCompte.value)
            componentUpdate = true;
            budgetUpdate = true;
        }
        else if(this.state.selectedDate != null && nextStates.selectedDate != null &&
            (this.state.selectedDate.getTime() !== nextStates.selectedDate.getTime()))
        {
            console.log("[TRIGGER] Context date=" + nextStates.selectedDate.toLocaleDateString() )
            componentUpdate = true;
            budgetUpdate = true;
        }
        else if(this.state.currentBudget !== nextStates.currentBudget){
            console.log("[TRIGGER] Context budget=" + nextStates.currentBudget.id )
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
        <Grid2 container>
            <Grid2 md={4}>
                    <ComptesList onCompteChange={this.handleCompteChange} />
            </Grid2>
            <Grid2 md={7}>
                <DateRange onDateChange={this.handleDateChange}
                           idCompte={this.state.selectedCompte != null ? this.state.selectedCompte.value : null}/>
            </Grid2>
            <Grid2 md={1}>
                {/** Actions sur le budget (close / reinit) **/
                    (this.state.currentBudget != null && this.state.user_droits != null) ?
                        <BudgetActionsButtonGroupComponent budget={this.state.currentBudget} droits={this.state.user_droits} onActionBudgetChange={this.handleBudgetUpdate}/> : "Chargement...."
                }
            </Grid2>

            <Grid2  xs={4} direction={"column"}>
                { /** Soldes **/} { /** Liste des opérations **/}
                {this.state.currentBudget != null ? <><BudgetsSoldes currentCompte={this.state.selectedCompte}
                                                                     currentBudget={this.state.currentBudget}/><OperationsList
                    onOperationChange={this.handleBudgetUpdate}
                    budget={this.state.currentBudget}/></> : "Chargement..."}
            </Grid2>
            <Grid2 xl={8}>
            </Grid2>

            <ToastContainer
                position="bottom-left"
                autoClose={1000}
                hideProgressBar={false} newestOnTop={false} closeOnClick={false} rtl={false}
                pauseOnFocusLoss draggable pauseOnHover
            />

        </Grid2>
    ); }
}
