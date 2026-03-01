/**
 * Contrôleur pour l'analyse de l'évolution des catégories par mois.
 */

import OperationModel from "../../../Models/budgets/Operation.model.ts";
import { GraphAnalyseTimelineItemModel } from "../../../Models/analyses/syntheses/GraphAnalyseMensuel.model.ts";
import { GraphAnalyseTimelineModel } from "../../../Models/analyses/syntheses/GraphAnalyseTimeline.model.ts";
import { OPERATION_ETATS_ENUM } from "../../../Utils/AppBusinessEnums.constants.ts";
import BudgetMensuelAnalyseConsolideModel from "../../../Models/budgets/BudgetMensuel.analyse.consolide.model.ts";

/**
 * Extrait le mois et l'année d'une date d'opération
 * @param operation opération
 * @returns {[month: number, year: number]} tuple avec le mois (0-11) et l'année
 */
export function getMonthYearFromOperation(operation: OperationModel): [month: number, year: number] {
    if (!operation.autresInfos?.dateOperation) {
        return [new Date().getMonth(), new Date().getFullYear()];
    }
    const date = new Date(operation.autresInfos.dateOperation);
    return [date.getMonth(), date.getFullYear()];
}

/**
 * Crée un label unique pour une période mois/année
 * @param month mois (0-11)
 * @param year année
 * @returns {string} label unique
 */
function createTimelineLabel(month: number, year: number): string {
    const date = new Date();
    date.setMonth(month);
    date.setFullYear(year);
    return date.toLocaleString('default', { month: 'long', year: 'numeric' });
}

/**
 * Extrait la clé mois YYYY-MM depuis l'id de la timeline (format attendu: evolution_YYYY_M)
 * @param timelineId identifiant de la timeline au format evolution_YYYY_M
 * @returns {string | null} clé au format YYYY-MM ou null si format invalide
 */
function extractMonthKeyFromTimelineId(timelineId?: string): string | null {
    if (!timelineId?.startsWith('evolution_')) {
        return null;
    }

    const parts = timelineId.replace('evolution_', '').split('_');
    if (parts.length !== 2) {
        return null;
    }

    const year = Number(parts[0]);
    const monthIndex = Number(parts[1]);

    if (Number.isNaN(year) || Number.isNaN(monthIndex)) {
        return null;
    }

    return `${year}-${String(monthIndex + 1).padStart(2, '0')}`;
}

/**
 * Prépare les données pour la vue mensuelle (date courante vs fin du mois)
 * @param operations liste des opérations
 * @returns {GraphAnalyseTimelineItemModel[]} deux points de données: aujourd'hui et fin du mois
 */
function prepareMonthlyViewData(budgetConsolide: BudgetMensuelAnalyseConsolideModel, operations: OperationModel[]): GraphAnalyseTimelineItemModel[] {
    const categoriesMap = new Map<string, boolean>();

    // Point 1: Date courante avec opérations réalisées
    const currentDateData: GraphAnalyseTimelineItemModel = {
        id: 'current_date',
        name: 'Date courante',
        categories: {},
        absCategories: {}
    };

    // Point 2: Fin du mois avec toutes les opérations
    const endOfMonthData: GraphAnalyseTimelineItemModel = {
        id: 'end_of_month',
        name: 'Fin du mois',
        categories: {},
        absCategories: {}
    };

    operations.forEach(operation => {
        const categoryLabel = operation.categorie?.libelle || "Sans catégorie";
        categoriesMap.set(categoryLabel, true);

        // Ajouter à la fin du mois (toutes les opérations)
        if (!endOfMonthData.categories[categoryLabel]) {
            endOfMonthData.categories[categoryLabel] = 0;
            endOfMonthData.absCategories[categoryLabel] = 0;
        }
        endOfMonthData.categories[categoryLabel] += operation.valeur;
        endOfMonthData.absCategories[categoryLabel] += Math.abs(operation.valeur);

        // Ajouter à la date courante seulement si réalisée
        if (operation.etat === OPERATION_ETATS_ENUM.REALISEE) {
            if (!currentDateData.categories[categoryLabel]) {
                currentDateData.categories[categoryLabel] = 0;
                currentDateData.absCategories[categoryLabel] = 0;
            }
            currentDateData.categories[categoryLabel] += operation.valeur;
            currentDateData.absCategories[categoryLabel] += Math.abs(operation.valeur);
        }
    });

    // Aplatir les données pour Recharts
    const flattenData = (data: GraphAnalyseTimelineItemModel): GraphAnalyseTimelineItemModel => {
        const flattened: any = {
            id: data.id,
            name: data.name
        };

        categoriesMap.forEach((_, categoryLabel) => {
            flattened[categoryLabel] = data.categories[categoryLabel] || 0;
            flattened[`abs_${categoryLabel}`] = data.absCategories[categoryLabel] || 0;
        });

        return flattened;
    };

    const flattenedData = [flattenData(currentDateData), flattenData(endOfMonthData)];
    
    // Ajouter les soldes depuis budgetConsolide.soldesParMois
    // Identifier le mois courant depuis les opérations
    if (operations.length > 0 && budgetConsolide?.soldesParMois) {
        const [month, year] = getMonthYearFromOperation(operations[0]);
        const monthKey = `${year}-${String(month + 1).padStart(2, '0')}`;
        
        if (budgetConsolide.soldesParMois[monthKey]) {
            const soldes = budgetConsolide.soldesParMois[monthKey] as any;
            // currentDateData: solde actuel (soldeAtMaintenant)
            flattenedData[0].solde = soldes.soldeAtMaintenant ?? 0;
            // endOfMonthData: solde de fin de mois (soldeAtFinMoisCourant)
            flattenedData[1].solde = soldes.soldeAtFinMoisCourant ?? 0;
        }
    }
    
    return flattenedData;
}


/**
 * Préparation des données pour la vue périodique (évolution mois par mois)
 * @param budgetConsolide  budget consolidé pour l'analyse, contenant les soldes par mois
 * @param operations liste des opérations à analyser
 * @returns les données de la vue périodique
 */
function preparePeriodViewData(budgetConsolide: BudgetMensuelAnalyseConsolideModel, operations: OperationModel[]): GraphAnalyseTimelineItemModel[] {
    const timelineData: GraphAnalyseTimelineModel = { dataGraphTimelineItem: {} };
    const categoriesMap = new Map<string, boolean>(); // Pour tracer les catégories actives


    // Première passe: regrouper les opérations par mois et catégorie
    operations.forEach(operation => {
        const [month, year] = getMonthYearFromOperation(operation);
        const key = `${year}_${month}`;
        const label = createTimelineLabel(month, year);
        const categoryLabel = operation.categorie?.libelle || "Sans catégorie";

        // Enregistrer les catégories utilisées
        categoriesMap.set(categoryLabel, true);

        // Obtenir ou créer l'entrée pour cette période
        if (!timelineData.dataGraphTimelineItem[key]) {
            timelineData.dataGraphTimelineItem[key] = {
                id: `evolution_${key}`,
                name: label,
                categories: {},
                absCategories: {}
            };
        }

        // Ajouter la valeur de l'opération à la catégorie
        const entry = timelineData.dataGraphTimelineItem[key];
        if (!entry.categories[categoryLabel]) {
            entry.categories[categoryLabel] = 0;
            entry.absCategories[categoryLabel] = 0;
        }
        entry.categories[categoryLabel] += operation.valeur;
        entry.absCategories[categoryLabel] += Math.abs(operation.valeur);   
    });

    // Deuxième passe: aplatir les données et ajouter les catégories à chaque mois
    const flatData = Object.values(timelineData.dataGraphTimelineItem)
        .sort((a, b) => a.name.localeCompare(b.name))
        .map(monthData => {
            const flatEntry: any = {
                ...monthData,
                name: monthData.name
            };

            // Ajouter toutes les catégories pour chaque mois (avec 0 si pas de données)
            categoriesMap.forEach((_value, categoryLabel) => {
                flatEntry[categoryLabel] = monthData.categories[categoryLabel] || 0;
                flatEntry[`abs_${categoryLabel}`] = monthData.absCategories[categoryLabel] || 0;
            });

            delete flatEntry.categories;
            delete flatEntry.absCategories;
            return flatEntry;
        });


    flatData.sort((a, b) => a.id.localeCompare(b.id));
    
    // Troisième passe: ajouter l'évolution du solde mois par mois depuis budgetConsolide.soldesParMois
    // Règle: premier mois = soldeAtFinMoisPrecedent, mois suivants = soldeAtFinMois
    const soldesParMois = budgetConsolide?.soldesParMois || {};
    flatData.forEach((dataItem, index) => {
        // Extraire la clé YYYY-MM depuis l'id (format: evolution_YYYY_M)
        const monthKey = extractMonthKeyFromTimelineId(dataItem.id);
        if (monthKey && soldesParMois[monthKey]) {
            const soldes = soldesParMois[monthKey] as any;
            const soldeAtFinMois = soldes.soldeAtFinMois ?? soldes.soldeAtFinMoisCourant ?? 0;
            // Premier mois: soldeAtFinMoisPrecedent, autres mois: soldeAtFinMois
            dataItem.solde = index === 0 ? (soldes.soldeAtFinMoisPrecedent ?? 0) : soldeAtFinMois;
        }
    });
    
    return flatData;
}
/**
 * Groupe les opérations par mois et catégorie et prépare les données pour le graphique
 * @param operations liste des opérations
 * @param isVueMensuelle si true, affiche la vue mensuelle (date courante vs fin du mois)
 * @returns {GraphAnalyseTimelineItemModel[]} données préparées pour le graphique
 */
export function prepareGraphDataFromOperations(budgetConsolide: BudgetMensuelAnalyseConsolideModel, operations: OperationModel[], isVueMensuelle: boolean = false): GraphAnalyseTimelineItemModel[] {
    return isVueMensuelle ? prepareMonthlyViewData(budgetConsolide, operations) : preparePeriodViewData(budgetConsolide, operations);
}

/**
 * Extrait la liste unique des catégories des opérations
 * @param operations liste des opérations
 * @returns {Array<{libelle: string}>} liste des catégories uniques
 */
export function extractUniqueCategories(operations: OperationModel[]): Array<{ id: string, libelle: string }> {
    const categoriesMap = new Map<string, { id: string, libelle: string }>();

    operations.forEach(operation => {
        const categoryLabel = operation.categorie?.libelle || "Sans catégorie";
        if (!categoriesMap.has(categoryLabel)) {
            categoriesMap.set(categoryLabel, {
                libelle: categoryLabel,
                id: operation.categorie?.id || null
            });
        }
    });

    return Array.from(categoriesMap.values());
}
