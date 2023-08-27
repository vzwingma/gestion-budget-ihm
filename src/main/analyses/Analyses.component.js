import React, {Component} from "react";

import DateRange from "../budgets/budgetsMenuBar/DateRange.component"
import ResumeSoldes from "../budgets/resume/ResumeSoldes.component"
import ResumeCategories from "../budgets/resume/categories/ResumeCategories.component"
import * as Controller from './Analyses.controller'
import * as Services from './Analyses.extservices'
import {ToastContainer} from "react-toastify";
import Grid2 from "@mui/material/Unstable_Grid2";

/*
 * Page principale des budgets
 */
export default class Analyses extends Component {


    /** Etats pour la page Budget **/
    state = {
        selectedCompte: null,
        selectedDate: new Date(new Date(Date.now()).getFullYear(), new Date(Date.now()).getMonth(), 1, 0, 0, 0),
        currentBudget: null,
        categories: null
    }


    /** Constructeur **/
    constructor(props) {
        super(props);
        this.handleCompteChange = Controller.handleCompteChange.bind(this);
        this.handleDateChange = Controller.handleDateChange.bind(this);
        this.handleBudgetUpdate = Controller.handleBudgetUpdate.bind(this);
        this.loadCategories = Services.loadCategories.bind(this);
        this.categoriesLoaded = Services.categoriesLoaded.bind(this);
        this.refreshBudget = Services.reloadBudget.bind(this);
    }

    /** Chargement des catégories **/
    componentDidMount() {
        this.loadCategories();
    }


    /** Appels WS vers pour charger la liste des opérations pour le mois et le budget **/
    // Mise à jour du contexte de budget
    shouldComponentUpdate(nextProps, nextStates) {
        let componentUpdate = false;
        let budgetUpdate;
        if (this.state.selectedCompte !== nextStates.selectedCompte) {
            console.log("[TRIGGER] Context compte=" + nextStates.selectedCompte)
            componentUpdate = true;
            budgetUpdate = true;
        } else if (this.state.selectedDate != null && nextStates.selectedDate != null &&
            (this.state.selectedDate.getTime() !== nextStates.selectedDate.getTime())) {
            console.log("[TRIGGER] Context date=" + nextStates.selectedDate.toLocaleDateString())
            componentUpdate = true;
            budgetUpdate = true;
        } else if (this.state.currentBudget !== nextStates.currentBudget) {
            console.log("[TRIGGER] Context budget=" + nextStates.currentBudget.id)
            componentUpdate = true;
            budgetUpdate = false;
        }
        if (budgetUpdate) {
            console.log("[TRIGGER] Update budget")
            this.refreshBudget(nextStates.selectedCompte, nextStates.selectedDate);
        }
        return componentUpdate;
    }


    /**
     * Render du budget
     */
    render() {
        return (
            <Grid2 container xl>
                <Grid2 xs={4}>

                </Grid2>
                <Grid2 xs={7}>
                    <DateRange onDateChange={this.handleDateChange} idCompte={this.state.selectedCompte}/>
                </Grid2>
                <Grid2 xs={4} direction={"column"}>
                    { /** Résumé des catégories **/}
                    {this.state.currentBudget != null ? <ResumeCategories currentBudget={this.state.currentBudget}
                                                                          categories={this.state.categories}/> : "Chargement..."}
                    { /** Soldes **/}
                    {this.state.currentBudget != null ?
                        <ResumeSoldes currentBudget={this.state.currentBudget}/> : "Chargement..."}
                </Grid2>
                <Grid2 xl={8}>
                    { /** Liste des opérations **/}
                </Grid2>

                <ToastContainer
                    position="bottom-left"
                    autoClose={1000}
                    hideProgressBar={false} newestOnTop={false} closeOnClick={false} rtl={false}
                    pauseOnFocusLoss draggable pauseOnHover
                />

            </Grid2>
        );
    }
}
