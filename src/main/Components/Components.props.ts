import AnalyseCategoriesModel from "../Models/analyses/categories/AnalyseCategories.model.ts";
import {AnalyseSoldesTimelineItemModel} from "../Models/analyses/tendances/AnalyseSoldesTimelineItem.model.ts";
import {AnalyseCategorieTimelineItem} from "../Models/analyses/tendances/AnalyseCategorieTimelineItem.model.ts";
import AnalyseSoldesCategorie from "../Models/analyses/tendances/AnalyseSoldesCategorie.model.ts";
import SoldesMensuelModel from "../Models/analyses/tendances/SoldeMensuel.model.ts";
import BudgetMensuelModel from "../Models/budgets/BudgetMensuel.model.ts";
import CategorieOperationModel from "../Models/budgets/CategorieOperation.model.ts";
import CompteBancaireModel from "../Models/budgets/CompteBancaire.model.ts";
import OperationModel from "../Models/budgets/Operation.model.ts";

import {BUSINESS_ONGLETS, UTILISATEUR_DROITS} from "../Utils/AppBusinessEnums.constants.ts";
import {OPERATION_EDITION_FORM} from "./budgets/operations/detail/OperationDetailPage.constants.ts";
import LibelleCategorieOperationModel from "../Models/budgets/LibelleCategorieOperation.model.ts";
import OperationEditionModel from "../Models/budgets/OperationEdition.model.ts";
import {Dispatch, SetStateAction} from "react";

/**
 * Analyse des catégories
 */
export interface AnalyseCategorieListItemProps {
    resumeCategorie: AnalyseCategoriesModel,
    typeAnalyse: string,
    selectCategorie: () => void
}


export interface AnalyseCategoriesListeProps {
    rangSelectedCategorie: number | null,
    analysesGroupedByCategories: { [key: string]: AnalyseCategoriesModel } | null,
    typeAnalyse: string,
    selectCategorie: (analyseCategoriesModel: AnalyseCategoriesModel, rang?: number) => void
}


export interface AnalyseCategoriesProps {
    selectedCompte: CompteBancaireModel | null,
    selectedDate: Date,
    onOpenMenu: () => void
}

export interface DataCalculationResultsProps {
    currentBudget: BudgetMensuelModel,
    totauxGroupedByEtat: { [key: string]: number },
    analysesGroupedByCategories: { [key: string]: AnalyseCategoriesModel }
}

// Définition des types de propriétés pour le composant AnalyseTitre
export interface AnalyseTitreProps {
    currentCompte: CompteBancaireModel,
    currentDate: Date,
    totalOperations: number
}
/**
 * Graphiques des analyses
 */

export interface GraphAnalysesProps {
    typeAnalyse: string,
    analysesGroupedByCategories: { [idCategorie: string]: AnalyseCategoriesModel },
    resumeSelectedCategorie: AnalyseCategoriesModel | null,
    resumeSelectedSsCategorie: AnalyseCategoriesModel | null
}

/**
 * Propriétés du composant de graphique pour l'analyse temporelle.
 */
export interface GraphAnalyseTendancesProps {
    anneeAnalyses: number,
    filterSoldesActive: boolean,
    analyseSoldesCategoriesData: AnalyseSoldesCategorie[],
    timelinesByCategoriesData: { [idCategorie: string]: AnalyseCategorieTimelineItem }[],
    timelinesPrevisionnellesByCategoriesData: { [idCategorie: string]: AnalyseCategorieTimelineItem }[],
    timelinesSoldesData: AnalyseSoldesTimelineItemModel[],
    timelinesPrevisionnellesSoldesData: AnalyseSoldesTimelineItemModel[]
}

/**
 * Analyse tendances
 */
export interface TooltipAnalyseTendancesProps {
    active?: boolean,
    payload?: any[],
    label?: string
}

/**
 * Interface pour les propriétés des résultats de calcul des données.
 *
 * @interface DataCalculationTendancesResultsProps
 * @property {SoldeMensuelModel[]} soldesBudgetsData - Les données des soldes budgétaires.
 * @property {SoldeCategorieModel[]} soldesCategoriesData - Les données des catégories.
 * @property {{ [key: string]: CategorieTimelineItem }[]} timelinesGroupedByCategoriesData - Les timelines groupées par catégories.
 * @property {{ [key: string]: CategorieTimelineItem }[]} timelinesPrevisionnellesGroupedByCategoriesData - Les timelines prévisionnelles groupées par catégories.
 * @property {SoldeMensuelModel[]} timelinesSoldesData - Les timelines des soldes.
 * @property {SoldeMensuelModel[]} timelinesPrevisionnellesSoldesData - Les timelines prévisionnelles des soldes.
 */
export interface DataCalculationTendancesResultsProps {
    soldesMensuelsData: SoldesMensuelModel[],
    soldesCategoriesData: AnalyseSoldesCategorie[],
    timelinesByCategoriesData: { [idCategorie: string]: AnalyseCategorieTimelineItem }[],
    timelinesPrevisionnellesByCategoriesData: { [idCategorie: string]: AnalyseCategorieTimelineItem }[],
    timelinesSoldesData: AnalyseSoldesTimelineItemModel[],
    timelinesPrevisionnellesSoldesData: AnalyseSoldesTimelineItemModel[]
}

export  interface AnalyseTendancesProps {
   selectedCompte: CompteBancaireModel | null
   onOpenMenu: () => void
}


export interface AnalyseTendancesFiltreProps {
    listeCategories: AnalyseSoldesCategorie[];
    onFilterChange: (event: React.SyntheticEvent) => void;
}

export interface AnalyseTendancesTitreProps {
    currentCompte: CompteBancaireModel;
    currentAnnee: number;
    onAnneeChange: React.Dispatch<React.SetStateAction<number>>;
}

export interface AnneeRangeProps {
    selectedAnnee: number;
    onAnneeChange: React.Dispatch<React.SetStateAction<number>>;
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
 * Opertions
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
    fillOperationForm: (field: OPERATION_EDITION_FORM, value: string) => void
}

export interface OperationDetailIntercompteProps {
    intercompte: string | null
    libelle: string
    listeAutresComptes: CompteBancaireModel[]
    formIntercompteInEdition: boolean
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
    onClick: (operation : OperationModel) => void
    isSelected?: boolean
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
