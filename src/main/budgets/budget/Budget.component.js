import React, {Component} from "react";

import OperationsList from "../operations/OperationsTableList.component"
import {sortOperations} from "../../Utils/DataUtils.utils"
import BudgetActionsButtonGroupComponent from "./actions/BudgetActionsButtonGroup.component";
import * as Controller from './Budget.controller'
import * as Services from './Budget.extservices'
import {ToastContainer} from "react-toastify";
import Grid2 from "@mui/material/Unstable_Grid2";
import BudgetsSoldes from "./BudgetSoldes.component";
import {CircularProgress, Divider, Stack} from "@mui/material";
import OperationItem from "../operations/OperationItem.component";

/*
 * Page principale des budgets
 */
export default class Budget extends Component {


    /** Etats pour la page Budget **/
        state = {
            currentBudget: null,
            categories: null
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
        /**
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
        else **/
        if (this.state.currentBudget !== nextStates.currentBudget) {
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
        <>
        <Grid2 container>
            <Grid2 md={3}>---</Grid2>
            <Grid2 md={7}>
                { /** Soldes **/}
                {this.state.currentBudget != null ?
                    <BudgetsSoldes currentCompte={this.props.selectedCompte}
                                   currentBudget={this.state.currentBudget}/> : <CircularProgress/>
                }
            </Grid2>
            <Grid2 md={2} right={true}>
                {/** Actions sur le budget (close / reinit) **/
                    (this.state.currentBudget != null && this.state.user_droits != null) ?
                        <BudgetActionsButtonGroupComponent budget={this.state.currentBudget}
                                                           droits={this.state.user_droits}
                                                           onActionBudgetChange={this.handleBudgetUpdate}/> :
                        <CircularProgress/>
                }
            </Grid2>
        </Grid2>
            <Grid2 container sx={{overflowY: "scroll", maxHeight: (window.innerHeight - 150)}}>
            <Grid2 md={4} direction={"column"}>
                { /** Liste des opérations **/
                    (this.state.currentBudget != null ?
                        <Stack spacing={1} divider={<Divider orientation="horizontal" flexItem/>}>
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
                { /** Liste des opérations **/
                    (this.state.currentBudget != null ?
                        <OperationsList onOperationChange={this.handleBudgetUpdate}
                                        budget={this.state.currentBudget}/> : <CircularProgress/>)
                }
            </Grid2>
            </Grid2>
            <ToastContainer
                position="bottom-left"
                autoClose={1000}
                hideProgressBar={false} newestOnTop={false} closeOnClick={false} rtl={false}
                pauseOnFocusLoss draggable pauseOnHover
            />


        </>
    ); }
}
