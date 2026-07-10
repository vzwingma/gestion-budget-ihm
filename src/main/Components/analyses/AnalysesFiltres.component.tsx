import { Backdrop, CircularProgress, Divider, Stack, Typography } from "@mui/material";
import React, { JSX, useCallback } from "react";
import { AnalysesFiltresProps } from "../Components.props.ts";
import { AnalysesFiltrePeriodeComponent } from "./filtres/AnalysesFiltrePeriode.component.tsx";
import { AnalysesFiltreTypesCategories } from "./filtres/AnalysesFiltreTypesCategories.component.tsx";
import { AnalysesFiltresOperation } from "./filtres/AnalysesFiltresOperation.component.tsx";
import { AnalysesFiltreCategories } from "./filtres/AnalysesFiltreCategories.component.tsx";
import CategorieOperationModel from "../../Models/budgets/CategorieOperation.model.ts";
import { AnalysesPeriodeModel } from "../../Models/analyses/AnalysesPeriode.model.ts";
import { OPERATION_ETATS_ENUM, TYPES_CATEGORIES_OPERATION_ENUM, TYPES_OPERATION_ENUM } from "../../Utils/AppBusinessEnums.constants.ts";



/**
 * Composant pour l'affichage du titre de l'analyse temporelle.
 * @param {Object} props - Les propriétés passées au composant.
 * @param {Object} props.budgetConsolide - Le budget consolidé.
 * @param {Object} props.currentPeriode - La période courante.
 * @returns {JSX.Element} Le composant du titre de l'analyse temporelle.
 */
const AnalysesFiltres: React.FC<AnalysesFiltresProps> = ({ isLoading, currentPeriode, selectedCompte, setPeriodeAnalyses, filters, setFilters, distinctCategories }: AnalysesFiltresProps): JSX.Element => {

    const handlePeriodeChange = useCallback((periode: AnalysesPeriodeModel) => {
        setPeriodeAnalyses(periode);
    }, [setPeriodeAnalyses]);


    const handleSelectedTypesChange = useCallback((selectedTypes: TYPES_CATEGORIES_OPERATION_ENUM[]) => {
        setFilters(prev => ({ ...prev, selectedTypes }));
    }, [setFilters]);

    const handleOperationFiltersChange = useCallback((etats: OPERATION_ETATS_ENUM[], types: TYPES_OPERATION_ENUM[]) => {
        setFilters(prev => ({ ...prev, selectedOperationEtats: etats, selectedOperationTypes: types }));
    }, [setFilters]);

    const handleCategoriesChange = useCallback((categories : CategorieOperationModel[]) => {
        setFilters(prev => ({ ...prev, selectedCategories: categories }));
    }, [setFilters]);


    

    return (
        <>
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={isLoading}>
                <CircularProgress color="inherit" />
            </Backdrop>
            {/* Création d'une pile pour l'affichage du titre */}
            <Stack direction={"column"} spacing={2} sx={{ justifyContent: "center" }}>
                    <Typography variant={"caption"} sx={{ color: "var(--color-heading-text)" }}>Périodes</Typography>
                    <AnalysesFiltrePeriodeComponent periode={currentPeriode} selectedCompte={selectedCompte} onChange={handlePeriodeChange} />
                <Divider flexItem />
                    <Typography variant={"caption"} sx={{ color: "var(--color-heading-text)" }}>Types </Typography>
                    <AnalysesFiltreTypesCategories selectedTypes={filters.selectedTypes} onChange={handleSelectedTypesChange} />
                <Divider flexItem />
                    <Typography variant={"caption"} sx={{ color: "var(--color-heading-text)" }}>Opérations</Typography>
                    <AnalysesFiltresOperation
                        selectedEtats={filters.selectedOperationEtats}
                        selectedTypes={filters.selectedOperationTypes}
                        onChange={handleOperationFiltersChange}
                    />
                <Divider flexItem />
                    <Typography variant={"caption"} sx={{ color: "var(--color-heading-text)" }}>Catégories</Typography>
                    <AnalysesFiltreCategories
                        distinctCategories={distinctCategories}
                        selectedCategories={filters.selectedCategories}
                        onChange={handleCategoriesChange}
                    />
                <Divider flexItem sx={{padding: 5}} />
            </Stack>
        </>
    )
};

export default AnalysesFiltres