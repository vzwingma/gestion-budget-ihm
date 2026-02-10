import { OPERATION_ETATS_ENUM, TYPES_CATEGORIES_OPERATION_ENUM, TYPES_OPERATION_ENUM } from "../../Utils/AppBusinessEnums.constants.ts";
import CategorieOperationModel from "../budgets/CategorieOperation.model.ts";
import SsCategorieOperationModel from "../budgets/SSCategorieOperation.model.ts";

export interface AnalysesFiltersModel {
    selectedTypes: TYPES_CATEGORIES_OPERATION_ENUM[];
    selectedOperationEtats: OPERATION_ETATS_ENUM[];
    selectedOperationTypes: TYPES_OPERATION_ENUM[];
    selectedCategories: CategorieOperationModel[];
    selectedSubcategories: SsCategorieOperationModel[];
}



/**
 * Fonction de création d'une nouvelle opération.
 * @returns {OperationModel} - Un nouvel objet OperationModel initialisé.
 */
export function getDefaultAnalysesFilters(): AnalysesFiltersModel {
    return {
        selectedTypes: [TYPES_CATEGORIES_OPERATION_ENUM.REVENUS, TYPES_CATEGORIES_OPERATION_ENUM.ECONOMIES, TYPES_CATEGORIES_OPERATION_ENUM.ESSENTIEL, TYPES_CATEGORIES_OPERATION_ENUM.IMPREVUS, TYPES_CATEGORIES_OPERATION_ENUM.PLAISIR, TYPES_CATEGORIES_OPERATION_ENUM.EXTRAS],
        selectedOperationEtats: [OPERATION_ETATS_ENUM.PREVUE, OPERATION_ETATS_ENUM.REALISEE],
        selectedOperationTypes: [TYPES_OPERATION_ENUM.DEPENSE, TYPES_OPERATION_ENUM.CREDIT],
        selectedCategories: [],
        selectedSubcategories: []
    };
}

