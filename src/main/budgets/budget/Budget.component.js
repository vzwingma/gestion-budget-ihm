import React, {Component} from "react";

import {sortOperations} from "../../Utils/DataUtils.utils"
import BudgetActionsButtonGroupComponent from "./actions/BudgetActionsButtonGroup.component";
import * as Controller from './Budget.controller'
import * as Services from './Budget.extservices'
import Grid2 from "@mui/material/Unstable_Grid2";
import BudgetsSoldes from "./BudgetSoldes.component";
import {Box, CircularProgress, Divider, Stack} from "@mui/material";
import OperationItem from "../operations/OperationsListItem.component";
import OperationDetailPage from "../operations/OperationDetailPage.component";
import MenuIcon from '@mui/icons-material/Menu';
import CreateUpdateOperationForm from "../operations/createupdate/CreateUpdateOperationForm.component";


/**
 * Page principale des budgets
 */
export default class Budget extends Component {


    /** Etats pour la page Budget **/
    state = {
        currentBudget: null,
        currentOperation: null,
        categories: null,
        showModalCreate: false
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


    /**
     * Mise à jour du contexte de budget
     * @param nextProps next Props
     * @param nextStates nexte States
     * @param {any} nextContext  next Context
     * @returns {boolean} s'il faut mettre à jour
     */
    shouldComponentUpdate(nextProps, nextStates, nextContext) {
        let componentUpdate = false;
        let budgetUpdate;
        if (this.state.currentBudget !== nextStates.currentBudget) {
            console.log("[TRIGGER] Context budget=" + nextStates.currentBudget.id )
            componentUpdate = true;
            budgetUpdate = false;
        }
        if (this.state.currentOperation !== nextStates.currentOperation) {
            console.log("[TRIGGER] Context operation=" + (nextStates.currentOperation !== null ? nextStates.currentOperation.id : "Nouvelle opération"))
            componentUpdate = true;
            budgetUpdate = false;
        }
        if(budgetUpdate){
            console.log("[TRIGGER] refresh du budget")
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
                    <Box height={window.innerHeight - 195}>

                        {this.state.currentBudget != null ?
                            (this.state.currentOperation != null ?
                                /** Affichage d'une opération **/
                                <OperationDetailPage operation={this.state.currentOperation}
                                                     budget={this.state.currentBudget}
                                                     onActionOperationChange={this.handleBudgetUpdate}/>

                                : this.state.showModalCreate &&
                                /** Création d'une opération **/
                                <CreateUpdateOperationForm idCompte={this.props.selectedCompte}
                                                           budget={this.state.currentBudget}
                                                           showModalCreate={this.state.showModalCreate}
                                                           modeEdition={this.state.idOperation !== null}
                                                           idOperation={this.state.idOperation}
                                                           hideModale={this.hideModale}
                                                           onOperationChange={this.props.onOperationChange}/>) :
                        <></>
                    }
                    </Box>
                </Grid2>
            </Grid2>
        </Box>
    )
    }
}
