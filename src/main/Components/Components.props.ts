import AnalyseCategoriesModel from "../Models/analyses/AnalyseCategories.model";
import BudgetMensuelModel from "../Models/BudgetMensuel.model";
import CategorieOperationModel from "../Models/CategorieOperation.model";
import CompteBancaireModel from "../Models/CompteBancaire.model";
import OperationModel from "../Models/Operation.model";
import SoldeCategorieModel from "../Models/SoldeCategorie.model";
import { BUSINESS_ONGLETS, UTILISATEUR_DROITS } from "../Utils/AppBusinessEnums.constants";
import { CategorieTimelineItem, SoldesTimelineItem } from "./analyses/temporelles/AnalyseTemporelle.controller";
import { OPERATION_EDITION_FORM } from "./budgets/operations/detail/OperationDetailPage.constants";

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
    analysesGroupedByCategories: { [key: string]: AnalyseCategoriesModel },
    resumeSelectedCategorie: AnalyseCategoriesModel | null,
    resumeSelectedSsCategorie: AnalyseCategoriesModel | null
}

/**
 * Propriétés du composant de graphique pour l'analyse temporelle.
 */
export interface GraphAnalyseTemporelleProps {
    anneeAnalyses: number,
    filterSoldesActive: boolean,
    categoriesData: SoldeCategorieModel[],
    timelinesGroupedByCategoriesData: { [key: string]: CategorieTimelineItem }[],
    timelinesPrevisionnellesGroupedByCategoriesData: { [key: string]: CategorieTimelineItem }[],
    timelinesSoldesData: SoldesTimelineItem[],
    timelinesPrevisionnellesSoldesData: SoldesTimelineItem[]
}

/**
 * Analyse temporelle
 */
export interface TooltipAnalyseTemporelleProps {
    active?: boolean,
    payload?: any[],
    label?: string
}


export  interface AnalyseTemporelleProps {
   selectedCompte: CompteBancaireModel | null
   onOpenMenu: () => void
}


export interface AnalyseTemporelleFiltreProps {
    listeCategories: SoldeCategorieModel[];
    onFilterChange: (event: React.SyntheticEvent) => void;
}

export interface AnalyseTemporelleTitreProps {
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
    budget: BudgetMensuelModel
    droits: UTILISATEUR_DROITS[]
    onActionBudgetChange: (budget: BudgetMensuelModel) => void
    onActionOperationCreate: () => void
}

export interface BudgetPageProps {
    selectedCompte: CompteBancaireModel | null
    selectedDate: Date
    listeComptes: CompteBancaireModel[]
    onOpenMenu: () => void
}

export interface BudgetsTitreProps  {
    currentCompte: CompteBancaireModel,
    currentDate: Date,
    currentBudget: BudgetMensuelModel
}

/**
 * Opertions
 */

export interface OperationDetailActionsProps {
    operation: OperationModel
    budget: BudgetMensuelModel
    isInCreateMode: boolean,
    onClickRealiseInCreateMode : (valeurDate: Date, editOperation: OperationModel, setEditOperation: React.Dispatch<React.SetStateAction<OperationModel>>) => void
    onOperationChange: (budget: BudgetMensuelModel) => void
}


export interface OperationDetailCategoriesProps {
    operation: OperationModel
    listeCategories: CategorieOperationModel[]
    formCatgoriesInEdition: boolean
    errorsCategories: string | null
    fillOperationForm: (field: OPERATION_EDITION_FORM, value: string) => void
}

export interface OperationDetailDateProps {
    operation: OperationModel
    budgetActif: boolean
    formDateInEdition: boolean
    errorDateOperation: string | null
    fillOperationForm: (field: OPERATION_EDITION_FORM, value: string) => void
}

export interface OperationDetailIntercompteProps {
    intercompte: string | null
    listeAutresComptes: CompteBancaireModel[]
    formIntercompteInEdition: boolean
    errorIntercompte: string | null
    fillOperationForm: (field: OPERATION_EDITION_FORM.INTERCOMPTES, value: string) => void
}

export interface OperationDetailLibelleProps {
    operation: OperationModel
    budgetActif: boolean
    listeComptes: CompteBancaireModel[]
    listeLibellesOperations: string[]
    formLibelleInEdition: boolean
    errorLibelle: string | null
    fillOperationForm: (field: OPERATION_EDITION_FORM, value: string) => void
}

export interface OperationDetailMensualiteProps {
    operation: OperationModel
    budgetActif: boolean
    formMensualiteInEdition: boolean
    fillOperationForm: (field: OPERATION_EDITION_FORM.MENSUALITE, value: string) => void
}

export interface OperationDetailValeurProps {
    operation: OperationModel
    budgetActif: boolean
    formValueInEdition: boolean
    errorValeur: string | null
    fillOperationForm: (field: OPERATION_EDITION_FORM.VALUE, value: string) => void
}

export interface OperationDetailPageProps {
    operation: OperationModel
    budget: BudgetMensuelModel
    listeCategories: CategorieOperationModel[]
    listeComptes: CompteBancaireModel[]
    listeLibellesOperations: string[]
    onOperationChange: (budget: BudgetMensuelModel) => void
}

export interface OperationsListeProps {
    operationGroupedByDate: {[key: string]: OperationModel[]}
    filterOperations: string | null
    listeComptes: CompteBancaireModel[]
    onClick: (operation : OperationModel) => void
}

export interface OperationItemProps {
    operation: OperationModel
    listeComptes: CompteBancaireModel[]
    onClick: (operation : OperationModel) => void
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