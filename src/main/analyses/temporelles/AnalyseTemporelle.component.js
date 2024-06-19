import React, {Component} from "react";

import * as Controller from './AnalyseTemporelle.controller'
import * as Services from './AnalyseTemporelle.extservices'
import Grid2 from "@mui/material/Unstable_Grid2";
import {Box, CircularProgress, Divider,} from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import PropTypes from "prop-types";
import AnalyseTemporelleTitre from "./AnalyseTemporelleTitre.component";
import GraphAnalyseTemporelle from "../graphs/GraphAnalyseTemporelle.component";
import AnalyseTemporelleFiltre from "./AnalyseTemporelleFiltre.component";

/**
 * Page principale d'une analyse
 */
export default class AnalyseTemporelle extends Component {


    /** Etats pour la page Budget **/
    state = {
        anneeAnalyses: new Date().getFullYear(),
        listeCategories: null,
        analysesGroupedByCategories: null,
    }


    /** Constructeur **/
    constructor(props) {
        super(props);
        this.loadBudgets = Services.loadBudgets.bind(this);
        this.calculateTimelines = Controller.calculateTimelines.bind(this);
        this.calculateTimeline = Controller.calculateTimelineCategories.bind(this);
        this.onAnneeChange = Controller.onAnneeChange.bind(this);
        this.onFilterChange = Controller.onFilterChange.bind(this);
    }


    /** Chargement des catégories **/
    componentDidMount() {
        this.loadBudgets(this.props.selectedCompte.id);
    }


    /**
     * Mise à jour du contexte de budget
     * @param nextProps next Props
     * @param nextStates next States
     * @param {any} nextContext  next Context
     * @returns {boolean} s'il faut mettre à jour
     */
    shouldComponentUpdate(nextProps, nextStates, nextContext) {

        let componentUpdate = false;
        if (this.state.currentBudgets !== nextStates.currentBudgets) {
            console.log("[TRIGGER] Context = " + nextProps.selectedCompte.id, nextStates.currentBudgets.length + " budgets")
            componentUpdate = true;
        }
        if (this.state.anneeAnalyses !== nextStates.anneeAnalyses) {
            console.log("[TRIGGER] Context = " + nextProps.anneeAnalyses)
            componentUpdate = true;
        }
        if (this.state.filterChange !== nextStates.filterChange) {
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
                    <Grid2 md={2}><MenuIcon onClick={this.props.onOpenMenu} className={"editableField"}
                                            fontSize={"large"}/></Grid2>
                    <Grid2 md={8}>
                        {this.state.currentBudgets !== null && this.state.analysesGroupedByCategories !== null ?
                            <AnalyseTemporelleTitre currentCompte={this.props.selectedCompte}
                                                    currentAnnee={this.state.anneeAnalyses}
                                                    onAnneeChange={this.onAnneeChange}/> :
                            <CircularProgress/>
                        }
                    </Grid2>
                    <Grid2 md={2} direction={"row-reverse"}>
                        {
                            this.state.listeCategories != null ?
                                <AnalyseTemporelleFiltre listeCategories={this.state.listeCategories}
                                                         onFilterChange={this.onFilterChange}/> : <CircularProgress/>
                        }
                    </Grid2>
                </Grid2>
                <Divider variant="middle" sx={{margin: 1}}/>
                <Grid2 md={5} sx={{overflow: "hidden", height: window.innerHeight - 175}}>
                        {this.state.currentBudgets != null ?
                            <GraphAnalyseTemporelle
                                anneeAnalyses={this.state.anneeAnalyses}
                                analysesGroupedByCategories={this.state.analysesGroupedByCategories}
                                timelinesSoldes={this.state.timelinesSoldes}
                                listeCategories={this.state.listeCategories}
                                id={"graphAnalyseTemporelle"}/>
                            :
                            <CircularProgress/>
                        }
                </Grid2>
            </Box>
        )
    }
}
// Properties Types
AnalyseTemporelle.propTypes = {
    selectedCompte: PropTypes.object.isRequired,
    onOpenMenu: PropTypes.func.isRequired,
}
