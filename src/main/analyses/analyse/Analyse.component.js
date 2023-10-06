import React, {Component} from "react";

import * as Controller from './Analyse.controller'
import * as Services from './Analyse.extservices'
import Grid2 from "@mui/material/Unstable_Grid2";
import {Box, CircularProgress, Divider} from "@mui/material";
import OperationDetailPage from "../../budgets/operations/detail/OperationDetailPage.component";
import MenuIcon from '@mui/icons-material/Menu';
import CategoriesListe from "../categories/CategoriesListe.component";


/**
 * Page principale d'une analyse
 */
export default class Analyse extends Component {


    /** Etats pour la page Budget **/
    state = {
        currentBudget: null,
        currentOperation: null,
        operationsGroupedByCategories: null,

        selectedCompte: this.props.selectedCompte,
        selectedDate: this.props.selectedDate,

        categories: null
    }


    /** Constructeur **/
    constructor(props) {
        super(props);
        this.loadBudget = Services.reloadBudget.bind(this);
        this.calculateResumes = Controller.calculateResumes.bind(this);
        this.createNewResumeCategorie = Controller.createNewResumeCategorie.bind(this);
        this.populateCategorie = Controller.populateCategorie.bind(this);
    }


    /** Chargement des catégories **/
    componentDidMount() {
        this.loadBudget(this.props.selectedCompte.id, this.props.selectedDate);
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
            console.log("[TRIGGER] Context budget=" + nextStates.currentBudget.id)
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
    render() {
        return (
            <Box sx={{overflow: "hidden"}} maxHeight>
                <Grid2 container marginTop={1} sx={{overflow: "hidden"}}>
                    <Grid2 md={4}><MenuIcon onClick={this.props.onOpenMenu} className={"editableField"}/></Grid2>
                    <Grid2 md={7}>

                    </Grid2>
                    <Grid2 md={1}>

                    </Grid2>
                </Grid2>
                <Divider variant="middle" sx={{margin: 1}}/>
                <Grid2 container sx={{overflow: "hidden"}}>
                    <Grid2 md={4} direction={"column"} sx={{overflow: "hidden"}} maxHeight>
                        { /** Liste des catégories **/
                            (this.state.currentBudget != null ?
                                    <CategoriesListe
                                        operationsGroupedByCategories={this.state.operationsGroupedByCategories}/>
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
                                                 onOperationChange={this.calculateResumes}/>
                            : <></>
                        }
                    </Grid2>
                </Grid2>
            </Box>
        )
    }
}
