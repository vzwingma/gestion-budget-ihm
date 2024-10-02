import React, { useEffect, useState } from "react";

import { Box, Checkbox, CircularProgress, Divider, FormControlLabel, Grid2, } from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';

import { loadSoldesBudgets } from "./AnalyseTemporelle.extservices";
import SoldesMensuelModel from "../../../Models/analyses/temporelles/SoldeMensuel.model";
import AnalyseSoldesCategorie from "../../../Models/analyses/temporelles/AnalyseSoldesCategorie.model";
import AnalyseTemporelleTitre from "./AnalyseTemporelleTitre.component";
import AnalyseTemporelleFiltre from "./AnalyseTemporelleFiltre.component";
import { CheckCircle, RadioButtonUnchecked } from "@mui/icons-material";
import GraphAnalyseTemporelle from "../graphs/GraphAnalyseTemporelle.component";
import { AnalyseTemporelleProps, DataCalculationTemporelResultsProps } from "../../Components.props";
import CenterComponent from "../../CenterComponent";
import { AnalyseSoldesTimelineItemModel } from "../../../Models/analyses/temporelles/AnalyseSoldesTimelineItem.model";
import { AnalyseCategorieTimelineItem } from "../../../Models/analyses/temporelles/AnalyseCategorieTimelineItem.model";



/**
 * Tuile  d'une liste d'opérations
 * @param operationGroupedByDate opérations groupées par date d'opérations
 * @param filterOperations filtre des opérations
 * @param listeComptes liste des comptes
 * @param onClick action lors du click
 * @returns {JSX.Element} tuile
 * @constructor constructeur
 *
 */
export const AnalyseTemporelle: React.FC<AnalyseTemporelleProps> = ({ selectedCompte, onOpenMenu }: AnalyseTemporelleProps): JSX.Element => {


    /** Etats pour la page Budget **/
    const [anneeAnalyses, setAnneeAnalyses] = useState<number>(new Date().getFullYear());
    const [soldesMensuels, setSoldesMensuels] = useState<SoldesMensuelModel[]>();
    
    const [analyseSoldesCategoriesData, setAnalyseSoldesCategoriesData] = useState<AnalyseSoldesCategorie[] | null>(null);
    const [timelinesByCategories, setTimelinesByCategories] = useState<{ [key: string]: AnalyseCategorieTimelineItem }[] | null>(null);
    const [timelinesPrevisionnellesByCategories, setTimelinesPrevisionnellesByCategories] = useState<{ [key: string]: AnalyseCategorieTimelineItem }[] | null>(null);

    const [timelinesSoldes, setTimelinesSoldes] = useState<AnalyseSoldesTimelineItemModel[] | null>(null);
    const [timelinesPrevisionnellesSoldes, setTimelinesPrevisionnellesSoldes] = useState<AnalyseSoldesTimelineItemModel[] | null>(null);

    const [filterSoldesActive, setFilterSoldesActive] = useState<boolean>(false);

    const [_, setFilterChange] = useState<number>(new Date().getTime());
    /** Chargement des catégories **/
    useEffect(() => {
        console.log("[TRIGGER] Context selectedCompte :", selectedCompte?.id, "selectedDate :", anneeAnalyses, "listeCategories :", analyseSoldesCategoriesData);
        loadSoldesBudgets(selectedCompte, anneeAnalyses, handleDataCalculationResult);
    }, [selectedCompte, anneeAnalyses, analyseSoldesCategoriesData]);


    /**
     * Gère les résultats du calcul des données.
     * @param {Object} param0 - Les résultats du calcul des données.
     */
    function handleDataCalculationResult({  soldesMensuelsData,
                                            soldesCategoriesData,
                                            timelinesByCategoriesData,
                                            timelinesPrevisionnellesByCategoriesData,
                                            timelinesSoldesData,
                                            timelinesPrevisionnellesSoldesData }: DataCalculationTemporelResultsProps) 
    {
        setSoldesMensuels(soldesMensuelsData);
        setAnalyseSoldesCategoriesData(soldesCategoriesData);

        setTimelinesByCategories(timelinesByCategoriesData);
        setTimelinesPrevisionnellesByCategories(timelinesPrevisionnellesByCategoriesData);
        
        setTimelinesSoldes(timelinesSoldesData);
        setTimelinesPrevisionnellesSoldes(timelinesPrevisionnellesSoldesData);
    }


    /**
     * Gère le changement de filtre.
     *
     * Cette fonction met à jour l'état de l'application pour refléter les modifications apportées au filtre.
     * Elle trouve la catégorie dans l'état qui correspond à l'id de la cible de l'événement et met à jour sa propriété 'filterActive'.
     * Elle met ensuite à jour l'état avec la nouvelle liste de catégories et l'heure actuelle comme 'filterChange'.
     *
     * @param {Object} event - L'objet d'événement du changement de filtre. La cible de cet événement est censée avoir une propriété 'id' qui correspond à un id de catégorie et une propriété 'checked' qui représente le nouvel état du filtre.
     */
    function onFilterChange(event: any) {
        let listeCategoriesUpdated = analyseSoldesCategoriesData;
        if (listeCategoriesUpdated) {
            const categorie = listeCategoriesUpdated.find((categorie: AnalyseSoldesCategorie) => categorie.id === event.target.id);
            if (categorie) {
                categorie.filterActive = event.target.checked;
            }
            setAnalyseSoldesCategoriesData(listeCategoriesUpdated);
            setFilterChange(new Date().getTime());
        }
    }

    /**
     * Gère le changement de filtre pour les soldes.
     * @param {Object} event - L'objet d'événement du changement de filtre pour les soldes.
     */
    function onFilterSoldesChange(event: any) {
        setFilterSoldesActive(event.target.checked);
        setFilterChange(new Date().getTime());
    }



    /**
     * Render du budget
     */
    return (
        <Box sx={{ overflow: "hidden" }} >
            <Grid2 container marginTop={1} sx={{ overflow: "hidden" }}>
                <Grid2 size={{ md: 2 }}><MenuIcon onClick={onOpenMenu} className={"editableField"}
                    fontSize={"large"} /></Grid2>
                <Grid2 size={{ md: 8 }}>
                    {soldesMensuels !== null && selectedCompte != null ?
                        <AnalyseTemporelleTitre currentCompte={selectedCompte}
                            currentAnnee={anneeAnalyses}
                            onAnneeChange={setAnneeAnalyses} />
                        :
                        <CenterComponent><CircularProgress /></CenterComponent>
                    }
                </Grid2>
                <Grid2 size={{ md: 2 }} direction={"row-reverse"}>
                    {   analyseSoldesCategoriesData != null ?
                            <>
                                <AnalyseTemporelleFiltre listeCategories={analyseSoldesCategoriesData}
                                    onFilterChange={onFilterChange} />
                                <FormControlLabel id="Soldes" key="Soldes" label="Soldes"
                                    control={<Checkbox id="Soldes" defaultChecked={false}
                                        icon={<RadioButtonUnchecked />}
                                        checkedIcon={<CheckCircle />} />}
                                    style={{ color: "#FFFFFF" }}
                                    onChange={onFilterSoldesChange} />
                            </>
                            :
                            <CenterComponent><CircularProgress /></CenterComponent> }
                </Grid2>
            </Grid2>
            <Divider variant="middle" sx={{ margin: 1 }} />
            <Grid2 size={{ md: 5 }} sx={{ overflow: "hidden", height: window.innerHeight - 175 }}>
                {soldesMensuels != null ?
                    <GraphAnalyseTemporelle
                        anneeAnalyses={anneeAnalyses}
                        timelinesByCategoriesData={timelinesByCategories || []}
                        timelinesSoldesData={timelinesSoldes || []}
                        timelinesPrevisionnellesByCategoriesData={timelinesPrevisionnellesByCategories || []}
                        timelinesPrevisionnellesSoldesData={timelinesPrevisionnellesSoldes || []}
                        filterSoldesActive={filterSoldesActive}
                        analyseSoldesCategoriesData={analyseSoldesCategoriesData || []} />
                    :
                    <CenterComponent><CircularProgress /></CenterComponent>
                }
            </Grid2>
        </Box>
    )
}
