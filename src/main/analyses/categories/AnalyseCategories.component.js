import React, {Component} from "react";

import * as Controller from './AnalyseCategories.controller'
import * as Services from './AnalyseCategories.extservices'
import Grid2 from "@mui/material/Unstable_Grid2";
import {Box, Chip, CircularProgress, Divider, Stack, Switch} from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import AnalyseCategoriesListe from "./listeCategories/AnalyseCategoriesListe.component";
import GraphAnalyses from "../graphs/GraphAnalyses.component";
import AnalyseTitre from "./AnalyseCategoriesTitre.component";
import PropTypes from "prop-types";
import * as Renderer from "../../Utils/renderers/OperationItem.renderer";
import {OPERATION_ETATS_ENUM} from "../../Utils/AppBusinessEnums.constants";

/**
 * Page principale d'une analyse
 */
export default class AnalyseCategories extends Component {


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

        this.handleCategorieSelect = Controller.handleCategorieSelect.bind(this);
        this.handleSsCategorieSelect = Controller.handleSsCategorieSelect.bind(this);

        this.selectEtatOperation = Controller.selectEtatOperation.bind(this);
        this.selectTypeOperation = Controller.selectTypeOperation.bind(this);
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
            componentUpdate = true;
        } else if (this.state.resumeSelectedSsCategorie !== nextStates.resumeSelectedSsCategorie) {
            componentUpdate = true;
        } else if (this.state.selectedTypeAnalyse !== nextStates.selectedTypeAnalyse) {
            if (nextStates.selectedTypeAnalyse !== null) {
                console.log("[TRIGGER] Context TypeAnalyse=" + nextStates.selectedTypeAnalyse)
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
                    <Grid2 md={2}><MenuIcon onClick={this.props.onOpenMenu} className={"editableField"}
                                            fontSize={"large"}/></Grid2>
                    <Grid2 md={7}>
                        {this.state.currentBudget !== null && this.state.totauxGroupedByEtat !== null ?
                            <AnalyseTitre currentCompte={this.props.selectedCompte}
                                          currentDate={this.props.selectedDate}
                                          totalOperations={this.state.totauxGroupedByEtat[this.state.selectedTypeAnalyse]}/> :
                            <CircularProgress/>
                        }
                    </Grid2>
                    <Grid2 md={3}>
                        <Stack direction={"row-reverse"} alignItems={"end"}>
                            <Chip label={"Crédit"} variant="outlined" className={"text-CREDIT"}/>
                            <Switch onClick={this.selectTypeOperation}/>
                            <Chip label={" Débit"} variant="outlined" className={"text-DEPENSE"}/>

                            <Chip label={"Réalisée"} variant="outlined"
                                  sx={{color: Renderer.getOperationStateColor(OPERATION_ETATS_ENUM.REALISEE)}}/>
                            <Switch defaultChecked onClick={this.selectEtatOperation}/>
                            <Chip label={"Prévue"} variant="outlined"
                                  sx={{color: Renderer.getOperationStateColor(OPERATION_ETATS_ENUM.PREVUE)}}/>
                        </Stack>
                    </Grid2>
                </Grid2>
                <Divider variant="middle" sx={{margin: 1}}/>
                <Grid2 container sx={{overflow: "hidden"}}>
                    <Grid2 md={3} direction={"column"} sx={{overflow: "hidden"}} maxHeight>
                        { /** Liste des résumés par catégories **/
                            (this.state.currentBudget != null ?
                                    <AnalyseCategoriesListe
                                        rangSelectedCategorie={null}
                                        typeAnalyse={this.state.selectedTypeAnalyse}
                                        analysesGroupedByCategories={this.state.analysesGroupedByCategories}
                                        selectCategorie={this.handleCategorieSelect}/>
                                    :
                                    <CircularProgress/>
                            )
                        }
                    </Grid2>
                    <Grid2 md={3} direction={"column"} sx={{overflow: "hidden"}} maxHeight>
                        { /** Liste des sous-catégories **/
                            (this.state.currentBudget !== null && this.state.resumeSelectedCategorie !== null ?
                                    <AnalyseCategoriesListe
                                        rangSelectedCategorie={this.state.rangSelectedCategorie}
                                        typeAnalyse={this.state.selectedTypeAnalyse}
                                        analysesGroupedByCategories={this.state.resumeSelectedCategorie.resumesSsCategories}
                                        selectCategorie={this.handleSsCategorieSelect}/>
                                    :
                                    <></>
                            )
                        }
                    </Grid2>
                    <Grid2 md={6} sx={{overflow: "hidden", height: window.innerHeight - 175}}>
                        {this.state.currentBudget != null ?
                            <GraphAnalyses
                                typeAnalyse={this.state.selectedTypeAnalyse}
                                analysesGroupedByCategories={this.state.analysesGroupedByCategories}
                                resumeSelectedCategorie={this.state.resumeSelectedCategorie}
                                resumeSelectedSsCategorie={this.state.resumeSelectedSsCategorie} id={"grapheAnalyse"}/>
                            :
                            <CircularProgress/>
                        }
                    </Grid2>
                </Grid2>
            </Box>
        )
    }
}
// Properties Types
AnalyseCategories.propTypes = {
    selectedCompte: PropTypes.object.isRequired,
    selectedDate: PropTypes.object.isRequired,
    onOpenMenu: PropTypes.func.isRequired,
}
