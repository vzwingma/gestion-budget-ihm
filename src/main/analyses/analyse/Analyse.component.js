import React, {Component} from "react";

import * as Controller from './Analyse.controller'
import * as Services from './Analyse.extservices'
import Grid2 from "@mui/material/Unstable_Grid2";
import {Box, CircularProgress, Divider} from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import CategoriesListe from "../categories/CategoriesListe.component";
import GraphAnalyses from "../graphs/GraphAnalyses.component";

/**
 * Page principale d'une analyse
 */
export default class Analyse extends Component {


    /** Etats pour la page Budget **/
    state = {
        currentBudget: null,
        resumeSelectedCategorie: null,
        resumeSelectedSsCategorie: null,

        analysesGroupedByCategories: null,

        selectedCompte: this.props.selectedCompte,
        selectedDate: this.props.selectedDate,
        selectedTypeAnalyse: "REALISEE_DEPENSE"
    }


    /** Constructeur **/
    constructor(props) {
        super(props);
        this.loadBudget = Services.loadBudget.bind(this);
        this.calculateResumes = Controller.calculateResumes.bind(this);
        this.createNewResumeCategorie = Controller.createNewResumeCategorie.bind(this);
        this.populateCategorie = Controller.populateCategorie.bind(this);

        this.handleCategorieSelect = Controller.handleCategorieSelect.bind(this);
        this.handleSsCategorieSelect = Controller.handleSsCategorieSelect.bind(this);

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
        } else if (this.state.resumeSelectedCategorie !== nextStates.resumeSelectedCategorie) {
            console.log("[TRIGGER] Context Resumé Catégorie=" + nextStates.resumeSelectedCategorie.categorie.id)
            componentUpdate = true;
        } else if (this.state.resumeSelectedSsCategorie !== nextStates.resumeSelectedSsCategorie) {
            if (nextStates.resumeSelectedSsCategorie !== null) {
                console.log("[TRIGGER] Context Resumé SsCatégorie=" + nextStates.resumeSelectedSsCategorie.categorie.id)
            }
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
                    <Grid2 md={2} direction={"column"} sx={{overflow: "hidden"}} maxHeight>
                        { /** Liste des catégories **/
                            (this.state.currentBudget != null ?
                                    <CategoriesListe
                                        rangSelectedCategorie={null}
                                        typeAnalyse={this.state.selectedTypeAnalyse}
                                        analysesGroupedByCategories={this.state.analysesGroupedByCategories}
                                        selectCategorie={this.handleCategorieSelect}/>
                                    :
                                    <CircularProgress/>
                            )
                        }
                    </Grid2>
                    <Grid2 md={2} direction={"column"} sx={{overflow: "hidden"}} maxHeight>
                        { /** Liste des sous-catégories **/
                            (this.state.currentBudget !== null && this.state.resumeSelectedCategorie !== null ?
                                    <CategoriesListe
                                        rangSelectedCategorie={this.state.rangSelectedCategorie}
                                        typeAnalyse={this.state.selectedTypeAnalyse}
                                        analysesGroupedByCategories={this.state.resumeSelectedCategorie.resumesSsCategories}
                                        selectCategorie={this.handleSsCategorieSelect}/>
                                    :
                                    <></>
                            )
                        }
                    </Grid2>
                    <Grid2 md={8} sx={{overflow: "hidden", height: window.innerHeight - 175}}>
                        {this.state.currentBudget != null ?
                            <GraphAnalyses
                                typeAnalyse={this.state.selectedTypeAnalyse}
                                analysesGroupedByCategories={this.state.analysesGroupedByCategories}
                                resumeSelectedCategorie={this.state.resumeSelectedCategorie}
                                resumeSelectedSsCategorie={this.state.resumeSelectedSsCategorie}/>
                            :
                            <CircularProgress/>
                        }
                    </Grid2>
                </Grid2>
            </Box>
        )
    }
}
