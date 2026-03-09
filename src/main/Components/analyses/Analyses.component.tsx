import React, { JSX, useEffect, useMemo, useState } from "react";

import { Backdrop, Box, CircularProgress, Grid, Typography } from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import { AnalyseProps } from "../Components.props.ts";
import AnalysesTitre, { formatPeriode } from "./AnalysesTitre.component.tsx";
import { AnalysesPeriodeModel } from "../../Models/analyses/AnalysesPeriode.model.ts";
import AnalysesFiltres from "./AnalysesFiltres.component.tsx";
import { AnalyseSyntheseTypes } from "./syntheses/AnalyseSyntheseTypes.component.tsx";
import { applyFiltersToOperations, loadBudgetsPeriodes } from "./Analyses.controller.ts";
import CategorieOperationModel from "../../Models/budgets/CategorieOperation.model.ts";
import { AnalysesFiltersModel, getDefaultAnalysesFilters } from "../../Models/analyses/AnalysesFilters.model.ts";
import AnalyseOperationsListe from "./syntheses/AnalyseOperationsListe.component.tsx";
import { ExpandableDetailSection } from "../shared/ExpandableDetailSection.component.tsx";
import AnalyseCategoriesListe from "./syntheses/AnalyseCategoriesListe.component.tsx";
import { getCategoriesDataForAnalyses } from "./syntheses/AnalyseCategoriesListe.controller.ts";
import AnalyseTreeMap from "./syntheses/AnalyseTreeMap.component.tsx";
import AnalyseEvolution from "./syntheses/AnalyseEvolution.component.tsx";
import BudgetMensuelAnalyseConsolideModel from "../../Models/budgets/BudgetMensuel.analyse.consolide.model.ts";


/**
 * Composant Analyses - Page d'analyse budgétaire détaillée
 * 
 * Affiche une vue d'analyse complète du budget pour un compte sélectionné avec:
 * - Filtrage des opérations par catégories et types
 * - Synthèse par types d'opérations
 * - Représentation graphique en treemap des catégories
 * - Évolution temporelle des opérations
 * - Synthèse détaillée par catégories et opérations
 * 
 * @component
 * @param {AnalyseProps} props - Les props du composant
 * @param {CompteModel} props.selectedCompte - Le compte sélectionné pour l'analyse
 * @param {() => void} props.onOpenMenu - Callback pour ouvrir le menu latéral
 * @returns {JSX.Element} Le rendu du composant d'analyse
 */
export const Analyses: React.FC<AnalyseProps> = ({ selectedCompte, onOpenMenu }: AnalyseProps): JSX.Element => {


    /** Etats pour la page Budget **/
    const [periodeAnalyses, setPeriodeAnalyses] = useState<AnalysesPeriodeModel>({
        vuePeriode: false,
        periodeDebut: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        periodeFin: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0)
    });


    const [isLoading, setIsLoading] = useState<boolean>(true);

    const [filters, setFilters] = useState<AnalysesFiltersModel>(getDefaultAnalysesFilters());

    const [budgetConsolide, setBudgetConsolide] = useState<BudgetMensuelAnalyseConsolideModel>(null);
    const [distinctCategories, setDistinctCategories] = useState<CategorieOperationModel[]>([]);
    



    /** Chargement du compte et de la période **/
    useEffect(() => {
        console.log("[TRIGGER] Context selectedCompte :", selectedCompte?.id, "selectedPeriode :", formatPeriode(periodeAnalyses));
        setIsLoading(true);
        loadBudgetsPeriodes(selectedCompte, periodeAnalyses, handleDataCalculationResult);
    }, [selectedCompte, periodeAnalyses]);

    /**
     * Gère les résultats du calcul des données.
     * @param {Object} param0 - Les résultats du calcul des données.
        */

    function handleDataCalculationResult(budgetConsolide: BudgetMensuelAnalyseConsolideModel, distinctCategories: CategorieOperationModel[]) {
        console.log("Budget consolidé avec ", budgetConsolide.listeOperations.length, " opérations", budgetConsolide);
        setBudgetConsolide(budgetConsolide);
        setDistinctCategories(distinctCategories);
        setIsLoading(false);
    }
    /**
     * Filtre les opérations en fonction des filtres sélectionnés
     */
    const filteredOperations = useMemo(() => {
        return applyFiltersToOperations(budgetConsolide?.listeOperations || [], filters);
    }, [budgetConsolide, filters]);

    // Grouper les opérations par catégories et sous-catégories et calculer les totaux
    const analyseCategoriesData = useMemo(() => getCategoriesDataForAnalyses(filteredOperations), [filteredOperations]);




    /**
     * Render du budget
     */
    return (
        <>
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={isLoading}>
                <CircularProgress color="inherit" />
            </Backdrop>

            <Box className="page-container tendances-page-container">
                <Grid container sx={{ overflow: "hidden", justifyContent: 'center', alignItems: 'center', display: 'flex', height: 'calc(100vh - 80px)'}}>
                    <Grid size={{ md: 0.6, xl: 0.4 }}
                        sx={{ justifyContent: 'center', alignItems: 'center', display: 'flex' }}><MenuIcon
                            onClick={onOpenMenu} className={"editableField"} fontSize={"large"} /></Grid>
                    <Grid size={{ md: 11.4, xl: 11.6 }} sx={{ justifyContent: 'center', alignItems: 'center', display: 'flex' }}>
                        {selectedCompte == null ?
                            <></>
                            :
                            <AnalysesTitre currentCompte={selectedCompte}
                                currentPeriode={periodeAnalyses} />
                        }
                    </Grid>
                    <Grid size={{ md: 3, xl: 3 }} direction={"column"}  sx={{ overflow: "hidden", height: "calc(100vh - 11%)" }}>
                        {selectedCompte == null ?
                            <></>
                            :

                            <Box sx={{ border: '2px solid var(--color-dark-container)', borderRadius: 2, height: "100%", marginRight: 1, display: 'flex', flexDirection: 'column' }}>
                                {/* En-tête avec label */}
                                <Box sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    borderBottom: '1px solid var(--color-dark-container)',
                                    backgroundColor: 'var(--color-dark-bg)'
                                }}><Typography
                                    variant="h6"
                                    sx={{ padding: 1, color: 'var(--color-heading)' }}>Filtres</Typography>
                                </Box>

                                {/* Contenu Filtres */}
                                <Box sx={{ padding: 1, }}>
                                    <AnalysesFiltres isLoading={isLoading}
                                        currentPeriode={periodeAnalyses}
                                        selectedCompte={selectedCompte}
                                        setPeriodeAnalyses={setPeriodeAnalyses}
                                        filters={filters}
                                        setFilters={setFilters}
                                        distinctCategories={distinctCategories}
                                    />
                                </Box>
                            </Box>

                        }
                    </Grid>
                    <Grid size={{ md: 9, xl: 9 }} sx={{ overflow: "hidden", height: "calc(100vh - 11%)" }}>
                        {selectedCompte == null || budgetConsolide == null ?
                            <></>
                            :
                            <>
                                <Grid size={{ md: 12, xl: 12 }} sx={{paddingBottom: 1}}>
                                    <ExpandableDetailSection label="Synthèse par types d'opérations">
                                        <AnalyseSyntheseTypes operations={filteredOperations} selectedTypes={filters.selectedTypes} />
                                    </ExpandableDetailSection>
                                </Grid>
                                <Grid container sx={{ overflow: "hidden", height: "calc(100vh - 23%)"}} >
                                    <Grid size={{ md: 6, xl: 6 }} sx={{ overflow: "hidden", height: "49%" }}>
                                        <ExpandableDetailSection label={`Treemap des catégories`}>
                                            <AnalyseTreeMap analyseCategories={analyseCategoriesData} selectedCategories={filters.selectedCategories} setFilters={setFilters} />
                                        </ExpandableDetailSection>
                                    </Grid>
                                    <Grid size={{ md: 6, xl: 6 }} sx={{ overflow: "hidden", height: "49%" }}>
                                        <ExpandableDetailSection label={`Evolution`}>
                                            <AnalyseEvolution budgetConsolide={budgetConsolide} operations={filteredOperations} isVueMensuelle={!periodeAnalyses.vuePeriode} />
                                        </ExpandableDetailSection>
                                    </Grid>
                                    <Grid size={{ md: 6, xl: 6 }} sx={{ overflow: "hidden", height: "49%" }}>
                                        <ExpandableDetailSection label={`Synthèse par catégories`}>
                                            <AnalyseCategoriesListe analyseCategories={analyseCategoriesData} />
                                        </ExpandableDetailSection>
                                    </Grid>
                                    <Grid size={{ md: 6, xl: 6 }} sx={{ overflow: "hidden", height: "49%"}}>
                                        <ExpandableDetailSection label={`Synthèse des ${filteredOperations.length} opérations`}>
                                            <AnalyseOperationsListe operations={filteredOperations} />
                                        </ExpandableDetailSection>
                                    </Grid>
                                </Grid>
                            </>
                        }
                    </Grid>
                </Grid>
            </Box>
        </>
    )
}
