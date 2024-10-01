import React, {useEffect, useState} from "react";

import {Box, Chip, CircularProgress, Divider, Grid2, Stack, Switch} from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import GraphAnalyses from "../graphs/GraphAnalyses.component";
import AnalyseTitre from "./AnalyseCategoriesTitre.component";
import CompteBancaireModel from "../../../Models/CompteBancaire.model";
import { loadBudget } from "./AnalyseCategories.extservices";
import BudgetMensuelModel from "../../../Models/BudgetMensuel.model";
import { getOperationStateColor } from "../../../Utils/renderers/OperationItem.renderer";
import { OPERATION_ETATS_ENUM } from "../../../Utils/AppBusinessEnums.constants";
import { handleCategorieSelect, handleSsCategorieSelect, selectEtatOperation, selectTypeOperation } from "./AnalyseCategories.controller";
import AnalyseCategoriesListe from "./listeCategories/AnalyseCategoriesListe.component";


interface AnalyseCategoriesProps {
    selectedCompte: CompteBancaireModel,
    selectedDate: Date,
    onOpenMenu: () => void
}

/**
 * Page principale d'une analyse
 */

export const AnalyseCategories: React.FC<AnalyseCategoriesProps> = ({ selectedCompte, selectedDate, onOpenMenu }: AnalyseCategoriesProps): JSX.Element => {


    /**
     * États pour la page Analyse
     */
    const [currentBudget, setCurrentBudget] = useState<BudgetMensuelModel>();
    const [resumeSelectedCategorie, setResumeSelectedCategorie] = useState<any>(null);
    const [resumeSelectedSsCategorie, setResumeSelectedSsCategorie] = useState<any>(null);
    const [analysesGroupedByCategories, setAnalysesGroupedByCategories] = useState<any>(null);
    const [selectedTypeAnalyse, setSelectedTypeAnalyse] = useState<string>("REALISEE_DEPENSE");


    /** Chargement des catégories **/
    useEffect(() => {
        loadBudget(selectedCompte, selectedDate);
    }, [selectedCompte, selectedDate]);



    /**
     * Render du budget
     */

        return (
            <Box sx={{overflow: "hidden"}} maxHeight={"true"}>
                <Grid2 container marginTop={1} sx={{overflow: "hidden"}}>
                    <Grid2 size={{md: 2}}><MenuIcon onClick={onOpenMenu} className={"editableField"}
                                            fontSize={"large"}/></Grid2>
                    <Grid2 size={{md: 7}}>
                        {
                            currentBudget !== null && totauxGroupedByEtat !== null ?
                            <AnalyseTitre currentCompte={selectedCompte}
                                          currentDate={selectedDate}
                                          totalOperations={totauxGroupedByEtat[selectedTypeAnalyse]}/> :
                            <CircularProgress/>
                        }
                    </Grid2>
                    <Grid2 size={{md: 3}}>
                        <Stack direction={"row-reverse"} alignItems={"end"}>
                            <Chip label={"Crédit"} variant="outlined" className={"text-CREDIT"}/>
                            <Switch onClick={selectTypeOperation}/>
                            <Chip label={" Débit"} variant="outlined" className={"text-DEPENSE"}/>

                            <Chip label={"Réalisée"} variant="outlined"
                                  sx={{color: getOperationStateColor(OPERATION_ETATS_ENUM.REALISEE)}}/>
                            <Switch defaultChecked onClick={selectEtatOperation}/>
                            <Chip label={"Prévue"} variant="outlined"
                                  sx={{color: getOperationStateColor(OPERATION_ETATS_ENUM.PREVUE)}}/>
                        </Stack>
                    </Grid2>
                </Grid2>
                <Divider variant="middle" sx={{margin: 1}}/>
                <Grid2 container sx={{overflow: "hidden"}}>
                    <Grid2 size={{md: 3}} direction={"column"} sx={{overflow: "hidden"}} maxHeight={"true"}>
                        { /** Liste des résumés par catégories **/
                            (currentBudget != null ?
                                    <AnalyseCategoriesListe
                                        rangSelectedCategorie={null}
                                        typeAnalyse={selectedTypeAnalyse}
                                        analysesGroupedByCategories={analysesGroupedByCategories}
                                        selectCategorie={handleCategorieSelect}/>
                                    :
                                    <CircularProgress/>
                            )
                        }
                    </Grid2>
                    <Grid2 size={{md: 3}} direction={"column"} sx={{overflow: "hidden"}} maxHeight={"true"}>
                        { /** Liste des sous-catégories **/
                            (currentBudget !== null && resumeSelectedCategorie !== null ?
                                    <AnalyseCategoriesListe
                                        rangSelectedCategorie={rangSelectedCategorie}
                                        typeAnalyse={selectedTypeAnalyse}
                                        analysesGroupedByCategories={resumeSelectedCategorie.resumesSsCategories}
                                        selectCategorie={handleSsCategorieSelect}/>
                                    :
                                    <></>
                            )
                        }
                    </Grid2>
                    <Grid2 size={{md: 6}} sx={{overflow: "hidden", height: window.innerHeight - 175}}>
                        {currentBudget != null ?
                            <GraphAnalyses
                                typeAnalyse={selectedTypeAnalyse}
                                analysesGroupedByCategories={analysesGroupedByCategories}
                                resumeSelectedCategorie={resumeSelectedCategorie}
                                resumeSelectedSsCategorie={resumeSelectedSsCategorie}/>
                            :
                            <CircularProgress/>
                        }
                    </Grid2>
                </Grid2>
            </Box>
        )

}