import React, {useEffect, useState} from "react";

import {Box, Chip, CircularProgress, Divider, Grid2, Stack, Switch} from "@mui/material";
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
     * Gère la sélection d'une sous-catégorie - liste les opérations
     * @param resumeSelectedSsCategorie - Le résumé de la sous-catégorie sélectionnée
     */
    function handleDetailSsCategorieSelect(resumeSelectedSsCategorie: AnalyseCategoriesModel) {
        console.log("Sous-catégorie : " + resumeSelectedSsCategorie.categorie.libelle)
        for (let listeOperationsKey in resumeSelectedSsCategorie.listeOperations) {
            console.log("   ", resumeSelectedSsCategorie.listeOperations[listeOperationsKey].libelle, resumeSelectedSsCategorie.listeOperations[listeOperationsKey].valeur)
        }
    }

    /**
     * Render du budget
     */

    return (
        <Box sx={{ overflow: "hidden" }} maxHeight={"true"}>
            <Grid2 container marginTop={1} sx={{ overflow: "hidden" }}>
                <Grid2 size={{ md: 1.5 }}><MenuIcon onClick={onOpenMenu} className={"editableField"}
                    fontSize={"large"} /></Grid2>
                <Grid2 size={{ md: 7.5 }}>
                    {
                        currentBudget !== null && totauxGroupedByEtat !== null && selectedCompte !== null ?
                            <AnalyseTitre currentCompte={selectedCompte}
                                currentDate={selectedDate}
                                totalOperations={totauxGroupedByEtat?.[selectedTypeAnalyse] ?? 0} /> :
                            <CenterComponent><CircularProgress /></CenterComponent>
                    }
                </Grid2>
                <Grid2 size={{ md: 3 }}>
                    <Stack direction={"row-reverse"} alignItems={"end"} style={{ position: "relative",  top: "50%", transform: "translateY(-50%)"}}>
                        <Chip label={"Crédit"} variant="outlined" className={"text-CREDIT"} style={{ height: 40}}/>
                        <Switch onClick={e => selectTypeOperation(e, selectedTypeAnalyse, setSelectedTypeAnalyse)} />
                        <Chip label={" Débit"} variant="outlined" className={"text-DEPENSE"} style={{ height: 40, marginLeft: 10}} />

                        <Chip label={"Réalisée"} variant="outlined"
                            sx={{ color: getOperationStateColor(OPERATION_ETATS_ENUM.REALISEE) }} style={{ height: 40}} />
                        <Switch defaultChecked onClick={e => selectEtatOperation(e, selectedTypeAnalyse, setSelectedTypeAnalyse)} />
                        <Chip label={"Prévue"} variant="outlined"
                            sx={{ color: getOperationStateColor(OPERATION_ETATS_ENUM.PREVUE) }} style={{ height: 40}} />
                    </Stack>
                </Grid2>
            </Grid2>
            <Divider variant="middle" sx={{ margin: 1 }} />
            <Grid2 container sx={{ overflow: "hidden" }}>
                <Grid2 size={{ md: 3 }} direction={"column"} sx={{ overflow: "hidden" }} maxHeight={"true"}>
                    { /** Liste des résumés par catégories **/
                        (currentBudget != null ?
                            <AnalyseCategoriesListe
                                rangSelectedCategorie={null}
                                typeAnalyse={selectedTypeAnalyse}
                                analysesGroupedByCategories={analysesGroupedByCategories}
                                selectCategorie={handleCategorieSelect}
                                selectDetailCategorie={() => {
                                }}
                            />
                            :
                            <CenterComponent><CircularProgress /></CenterComponent>
                        )
                    }
                </Grid2>
                <Grid2 size={{ md: 3 }} direction={"column"} sx={{ overflow: "hidden" }} maxHeight={"true"}>
                    { /** Liste des sous-catégories **/
                        (currentBudget !== null && resumeSelectedCategorie !== null ?
                            <AnalyseCategoriesListe
                                rangSelectedCategorie={rangSelectedCategorie}
                                typeAnalyse={selectedTypeAnalyse}
                                analysesGroupedByCategories={resumeSelectedCategorie.resumesSsCategories}
                                selectCategorie={handleSsCategorieSelect}
                                selectDetailCategorie={handleDetailSsCategorieSelect}
                            />
                            :
                            <></>
                        )
                    }
                </Grid2>
                <Grid2 size={{ md: 6 }} sx={{ overflow: "hidden", height: window.innerHeight - 175 }}>
                    {currentBudget !== null && analysesGroupedByCategories !== null?
                        <GraphAnalyses
                            typeAnalyse={selectedTypeAnalyse}
                            analysesGroupedByCategories={analysesGroupedByCategories}
                            resumeSelectedCategorie={resumeSelectedCategorie}
                            resumeSelectedSsCategorie={resumeSelectedSsCategorie} />
                        :
                        <CenterComponent><CircularProgress /></CenterComponent>
                    }
                </Grid2>
            </Grid2>
        </Box>
    )
}
