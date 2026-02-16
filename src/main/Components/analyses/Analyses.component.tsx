import React, { JSX, useEffect, useMemo, useState } from "react";

import { Backdrop, Box, CircularProgress, Grid, Typography } from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import { AnalyseProps } from "../Components.props.ts";
import AnalysesTitre, { formatPeriode } from "./AnalysesTitre.component.tsx";
import { AnalysesPeriodeModel } from "../../Models/analyses/AnalysesPeriode.model.ts";
import AnalysesFiltres from "./AnalysesFiltres.component.tsx";
import { AnalyseSyntheseTypes } from "./syntheses/AnalyseSyntheseTypes.component.tsx";
import BudgetMensuelModel from "../../Models/budgets/BudgetMensuel.model.ts";
import { applyFiltersToOperations, loadBudgetsPeriodes } from "./Analyses.controller.ts";
import CategorieOperationModel from "../../Models/budgets/CategorieOperation.model.ts";
import { AnalysesFiltersModel, getDefaultAnalysesFilters } from "../../Models/analyses/AnalysesFilters.model.ts";
import AnalyseOperationsListe from "./syntheses/AnalyseOperationsListe.component.tsx";
import { ExpandableDetailSection } from "../shared/ExpandableDetailSection.component.tsx";
import AnalyseCategoriesListe from "./syntheses/AnalyseCategoriesListe.component.tsx";
import { getCategoriesDataForAnalyses } from "./syntheses/AnalyseCategoriesListe.controller.ts";
import AnalyseTreeMap from "./syntheses/AnalyseTreeMap.component.tsx";
import AnalyseEvolution from "./syntheses/AnalyseEvolution.component.tsx";




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
        vuePeriode: false,
        periodeDebut: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        periodeFin: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0)
    });


    const [isLoading, setIsLoading] = useState<boolean>(true);

    const [filters, setFilters] = useState<AnalysesFiltersModel>(getDefaultAnalysesFilters());

    const [budgetConsolide, setBudgetConsolide] = useState<BudgetMensuelModel>(null);
    const [distinctCategories, setDistinctCategories] = useState<CategorieOperationModel[]>([]);
    
    /**
     * Filtre les opérations en fonction des filtres sélectionnés
     */
    const filteredOperations = useMemo(() => {
        return applyFiltersToOperations(budgetConsolide?.listeOperations || [], filters);
    }, [budgetConsolide, filters]);


    // Grouper les opérations par catégories et sous-catégories et calculer les totaux
    const analyseCategoriesData = useMemo(() => getCategoriesDataForAnalyses(filteredOperations), [filteredOperations]);

    /** Chargement du compte **/
    useEffect(() => {
        console.log("[TRIGGER] Context selectedCompte :", selectedCompte?.id, "selectedPeriode :", formatPeriode(periodeAnalyses));
        setIsLoading(true);
        loadBudgetsPeriodes(selectedCompte, periodeAnalyses, handleDataCalculationResult);
    }, [selectedCompte, periodeAnalyses]);


    /**
     * Gère les résultats du calcul des données.
     * @param {Object} param0 - Les résultats du calcul des données.
        */

    function handleDataCalculationResult(budgetConsolide: BudgetMensuelModel, distinctCategories: CategorieOperationModel[]) {
        console.log("Budget consolidé avec ", budgetConsolide.listeOperations.length, " opérations");
        setBudgetConsolide(budgetConsolide);
        setDistinctCategories(distinctCategories);
        setIsLoading(false);
    }



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
                    <Grid size={{ md: 3, xl: 3 }} direction={"column"}  sx={{ overflow: "hidden", height: "calc(100vh - 140px)" }}>
                        {selectedCompte == null ?
                            <></>
                            :

                            <Box sx={{ marginRight: 1, marginTop: 1, height: "fit-content", border: '2px solid var(--color-dark-container)', borderRadius: 2  }}>
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
                                <Grid size={{ md: 12, xl: 12 }} >
                                    <ExpandableDetailSection label="Synthèse par types d'opérations">
                                        <AnalyseSyntheseTypes operations={filteredOperations} selectedTypes={filters.selectedTypes} />
                                    </ExpandableDetailSection>
                                </Grid>
                                <Grid container sx={{ overflow: "hidden", height: "calc(100vh - 23%)"}} >
                                    <Grid size={{ md: 6, xl: 6 }} sx={{ overflow: "hidden", height: "50%" }}>
                                        <ExpandableDetailSection label={`Synthèse des ${filteredOperations.length} opérations`}>
                                            <AnalyseOperationsListe operations={filteredOperations} />
                                        </ExpandableDetailSection>
                                    </Grid>
                                    <Grid size={{ md: 6, xl: 6 }} sx={{ overflow: "hidden", height: "50%" }}>
                                        <ExpandableDetailSection label={`Synthèse par catégories`}>
                                            <AnalyseCategoriesListe analyseCategories={analyseCategoriesData} />
                                        </ExpandableDetailSection>
                                    </Grid>
                                    <Grid size={{ md: 6, xl: 6 }} sx={{ overflow: "hidden", height: "50%" }}>
                                        <ExpandableDetailSection label={`Autre synthèse`}>
                                            <AnalyseEvolution operations={filteredOperations} />
                                        </ExpandableDetailSection>
                                    </Grid>
                                    <Grid size={{ md: 6, xl: 6 }} sx={{ overflow: "hidden", height: "50%" }}>
                                        <ExpandableDetailSection label={`Treemap des catégories`}>
                                            <AnalyseTreeMap analyseCategories={analyseCategoriesData} />
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
