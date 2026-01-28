import React, { JSX, useEffect, useState } from "react";

import { Box, CircularProgress, Grid} from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import { AnalyseProps } from "../Components.props.ts";
import { CenterComponent } from "../CenterComponent.tsx";
import AnalysesTitre, { formatPeriode } from "./AnalysesTitre.component.tsx";
import { AnalysesPeriodeModel } from "../../Models/analyses/AnalysesPeriode.model.ts";
import AnalysesFiltres from "./AnalysesFiltres.component.tsx";
import { getHeightList } from "../../Utils/ListData.utils.tsx";




/**
 * Tuile  d'une liste d'opérations
 * @param operationGroupedByDate opérations groupées par date d'opérations
 * @returns {JSX.Element} tuile
 * @constructor constructeur
 *
 */
export const Analyses: React.FC<AnalyseProps> = ({ selectedCompte, onOpenMenu }: AnalyseProps): JSX.Element => {


    /** Etats pour la page Budget **/
    const [periodeAnalyses, setPeriodeAnalyses] = useState<AnalysesPeriodeModel>({
        vueAnnee: false,
        periodeDebut: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        periodeFin: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0)
    });


    /**
    const [soldesMensuels, setSoldesMensuels] = useState<SoldesMensuelModel[]>();

    const [analyseSoldesCategoriesData, setAnalyseSoldesCategoriesData] = useState<AnalyseSoldesCategorie[] | null>(null);
    const [timelinesByCategories, setTimelinesByCategories] = useState<{ [key: string]: AnalyseCategorieTimelineItem }[] | null>(null);
    const [timelinesPrevisionnellesByCategories, setTimelinesPrevisionnellesByCategories] = useState<{ [key: string]: AnalyseCategorieTimelineItem }[] | null>(null);

    const [timelinesSoldes, setTimelinesSoldes] = useState<AnalyseSoldesTimelineItemModel[] | null>(null);
    const [timelinesPrevisionnellesSoldes, setTimelinesPrevisionnellesSoldes] = useState<AnalyseSoldesTimelineItemModel[] | null>(null);

    const [filterSoldesActive, setFilterSoldesActive] = useState<boolean>(false);
 */
    const [filterChange, setFilterChange] = useState<number>(Date.now());

    /** Chargement des catégories **/
    useEffect(() => {
        console.log("[TRIGGER] Context selectedCompte :", selectedCompte?.id, "selectedPeriode :", formatPeriode(periodeAnalyses));
        //   loadSoldesBudgets(selectedCompte, anneeAnalyses, handleDataCalculationResult);
    }, [selectedCompte, periodeAnalyses]);


    useEffect(() => {
        console.debug("[TRIGGER] Filter change :", filterChange);
    }, [filterChange]);
    /**
     * Gère les résultats du calcul des données.
     * @param {Object} param0 - Les résultats du calcul des données.

    function handleDataCalculationResult({  soldesMensuelsData,
                                            soldesCategoriesData,
                                            timelinesByCategoriesData,
                                            timelinesPrevisionnellesByCategoriesData,
                                            timelinesSoldesData,
                                             timelinesPrevisionnellesSoldesData
                                         }: DataCalculationTendancesResultsProps)
    {
        setSoldesMensuels(soldesMensuelsData);
        setAnalyseSoldesCategoriesData(soldesCategoriesData);

        setTimelinesByCategories(timelinesByCategoriesData);
        setTimelinesPrevisionnellesByCategories(timelinesPrevisionnellesByCategoriesData);

        setTimelinesSoldes(timelinesSoldesData);
        setTimelinesPrevisionnellesSoldes(timelinesPrevisionnellesSoldesData);
    }
     */

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
        /*    let listeCategoriesUpdated = analyseSoldesCategoriesData;
            if (listeCategoriesUpdated) {
                const categorie = listeCategoriesUpdated.find((categorie: AnalyseSoldesCategorie) => categorie.id === event.target.id);
                if (categorie) {
                    categorie.filterActive = event.target.checked;
                }
                setAnalyseSoldesCategoriesData(listeCategoriesUpdated);
                setFilterChange(Date.now());
            } */
    }

    /**
     * Gère le changement de filtre pour les soldes.
     * @param {Object} event - L'objet d'événement du changement de filtre pour les soldes.
     */
    function onFilterSoldesChange(event: any) {
        //    setFilterSoldesActive(event.target.checked);
        setFilterChange(Date.now());
    }



    /**
     * Render du budget
     */
    return (
        <Box className="page-container tendances-page-container">
            <Grid container
                sx={{ overflow: "hidden", justifyContent: 'center', alignItems: 'center', display: 'flex' }}>
                <Grid size={{ md: 0.6, xl: 0.4 }}
                    sx={{ justifyContent: 'center', alignItems: 'center', display: 'flex' }}><MenuIcon
                        onClick={onOpenMenu} className={"editableField"} fontSize={"large"} /></Grid>
                <Grid size={{ md: 11.4, xl: 11.6 }} sx={{ justifyContent: 'center', alignItems: 'center', display: 'flex' }}>
                    {selectedCompte == null ?
                        <CenterComponent><CircularProgress /></CenterComponent>
                        :
                        <AnalysesTitre currentCompte={selectedCompte}
                            currentPeriode={periodeAnalyses} />
                    }
                </Grid>
                <Grid size={{ md: 4, xl: 4 }} direction={"column"} sx={{ overflow: "hidden" }} maxHeight={'true'}>
                    {selectedCompte == null ?
                        <CenterComponent><CircularProgress /></CenterComponent>
                        :
                        <AnalysesFiltres currentCompte={selectedCompte}
                            currentPeriode={periodeAnalyses} />
                    }
                </Grid>
                <Grid size={{ md: 8, xl: 8 }} sx={{ overflow: "hidden", height: getHeightList() }}>
                    <CenterComponent><CircularProgress /></CenterComponent>
                </Grid>
            </Grid>
        </Box>
    )
}
