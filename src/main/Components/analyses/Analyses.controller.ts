import { toast } from "react-toastify";

import CompteBancaireModel from "../../Models/budgets/CompteBancaire.model.ts";
import { AnalysesPeriodeModel } from "../../Models/analyses/AnalysesPeriode.model.ts";
import BudgetMensuelModel from "../../Models/budgets/BudgetMensuel.model.ts";
import { loadBudget } from "./Analyses.extservices.ts";
import CategorieOperationModel from "../../Models/budgets/CategorieOperation.model.ts";
import SsCategorieOperationModel from "../../Models/budgets/SSCategorieOperation.model.ts";
import OperationModel from "../../Models/budgets/Operation.model.ts";
import { AnalysesFiltersModel } from "../../Models/analyses/AnalysesFilters.model.ts";

/**
 * Contrôleur des analyses
 */
export function loadBudgetsPeriodes(selectedCompte: CompteBancaireModel | null, periodeAnalyses: AnalysesPeriodeModel, handleDataCalculationResult: (budgetConsolide: BudgetMensuelModel, distinctCategories: CategorieOperationModel[], distinctSubcategories: SsCategorieOperationModel[]) => void) {
    const startDate = new Date(periodeAnalyses.periodeDebut);
    const endDate = new Date(periodeAnalyses.periodeFin);

    if(selectedCompte == null) {
        toast.error("Aucun compte sélectionné pour le chargement des analyses", {autoClose: false, closeOnClick: true});
        return;
    }

    console.log("Chargement des budgets pour le compte ", selectedCompte.libelle, " de la période ", startDate.toLocaleDateString(), " à ", endDate.toLocaleDateString());
    let budgetConsolide = new BudgetMensuelModel("analyses-consolide", "Budget Analyses Consolidé");
    budgetConsolide.idCompteBancaire = selectedCompte.id;
    budgetConsolide.actif = true;
    budgetConsolide.listeOperations = [];
    
    // Aggregate all budgets in parallel
    const months: Date[] = [];
    for (let current = new Date(startDate); current <= endDate; current.setMonth(current.getMonth() + 1)) {
        months.push(new Date(current));
    }

    Promise.all(
        months.map(month => 
            loadBudget(selectedCompte, month)
                .then(budget => {
                    console.log("Budget ", selectedCompte.libelle, " de ", (month.getMonth() + 1), "/", month.getFullYear(), " chargé avec ", budget.listeOperations.length, " opérations");
                    return budget.listeOperations;
                })
                .catch((e) => {
                    let libErreur = "Erreur lors du chargement du budget du compte " + selectedCompte.libelle + " du " + (month.getMonth() + 1) + "/" + month.getFullYear();
                    console.log(libErreur, e);
                    toast.error(libErreur, {autoClose: false, closeOnClick: true});
                    return [];
                })
        )
    )
    .then(allOperations => {
        budgetConsolide.listeOperations = allOperations.flat();
        const distinctCategories = [...new Set(budgetConsolide.listeOperations.map(op => op.categorie.id))].map(id => budgetConsolide.listeOperations.find(op => op.categorie.id === id)?.categorie).filter(Boolean).sort((a, b) => a.libelle.localeCompare(b.libelle));
        const distinctSubcategories = [...new Set(budgetConsolide.listeOperations.map(op => op.ssCategorie.id))].map(id => budgetConsolide.listeOperations.find(op => op.ssCategorie.id === id)?.ssCategorie).filter(Boolean).sort((a, b) => a.libelle.localeCompare(b.libelle));
        handleDataCalculationResult(budgetConsolide, distinctCategories, distinctSubcategories);
    });

}


export function applyFiltersToOperations(operations: Array<OperationModel>, filters: AnalysesFiltersModel): Array<OperationModel> {
    return operations.filter(op => {
        const matchesTypeCategorie = filters.selectedTypes.length === 0 || filters.selectedTypes.includes(op.ssCategorie.type);
        const matchesEtat = filters.selectedOperationEtats.length === 0 || filters.selectedOperationEtats.includes(op.etat);
        const matchesTypeOperation = filters.selectedOperationTypes.length === 0 || filters.selectedOperationTypes.includes(op.typeOperation);
        const matchesCategorie = filters.selectedCategories.length === 0 || filters.selectedCategories.some(cat => cat.id === op.categorie.id);
        const matchesSubcategorie = filters.selectedSubcategories.length === 0 || filters.selectedSubcategories.some(subcat => subcat.id === op.ssCategorie.id);
        return matchesTypeCategorie && matchesEtat && matchesTypeOperation && matchesCategorie && matchesSubcategorie;
    });
}
