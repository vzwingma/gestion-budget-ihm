/**
 * Contrôleur pour l'analyse de l'évolution des catégories par mois.
 */

import OperationModel from "../../../Models/budgets/Operation.model.ts";
import { GraphAnalyseTimelineItemModel } from "../../../Models/analyses/syntheses/GraphAnalyseMensuel.model.ts";
import { GraphAnalyseTimelineModel } from "../../../Models/analyses/syntheses/GraphAnalyseTimeline.model.ts";

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
 * Groupe les opérations par mois et catégorie et prépare les données pour le graphique
 * @param operations liste des opérations
 * @returns {GraphAnalyseTimelineItemModel[]} données préparées pour le graphique
 */
export function prepareGraphDataFromOperations(operations: OperationModel[]): GraphAnalyseTimelineItemModel[] {
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
                categories: {}
            };
        }

        // Ajouter la valeur de l'opération à la catégorie
        const entry = timelineData.dataGraphTimelineItem[key];
        if (!entry.categories[categoryLabel]) {
            entry.categories[categoryLabel] = 0;
        }
        entry.categories[categoryLabel] += Math.abs(operation.valeur);
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
            });

            delete flatEntry.categories;
            return flatEntry;
        });

        
        flatData.sort((a, b) => a.id.localeCompare(b.id));
    return flatData;
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
