import React, {JSX, useEffect, useState} from "react";

import {Box, Chip, CircularProgress, Divider, Grid, Stack, Switch, useMediaQuery, useTheme} from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import GraphAnalyses from "./graphs/GraphAnalyses.component";
import AnalyseTitre from "./AnalyseCategoriesTitre.component";
import {loadBudget} from "./AnalyseCategories.extservices";
import BudgetMensuelModel from "../../../Models/budgets/BudgetMensuel.model";
import {getOperationStateColor} from "../../../Utils/renderers/OperationItem.renderer";
import {OPERATION_ETATS_ENUM} from "../../../Utils/AppBusinessEnums.constants";
import {selectEtatOperation, selectTypeOperation} from "./AnalyseCategories.controller";
import AnalyseCategoriesListe from "./listeCategories/AnalyseCategoriesListe.component";
import AnalyseCategoriesModel from "../../../Models/analyses/categories/AnalyseCategories.model";
import CenterComponent from "../../CenterComponent";
import {AnalyseCategoriesProps, DataCalculationResultsProps} from "../../Components.props";


/**
 * Page principale d'une analyse
 */

export const AnalyseCategories: React.FC<AnalyseCategoriesProps> = ({ selectedCompte, selectedDate, onOpenMenu }: AnalyseCategoriesProps): JSX.Element => {

    /**
     * États pour la page Analyse
     */
    const [currentBudget, setCurrentBudget] = useState<BudgetMensuelModel>();
    const [analysesGroupedByCategories, setAnalysesGroupedByCategories] = useState<{ [key: string]: AnalyseCategoriesModel } | null>(null);
    const [totauxGroupedByEtat, setTotauxGroupedByEtat] = useState<{ [key: string]: number }>();

    const [rangSelectedCategorie, setRangSelectedCategorie] = useState<number | null>(null);
    const [resumeSelectedCategorie, setResumeSelectedCategorie] = useState<AnalyseCategoriesModel | null>(null);
    const [resumeSelectedSsCategorie, setResumeSelectedSsCategorie] = useState<AnalyseCategoriesModel | null>(null);
    const [selectedTypeAnalyse, setSelectedTypeAnalyse] = useState<string>("REALISEE_DEPENSE");
    const isMobile = useMediaQuery(useTheme().breakpoints.down('lg'));
    /** Chargement des catégories **/
    useEffect(() => {
        loadBudget(selectedCompte, selectedDate, handleDataCalculationResult);
    }, [selectedCompte, selectedDate]);

    /**
     * Résultats des calculs
     * @param param0 données de calcul
     */
    function handleDataCalculationResult({ currentBudget, analysesGroupedByCategories, totauxGroupedByEtat }: DataCalculationResultsProps) {
        setCurrentBudget(currentBudget);
        setAnalysesGroupedByCategories(analysesGroupedByCategories);
        setTotauxGroupedByEtat(totauxGroupedByEtat);
    }


    /**
     * Gère la sélection d'une catégorie
     * @param {number} rang - Le rang de la catégorie dans la liste
     * @param {Object} resumeSelectedCategorie - Le résumé de la catégorie sélectionnée
     */
    function handleCategorieSelect(resumeSelectedCategorie: AnalyseCategoriesModel, rang?: number) {
        if (rang !== undefined) {
            setRangSelectedCategorie(rang);
        }
        setResumeSelectedCategorie(resumeSelectedCategorie);
        setResumeSelectedSsCategorie(null);
    }

    /**
     * Gère la sélection d'une sous-catégorie
     * @param {Object} resumeSelectedSsCategorie - Le résumé de la sous-catégorie sélectionnée
     */
    function handleSsCategorieSelect(resumeSelectedSsCategorie: AnalyseCategoriesModel) {
        setResumeSelectedSsCategorie(resumeSelectedSsCategorie);
    }


    /**
     * Render du budget
     */

    return (
        <Box sx={{ overflow: "hidden" }} maxHeight={"true"}>
            <Grid container marginTop={1} sx={{justifyContent: 'center', alignItems: 'center', display: 'flex'}}>
                <Grid size={{md: 0.5, xl: 0.4}} sx={{justifyContent: 'center', alignItems: 'center', display: 'flex'}}>
                    <MenuIcon onClick={onOpenMenu} className={"editableField"} fontSize={"large"}/>
                </Grid>
                <Grid size={{md: 8, xl: 10.1}}>
                    {
                        currentBudget !== null && totauxGroupedByEtat !== null && selectedCompte !== null ?
                            <AnalyseTitre currentCompte={selectedCompte}
                                currentDate={selectedDate}
                                totalOperations={totauxGroupedByEtat?.[selectedTypeAnalyse] ?? 0} /> :
                            <CenterComponent><CircularProgress /></CenterComponent>
                    }
                </Grid>
                <Grid size={{md: 3.5, xl: 1.5}}
                      sx={{overflow: "hidden", justifyContent: 'center', alignItems: 'center', display: 'flex'}}>
                    <Stack direction={"row-reverse"} alignItems={"end"}>
                        <Chip label={"Crédit"} variant="outlined" size={isMobile ? "small" : "medium"}
                              className={"text-CREDIT"} style={{height: isMobile ? 20 : 40}}/>
                        <Switch onClick={e => selectTypeOperation(e, selectedTypeAnalyse, setSelectedTypeAnalyse)}
                                size={isMobile ? "small" : "medium"}/>
                        <Chip label={" Débit"} variant="outlined" size={isMobile ? "small" : "medium"}
                              className={"text-DEPENSE"} style={{height: isMobile ? 20 : 40, marginLeft: 10}}/>

                        <Chip label={"Réalisée"} variant="outlined" size={isMobile ? "small" : "medium"}
                              sx={{color: getOperationStateColor(OPERATION_ETATS_ENUM.REALISEE)}}
                              style={{height: isMobile ? 20 : 40}}/>
                        <Switch defaultChecked
                                onClick={e => selectEtatOperation(e, selectedTypeAnalyse, setSelectedTypeAnalyse)}
                                size={isMobile ? "small" : "medium"}/>
                        <Chip label={"Prévue"} variant="outlined" size={isMobile ? "small" : "medium"}
                              sx={{color: getOperationStateColor(OPERATION_ETATS_ENUM.PREVUE)}}
                              style={{height: isMobile ? 20 : 40}}/>
                    </Stack>
                </Grid>
            </Grid>
            <Divider variant="middle" sx={{ margin: 1 }} />
            <Grid container sx={{overflow: "hidden"}}>
                <Grid size={{md: 3, xl: 3}} direction={"column"} sx={{overflow: "hidden"}} maxHeight={"true"}>
                    { /** Liste des résumés par catégories **/
                        (currentBudget != null ?
                            <AnalyseCategoriesListe
                                rangSelectedCategorie={null}
                                typeAnalyse={selectedTypeAnalyse}
                                analysesGroupedByCategories={analysesGroupedByCategories}
                                selectCategorie={handleCategorieSelect}
                            />
                            :
                            <CenterComponent><CircularProgress /></CenterComponent>
                        )
                    }
                </Grid>
                <Grid size={{md: 3, xl: 3}} direction={"column"} sx={{overflow: "hidden"}} maxHeight={"true"}>
                    { /** Liste des sous-catégories **/
                        (currentBudget !== null && resumeSelectedCategorie !== null ?
                            <AnalyseCategoriesListe
                                rangSelectedCategorie={rangSelectedCategorie}
                                typeAnalyse={selectedTypeAnalyse}
                                analysesGroupedByCategories={resumeSelectedCategorie.resumesSsCategories}
                                selectCategorie={handleSsCategorieSelect}
                            />
                            :
                            <></>
                        )
                    }
                </Grid>
                <Grid size={{md: 5.5, xl: 6}} sx={{overflow: "hidden"}} maxHeight={"true"}>
                    {currentBudget !== null && analysesGroupedByCategories !== null?
                        <GraphAnalyses
                            typeAnalyse={selectedTypeAnalyse}
                            analysesGroupedByCategories={analysesGroupedByCategories}
                            resumeSelectedCategorie={resumeSelectedCategorie}
                            resumeSelectedSsCategorie={resumeSelectedSsCategorie} />
                        :
                        <CenterComponent><CircularProgress /></CenterComponent>
                    }
                </Grid>
            </Grid>
        </Box>
    )
}
