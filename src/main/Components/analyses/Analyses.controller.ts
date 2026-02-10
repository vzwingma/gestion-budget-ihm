import { toast } from "react-toastify";

import CompteBancaireModel from "../../Models/budgets/CompteBancaire.model.ts";
import { AnalysesPeriodeModel } from "../../Models/analyses/AnalysesPeriode.model.ts";
import BudgetMensuelModel from "../../Models/budgets/BudgetMensuel.model.ts";
import { loadBudget } from "./Analyses.extservices.ts";
import CategorieOperationModel from "../../Models/budgets/CategorieOperation.model.ts";
import OperationModel from "../../Models/budgets/Operation.model.ts";
import { AnalysesFiltersModel } from "../../Models/analyses/AnalysesFilters.model.ts";

/**
 * Contrôleur des analyses
 */
export function loadBudgetsPeriodes(selectedCompte: CompteBancaireModel | null, periodeAnalyses: AnalysesPeriodeModel, handleDataCalculationResult: (budgetConsolide: BudgetMensuelModel, distinctCategories: CategorieOperationModel[]) => void) {
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
        const distinctCategories = [...new Set(budgetConsolide.listeOperations.map(op => op.categorie.id))]
                                                                              .map(id => budgetConsolide.listeOperations
                                                                                .find(op => op.categorie.id === id)?.categorie)
                                                                                .filter(Boolean).sort((a, b) => a.libelle.localeCompare(b.libelle));
        handleDataCalculationResult(budgetConsolide, distinctCategories);
    });

}


/**
 * Applique des filtres aux opérations fournies.
 *
 * Cette fonction filtre un tableau d'opérations en fonction des critères spécifiés dans le modèle de filtres.
 * Les opérations sont conservées si elles correspondent à au moins un des critères de filtrage suivants :
 * - Type de catégorie
 * - État de l'opération
 * - Type d'opération
 * - Catégorie
 * - Sous-catégorie
 *
 * @param operations - Un tableau d'objets OperationModel à filtrer.
 * @param filters - Un objet AnalysesFiltersModel contenant les critères de filtrage.
 * @returns Un tableau d'objets OperationModel qui correspondent aux critères de filtrage.
 */
export function applyFiltersToOperations(operations: Array<OperationModel>, filters: AnalysesFiltersModel): Array<OperationModel> {
    return operations.filter(op => {
        const matchesTypeCategorie = filters.selectedTypes.includes(op.ssCategorie.type);
        const matchesEtat = filters.selectedOperationEtats.includes(op.etat);
        const matchesTypeOperation = filters.selectedOperationTypes.includes(op.typeOperation);
        const matchesCategorie = filters.selectedCategories.length === 0 || filters.selectedCategories.some(cat => cat.id === op.categorie.id);
        return matchesTypeCategorie && matchesEtat && matchesTypeOperation && matchesCategorie;
    });
}
