import CategorieOperationModel from "../../../Models/budgets/CategorieOperation.model.ts";
import AnalyseCategoriesModel from "../../../Models/analyses/syntheses/AnalyseCategories.model.ts";
import { AnalysesFiltersModel } from "../../../Models/analyses/AnalysesFilters.model.ts";
import { Dispatch, SetStateAction } from "react";

export interface AnalyseCategoriesListeProps {
    analyseCategories: AnalyseCategoriesModel[]
    selectedCategories?: CategorieOperationModel[]
    setFilters?: Dispatch<SetStateAction<AnalysesFiltersModel>>

}
