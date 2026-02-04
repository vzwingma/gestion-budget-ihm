import React, { JSX, useEffect, useMemo, useState } from "react";

import { Backdrop, Box, CircularProgress, Grid, Typography, useMediaQuery, useTheme } from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import { AnalyseProps } from "../Components.props.ts";
import AnalysesTitre, { formatPeriode } from "./AnalysesTitre.component.tsx";
import { AnalysesPeriodeModel } from "../../Models/analyses/AnalysesPeriode.model.ts";
import AnalysesFiltres from "./AnalysesFiltres.component.tsx";
import { AnalyseSyntheseTypes } from "./details/AnalyseSyntheseTypes.component.tsx";
import { getHeightList } from "../../Utils/ListData.utils.tsx";
import BudgetMensuelModel from "../../Models/budgets/BudgetMensuel.model.ts";
import { applyFiltersToOperations, loadBudgetsPeriodes } from "./Analyses.controller.ts";
import CategorieOperationModel from "../../Models/budgets/CategorieOperation.model.ts";
import SsCategorieOperationModel from "../../Models/budgets/SSCategorieOperation.model.ts";
import { AnalysesFiltersModel, getDefaultAnalysesFilters } from "../../Models/analyses/AnalysesFilters.model.ts";
import AnalyseOperationsListe from "./details/AnalyseOperationsListe.component.tsx";
import { ExpandableDetailSection } from "../shared/ExpandableDetailSection.component.tsx";




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
        vuePeriode: true,
        periodeDebut: new Date(new Date().getFullYear(), new Date().getMonth() - 3, 1),
        periodeFin: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0)
    });


    const [isLoading, setIsLoading] = useState<boolean>(true);

    const [filters, setFilters] = useState<AnalysesFiltersModel>(getDefaultAnalysesFilters());

    const [budgetConsolide, setBudgetConsolide] = useState<BudgetMensuelModel>(null);
    const [distinctCategories, setDistinctCategories] = useState<CategorieOperationModel[]>([]);
    const [distinctSubcategories, setDistinctSubcategories] = useState<SsCategorieOperationModel[]>([]);
    const isMobile = useMediaQuery(useTheme().breakpoints.down('lg'));
    /**
     * Filtre les opérations en fonction des filtres sélectionnés
     */
    const filteredOperations = useMemo(() => {
        return applyFiltersToOperations(budgetConsolide?.listeOperations || [], filters);
    }, [budgetConsolide, filters]);

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

    function handleDataCalculationResult(budgetConsolide: BudgetMensuelModel, distinctCategories: CategorieOperationModel[], distinctSubcategories: SsCategorieOperationModel[]) {
        console.log("Budget consolidé avec ", budgetConsolide.listeOperations.length, " opérations");
        setBudgetConsolide(budgetConsolide);
        setDistinctCategories(distinctCategories);
        setDistinctSubcategories(distinctSubcategories);
        setIsLoading(false);
    }



    /**
     * Render du budget
     */
    return (
        <>
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={isLoading}
            >
                <CircularProgress color="inherit" />
            </Backdrop>

            <Box className="page-container tendances-page-container">
                <Grid container
                    sx={{ overflow: "hidden", justifyContent: 'center', alignItems: 'center', display: 'flex' }}>
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
                    <Grid size={{ md: 3, xl: 3 }} direction={"column"} sx={{ overflowX: "hidden", overflowY: "auto", height: getHeightList(isMobile) }}>
                        {selectedCompte == null ?
                            <></>
                            :

                            <Box sx={{ border: '1px solid var(--color-dark-container)', borderRadius: 5, marginRight: 1, marginTop: 1 }}>
                                {/* En-tête avec label et icône agrandir */}
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

                                {/* Contenu enfant */}
                                <Box sx={{ padding: 1, }}>
                                    <AnalysesFiltres isLoading={isLoading}
                                        currentPeriode={periodeAnalyses}
                                        setPeriodeAnalyses={setPeriodeAnalyses}
                                        filters={filters}
                                        setFilters={setFilters}
                                        distinctCategories={distinctCategories}
                                        distinctSubcategories={distinctSubcategories}
                                    />
                                </Box>
                            </Box>

                        }
                    </Grid>
                    <Grid size={{ md: 9, xl: 9 }} sx={{ overflow: "hidden", height: getHeightList(isMobile) }}>
                        {selectedCompte == null || budgetConsolide == null ?
                            <></>
                            :
                            <Grid container sx={{ overflow: "hidden", justifyContent: 'center', alignItems: 'center', display: 'flex' }}>
                                <Grid size={{ md: 12, xl: 12 }} >
                                    <ExpandableDetailSection label="Synthèse des types d'opérations">
                                        <AnalyseSyntheseTypes operations={filteredOperations} selectedTypes={filters.selectedTypes} />
                                    </ExpandableDetailSection>
                                </Grid>
                                <Grid size={{ md: 6, xl: 6 }} direction={"row"} sx={{ overflow: "hidden" }} >
                                    <ExpandableDetailSection label="Liste des opérations">
                                        <AnalyseOperationsListe operations={filteredOperations} />
                                    </ExpandableDetailSection>
                                </Grid>
                                <Grid size={{ md: 6, xl: 6 }} direction={"row"} sx={{ overflow: "hidden" }}>

                                </Grid>
                                <Grid size={{ md: 6, xl: 6 }} direction={"row"} sx={{ overflow: "hidden" }}>

                                </Grid>
                                <Grid size={{ md: 6, xl: 6 }} direction={"row"} sx={{ overflow: "hidden" }} >

                                </Grid>

                            </Grid>
                        }
                    </Grid>
                </Grid>
            </Box>
        </>
    )
}
