import React, { JSX, useEffect, useMemo, useState } from "react";

import { Backdrop, Box, CircularProgress, Grid } from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import { AnalyseProps } from "../Components.props.ts";
import AnalysesTitre, { formatPeriode } from "./AnalysesTitre.component.tsx";
import { AnalysesPeriodeModel } from "../../Models/analyses/AnalysesPeriode.model.ts";
import AnalysesFiltres from "./AnalysesFiltres.component.tsx";
import { getHeightList } from "../../Utils/ListData.utils.tsx";
import BudgetMensuelModel from "../../Models/budgets/BudgetMensuel.model.ts";
import { applyFiltersToOperations, loadBudgetsPeriodes } from "./Analyses.controller.ts";
import OperationsListe from "../budgets/operations/OperationsListe.component.tsx";
import { getOperationsGroupedByDateOperation } from "../budgets/budget/Budget.controller.ts";
import CategorieOperationModel from "../../Models/budgets/CategorieOperation.model.ts";
import SsCategorieOperationModel from "../../Models/budgets/SSCategorieOperation.model.ts";
import { AnalysesFiltersModel, getDefaultAnalysesFilters } from "../../Models/analyses/AnalysesFilters.model.ts";




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
                    <Grid size={{ md: 3, xl: 3 }} direction={"column"} sx={{ overflowX: "hidden", overflowY: "auto", height: getHeightList() }}>
                        {selectedCompte == null ?
                            <></>
                            :
                            <AnalysesFiltres isLoading={isLoading}
                                currentPeriode={periodeAnalyses}
                                setPeriodeAnalyses={setPeriodeAnalyses}
                                filters={filters}
                                setFilters={setFilters}
                                distinctCategories={distinctCategories}
                                distinctSubcategories={distinctSubcategories}
                            />
                        }
                    </Grid>
                    <Grid size={{ md: 9, xl: 9 }} sx={{ overflow: "hidden", height: getHeightList() }}>
                        {selectedCompte == null || budgetConsolide == null ?
                            <></>
                            :
                            <Grid container sx={{ overflow: "hidden", justifyContent: 'center', alignItems: 'center', display: 'flex' }}>
                                <Grid size={{ md: 6, xl: 6 }} direction={"row"} sx={{ overflow: "hidden" }} >
                                    
                                </Grid>
                                <Grid size={{ md:  6, xl: 6 }} direction={"row"} sx={{ overflow: "hidden" }}>
                                    <OperationsListe
                                        operationGroupedByDate={getOperationsGroupedByDateOperation(filteredOperations)}
                                        filterOperations={null}
                                        onClick={() => { }}
                                        selectedOperationId={null} />
                                </Grid>
                                <Grid size={{ md:  6, xl: 6 }} direction={"row"} sx={{ overflow: "hidden" }}>
                                    
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
