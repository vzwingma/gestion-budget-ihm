import React, { JSX, useEffect, useState } from "react";

import { Backdrop, Box, CircularProgress, Grid } from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import { AnalyseProps } from "../Components.props.ts";
import AnalysesTitre, { formatPeriode } from "./AnalysesTitre.component.tsx";
import { AnalysesPeriodeModel } from "../../Models/analyses/AnalysesPeriode.model.ts";
import AnalysesFiltres from "./AnalysesFiltres.component.tsx";
import { getHeightList } from "../../Utils/ListData.utils.tsx";
import BudgetMensuelModel from "../../Models/budgets/BudgetMensuel.model.ts";
import { loadBudgetsPeriodes } from "./Analyses.controller.ts";
import OperationsListe from "../budgets/operations/OperationsListe.component.tsx";
import { getOperationsGroupedByDateOperation } from "../budgets/budget/Budget.controller.ts";
import { OPERATION_ETATS_ENUM, TYPES_CATEGORIES_OPERATION_ENUM, TYPES_OPERATION_ENUM } from "../../Utils/AppBusinessEnums.constants.ts";
import CategorieOperationModel from "../../Models/budgets/CategorieOperation.model.ts";
import SsCategorieOperationModel from "../../Models/budgets/SSCategorieOperation.model.ts";




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

    const [selectedTypes, setSelectedTypes] = useState<TYPES_CATEGORIES_OPERATION_ENUM[]>([TYPES_CATEGORIES_OPERATION_ENUM.ESSENTIEL, TYPES_CATEGORIES_OPERATION_ENUM.IMPREVUS, TYPES_CATEGORIES_OPERATION_ENUM.PLAISIR, TYPES_CATEGORIES_OPERATION_ENUM.EXTRAS, TYPES_CATEGORIES_OPERATION_ENUM.IMPREVUS]);
    const [selectedOperationEtats, setSelectedOperationEtats] = useState<OPERATION_ETATS_ENUM[]>([OPERATION_ETATS_ENUM.PREVUE]);
    const [selectedOperationTypes, setSelectedOperationTypes] = useState<TYPES_OPERATION_ENUM[]>([TYPES_OPERATION_ENUM.DEPENSE]);
    const [selectedCategories, setSelectedCategories] = useState<CategorieOperationModel[]>([]);
    const [selectedSubcategories, setSelectedSubcategories] = useState<SsCategorieOperationModel[]>([]);

    const [budgetConsolide, setBudgetConsolide] = useState<BudgetMensuelModel>(null);
    const [distinctCategories, setDistinctCategories] = useState<CategorieOperationModel[]>([]);
    const [distinctSubcategories, setDistinctSubcategories] = useState<SsCategorieOperationModel[]>([]);
 
    /** Chargement des catégories **/
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
                    <Grid size={{ md: 4, xl: 4 }} direction={"column"} sx={{ overflowX: "hidden", overflowY: "auto", height: getHeightList() }}>
                        {selectedCompte == null ?
                            <></>
                            :
                            <AnalysesFiltres isLoading={isLoading}
                                currentPeriode={periodeAnalyses}
                                setPeriodeAnalyses={setPeriodeAnalyses}
                                selectedTypes={selectedTypes} setSelectedTypes={setSelectedTypes}
                                selectedOperationEtats={selectedOperationEtats} setSelectedOperationEtats={setSelectedOperationEtats}
                                selectedOperationTypes={selectedOperationTypes} setSelectedOperationTypes={setSelectedOperationTypes}
                                selectedCategories={selectedCategories} setSelectedCategories={setSelectedCategories}
                                selectedSubcategories={selectedSubcategories} setSelectedSubcategories={setSelectedSubcategories}
                                distinctCategories={distinctCategories} distinctSubcategories={distinctSubcategories}
                            />
                        }
                    </Grid>
                    <Grid size={{ md: 8, xl: 8 }} sx={{ overflow: "hidden", height: getHeightList() }}>
                        {selectedCompte == null || budgetConsolide == null ?
                            <></>
                            :
                            <OperationsListe
                                operationGroupedByDate={getOperationsGroupedByDateOperation(budgetConsolide?.listeOperations || [])}
                                filterOperations={null}
                                onClick={() => { }}
                                selectedOperationId={null} />
                        }
                    </Grid>
                </Grid>
            </Box>
        </>
    )
}
