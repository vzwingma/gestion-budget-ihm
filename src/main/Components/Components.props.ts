import BudgetMensuelModel from "../Models/budgets/BudgetMensuel.model.ts";
import CategorieOperationModel from "../Models/budgets/CategorieOperation.model.ts";
import CompteBancaireModel from "../Models/budgets/CompteBancaire.model.ts";
import OperationModel from "../Models/budgets/Operation.model.ts";

import {BUSINESS_ONGLETS, OPERATION_ETATS_ENUM, TYPES_CATEGORIES_OPERATION_ENUM, TYPES_OPERATION_ENUM, UTILISATEUR_DROITS} from "../Utils/AppBusinessEnums.constants.ts";
import {OPERATION_EDITION_FORM} from "./budgets/operations/courantes/detail/OperationDetailPage.constants.ts";
import LibelleCategorieOperationModel from "../Models/budgets/LibelleCategorieOperation.model.ts";
import OperationEditionModel from "../Models/budgets/OperationEdition.model.ts";
import {Dispatch, SetStateAction} from "react";
import { OPERATION_RECURRENTE_EDITION_FORM } from "./budgets/operations/recurrentes/details/OperationRecurrenteDetailPage.constants.ts";
import { AnalysesPeriodeModel } from "../Models/analyses/AnalysesPeriode.model.ts";
import SsCategorieOperationModel from "../Models/budgets/SSCategorieOperation.model.ts";
import { AnalysesFiltersModel } from "../Models/analyses/AnalysesFilters.model.ts";
import AnalyseCategoriesModel from "../Models/analyses/syntheses/AnalyseCategories.model.ts";




/**
 * Propriétés du composant d'analysse
 */
export  interface AnalyseProps {
   selectedCompte: CompteBancaireModel | null
   onOpenMenu: () => void
}

export interface AnalysesTitreProps {
    currentCompte: CompteBancaireModel;
    currentPeriode: AnalysesPeriodeModel;
}

export interface AnalysesFiltresProps {
    isLoading: boolean;
    currentPeriode: AnalysesPeriodeModel;
    setPeriodeAnalyses: Dispatch<SetStateAction<AnalysesPeriodeModel>>;
    filters: AnalysesFiltersModel;
    setFilters: Dispatch<SetStateAction<AnalysesFiltersModel>>;
    distinctCategories: CategorieOperationModel[];
}

export interface AnalysesFiltrePeriodeProps {
    periode: AnalysesPeriodeModel;
    onChange: (periode: AnalysesPeriodeModel) => void;
}

export interface AnalysesFiltreTypesCategoriesProps {
    selectedTypes: TYPES_CATEGORIES_OPERATION_ENUM[];
    onChange: (selectedTypes: TYPES_CATEGORIES_OPERATION_ENUM[]) => void;
}

export interface AnalysesFiltresOperationProps {
    selectedEtats: OPERATION_ETATS_ENUM[];
    selectedTypes: TYPES_OPERATION_ENUM[];
    onChange: (selectedEtats: OPERATION_ETATS_ENUM[], selectedTypes: TYPES_OPERATION_ENUM[]) => void;
}

export interface AnalysesFiltresCategoriesProps {
    distinctCategories: CategorieOperationModel[];
    selectedCategories: CategorieOperationModel[];
    onChange: (selectedCategories: CategorieOperationModel[]) => void;
}

export interface AnalysesFiltresSsCategoriesProps {
    distinctSubcategories: SsCategorieOperationModel[];
    selectedSubcategories: SsCategorieOperationModel[];
    onChange: (selectedSubcategories: SsCategorieOperationModel[]) => void;
}

export interface AnalyseSyntheseTypesProps {
    operations: OperationModel[];
    selectedTypes: TYPES_CATEGORIES_OPERATION_ENUM[];
}

export interface AnalyseOperationsListeProps {
    operations: OperationModel[];
}

export interface AnalyseEvolutionProps {
    operations: OperationModel[];
    isVueMensuelle: boolean;
}

export interface AnalyseCategoriesListeProps {
    analyseCategories: AnalyseCategoriesModel[]
}



/**
 * Budget
 */
export interface BudgetActionsButtonGroupProps {
    droits: UTILISATEUR_DROITS[]
    onActionBudgetChange: (budget: BudgetMensuelModel) => void
    onActionOperationCreate: () => void
}

export interface BudgetPageProps {
    onOpenMenu: () => void
}


export interface RecurrentsPageProps {
    onOpenMenu: () => void
}

/**
 * Operations
 */

export interface OperationDetailActionsProps {
    isInCreateMode: boolean,
    editOperation: OperationEditionModel,
    onClickRealiseInCreateMode: (valeurDate: Date, editOperation: OperationModel, setEditOperation: Dispatch<SetStateAction<OperationModel>>) => void
    onOperationChange: (budget: BudgetMensuelModel) => void
}


export interface OperationDetailCategoriesProps {
    listeCategories: CategorieOperationModel[]
    formCatgoriesInEdition: boolean
    errorsCategories: string | null
    fillOperationForm: (field: OPERATION_EDITION_FORM, value: string) => void
}

export interface OperationDetailDateProps {
    formDateInEdition: boolean
    errorDateOperation: string | null
    fillOperationForm: (field: OPERATION_RECURRENTE_EDITION_FORM | OPERATION_EDITION_FORM, value: string) => void
}

export interface OperationDetailIntercompteProps {
    intercompte: string | null
    listeAutresComptes: CompteBancaireModel[]
    errorIntercompte: string | null
    fillOperationForm: (field: OPERATION_EDITION_FORM.INTERCOMPTES, value: string) => void
}

export interface OperationDetailLibelleProps {
    listeLibellesOperations: LibelleCategorieOperationModel[]
    formLibelleInEdition: boolean
    errorLibelle: string | null
    fillOperationForm: (field: OPERATION_EDITION_FORM, value: string) => void
}

export interface OperationDetailMensualiteProps {
    formMensualiteInEdition: boolean
    fillOperationForm: (field: OPERATION_EDITION_FORM, value: string) => void
}

export interface OperationDetailCategorieTypeProps {
    formCategorieTypeInEdition: boolean
    editOperation: any
    fillOperationForm: (field: OPERATION_EDITION_FORM, value: string) => void
}



export interface OperationDetailValeurProps {
    formValueInEdition: boolean
    errorValeur: string | null
    fillOperationForm: (field: OPERATION_EDITION_FORM.VALUE, value: string) => void
}

export interface OperationDetailPageProps {
    listeCategories: CategorieOperationModel[]
    listeLibellesOperations: LibelleCategorieOperationModel[]
    onOperationChange: (budget: BudgetMensuelModel) => void
}


export interface OperationsListeProps {
    operationGroupedByDate: {[key: string]: OperationModel[]}
    filterOperations: string | null
    onClick: (operation : OperationModel) => void
    selectedOperationId?: string | null
}

export interface OperationsRecurrentesListeProps {
    operationGroupedByPeriodicity: {[key: string]: OperationModel[]}
    filterOperations: string | null
    onClick: (operation : OperationModel) => void
    selectedOperationId?: string | null
}

export interface OperationItemProps {
    operation: OperationModel
    onClick: (operation : OperationModel) => void | null
    isSelected?: boolean
    isOneSelected?: boolean
}
export interface OperationRecurrenteDetailPageProps {
    onOperationChange: (budget: BudgetMensuelModel) => void
}

/**
 * Main page
 */
export interface CompteItemProps {
    compte: CompteBancaireModel;
    selectedDate: Date;
    selectedFunction: BUSINESS_ONGLETS;
    onRefreshMenuBar: boolean;
    onClick: (compte : CompteBancaireModel) => void
}

export interface DateRangeProps {
    selectedDate: Date;
    onDateChange: Function
}

export interface MainPageProps {
    fonction: BUSINESS_ONGLETS;
}
