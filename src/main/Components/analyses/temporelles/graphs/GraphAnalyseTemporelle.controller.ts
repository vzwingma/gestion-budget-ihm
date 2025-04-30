/**
 * Controleur de graphique pour l'analyse temporelle.
 */

import {AnalyseSoldesTimelineItemModel} from "../../../../Models/analyses/temporelles/AnalyseSoldesTimelineItem.model";
import {AnalyseCategorieTimelineItem} from "../../../../Models/analyses/temporelles/AnalyseCategorieTimelineItem.model";
import AnalyseSoldesCategorie from "../../../../Models/analyses/temporelles/AnalyseSoldesCategorie.model";
import {GraphAnalyseTimelineItemModel} from "../../../../Models/analyses/temporelles/GraphAnalyseMensuel.model";
import {GraphAnalyseTimelineModel} from "../../../../Models/analyses/temporelles/GraphAnalyseTimeline.model";
import {SOLDES_ENUM} from "./GraphAnalyseTemporelle.constant";


/**
 * Remplit le graphique avec les données d'une catégorie.
 * @param analyseSoldesCategoriesData
 * @param {Array} timelinesGroupedByCategories - Les analyses groupées par catégories.
 * @param {Boolean} isAtTerminaison - Les soldes
 * @param dataGraphTimeline
 */
export function populateGraphCategories(analyseSoldesCategoriesData: AnalyseSoldesCategorie[], timelinesGroupedByCategories: {
    [key: string]: AnalyseCategorieTimelineItem
}[], isAtTerminaison: boolean, dataGraphTimeline: GraphAnalyseTimelineModel) {
    Object.keys(timelinesGroupedByCategories)
        .forEach((month: string) => {
            const idxMonth = parseInt(month);
            const anneeAnalyses = Object.values(timelinesGroupedByCategories[idxMonth])?.at(0)?.annee ?? 0;
            if (anneeAnalyses === 0) {
                return;
            }
            let datasTemporellesMois: GraphAnalyseTimelineItemModel;
            datasTemporellesMois = getDataGraphTimelineItem(dataGraphTimeline, idxMonth, anneeAnalyses);
            if (datasTemporellesMois === undefined) {
                datasTemporellesMois = {
                    id: "id_" + idxMonth + "_" + anneeAnalyses + "_" + (isAtTerminaison ? SOLDES_ENUM.PREVISIONNEL : SOLDES_ENUM.REEL),
                    name: createLabelTimeline(idxMonth, anneeAnalyses),
                    categories: {}
                };

            }
            // Ajout des données pour chaque catégorie
            analyseSoldesCategoriesData
                .filter(categorie => categorie.filterActive)
                .forEach(categorie => {
                    const timelinesCategory = Object.values(timelinesGroupedByCategories[idxMonth])
                        .filter(timeline => timeline.categorie?.id === categorie.id)[0]
                    datasTemporellesMois.categories[(isAtTerminaison ? SOLDES_ENUM.PREVISIONNEL : SOLDES_ENUM.REEL) + categorie.libelleCategorie] =
                        timelinesCategory !== undefined ? Math.abs(timelinesCategory.total) : 0;

                })

            // Publication des données temporelles
            if (dataGraphTimeline.dataGraphTimelineItem === undefined) {
                dataGraphTimeline.dataGraphTimelineItem = {};
            }
            dataGraphTimeline.dataGraphTimelineItem[datasTemporellesMois.id] = datasTemporellesMois;
        });
}

/**
 * Remplit le graphique avec les données des soldes.
 * @param {Array} timelinesSoldes - Les analyses groupées du soldes.
 * @param {Boolean} filterSoldesActive - Le filtre des soldes.
 * @param {Boolean} isAtTerminaison - Est-ce que c'est à la terminaison.
 * @param {Array} dataGraphTimeline - Le tableau pour alimenter le graphique.
 */
export function populateGraphSoldes(timelinesSoldes: AnalyseSoldesTimelineItemModel[], filterSoldesActive: boolean, isAtTerminaison: boolean, dataGraphTimeline: GraphAnalyseTimelineModel) {
    Object.keys(timelinesSoldes)
        .forEach((month: string) => {
            const idxMois = parseInt(month);
            const anneeAnalyses = timelinesSoldes[idxMois]?.annee ?? 0;
            if (anneeAnalyses === 0) {
                return;
            }
            let dataGraphTimelineItem: GraphAnalyseTimelineItemModel;
            dataGraphTimelineItem = getDataGraphTimelineItem(dataGraphTimeline, idxMois, anneeAnalyses);
            if (dataGraphTimelineItem === undefined) {
                return;

            }
            // Ajout des soldes
            if (filterSoldesActive) {
                dataGraphTimelineItem.categories[(isAtTerminaison ? SOLDES_ENUM.PREVISIONNEL : SOLDES_ENUM.REEL) + SOLDES_ENUM.SOLDE_COURANT] = timelinesSoldes[idxMois] !== undefined ? timelinesSoldes[idxMois].soldeAtFinMoisPrecedent : 0;
                dataGraphTimelineItem.categories[(isAtTerminaison ? SOLDES_ENUM.PREVISIONNEL : SOLDES_ENUM.REEL) + SOLDES_ENUM.SOLDE_FIN] = timelinesSoldes[idxMois] !== undefined ? timelinesSoldes[idxMois].soldeAtMaintenant : 0;
            }
            dataGraphTimeline.dataGraphTimelineItem[dataGraphTimelineItem.id] = dataGraphTimelineItem;
        });
}


/**
 * Récupère un élément de la timeline du graphique d'analyse temporelle.
 *
 * @param {GraphAnalyseTimelineModel} dataGraphTimeline - Le modèle de la timeline du graphique d'analyse.
 * @param {number} idxMonth - Le idxMonth pour lequel récupérer l'élément de la timeline.
 * @param {number} anneeAnalyses - L'année des analyses pour laquelle récupérer l'élément de la timeline.
 * @returns {GraphAnalyseTimelineItemModel} L'élément de la timeline correspondant au idxMonth et à l'année spécifiés, ou undefined s'il n'existe pas.
 */
function getDataGraphTimelineItem(dataGraphTimeline: GraphAnalyseTimelineModel, idxMonth: number, anneeAnalyses: number): GraphAnalyseTimelineItemModel {
    let label = createLabelTimeline(idxMonth, anneeAnalyses);
    return Object.values(dataGraphTimeline.dataGraphTimelineItem)?.filter(dataGraphTimelineItem => dataGraphTimelineItem.name === label)[0];
}


/**
 * Crée un nouvel élément de la timeline du graphique d'analyse temporelle.
 *
 * @returns {GraphAnalyseTimelineItemModel[]} Le nouvel élément de la timeline.
 */
export function flatCategoriesData(dataGraphTimeline: GraphAnalyseTimelineModel, analyseSoldesCategoriesData: AnalyseSoldesCategorie[], filterSoldesActive: boolean): GraphAnalyseTimelineItemModel[] {
    const dataByCategories: GraphAnalyseTimelineItemModel[] = Object.values(dataGraphTimeline.dataGraphTimelineItem);

    for(let dataByMonth of dataByCategories) {
        for (let categorie of analyseSoldesCategoriesData) {
            dataByMonth[categorie.libelleCategorie] = dataByMonth.categories[categorie.libelleCategorie];
            dataByMonth[SOLDES_ENUM.PREVISIONNEL + categorie.libelleCategorie] = dataByMonth.categories[SOLDES_ENUM.PREVISIONNEL + categorie.libelleCategorie];
        }
        if (filterSoldesActive) {
            dataByMonth[SOLDES_ENUM.SOLDE_COURANT] = dataByMonth.categories[SOLDES_ENUM.SOLDE_COURANT];
            dataByMonth[SOLDES_ENUM.SOLDE_FIN] = dataByMonth.categories[SOLDES_ENUM.SOLDE_FIN];
            dataByMonth[SOLDES_ENUM.PREVISIONNEL+SOLDES_ENUM.SOLDE_COURANT] = dataByMonth.categories[SOLDES_ENUM.PREVISIONNEL+SOLDES_ENUM.SOLDE_COURANT];
            dataByMonth[SOLDES_ENUM.PREVISIONNEL+SOLDES_ENUM.SOLDE_FIN] = dataByMonth.categories[SOLDES_ENUM.PREVISIONNEL+SOLDES_ENUM.SOLDE_FIN];
        }
        delete (dataByMonth as {categories?: { [idCategorie: string]: number }}).categories;
    }
    return dataByCategories;
}


/**
 * Crée un label pour une chronologie basée sur le mois et l'année donnés.
 *
 * Cette fonction crée un label pour une chronologie en créant un nouvel objet Date et en définissant le mois et l'année sur les valeurs fournies.
 * Elle compare ensuite cette date à la date actuelle :
 * - Si l'année de l'étiquette et l'année actuelle sont les mêmes :
 *   - Si le mois de l'étiquette et le mois actuel sont les mêmes, elle renvoie une chaîne au format "courant [mois] [année]".
 *   - Si le mois de l'étiquette est supérieur au mois actuel, elle renvoie une chaîne au format "fin [mois actuel] [année actuelle]".
 * - Si l'année de l'étiquette n'est pas la même que l'année actuelle, elle renvoie une chaîne au format "[mois] [année]".
 *
 * @param {number} mois - Le mois pour l'étiquette de la chronologie (0 pour janvier, 1 pour février, etc.).
 * @param {number} annee - L'année pour l'étiquette de la chronologie.
 * @returns {string} - L'étiquette pour la chronologie.
 */
export function createLabelTimeline(mois: number, annee: number): string {
    let label = new Date();
    label.setMonth(mois);
    label.setFullYear(annee);

    let aujourdhui = new Date();
    if (label.getFullYear() === aujourdhui.getFullYear()) {
        if (label.getMonth() === aujourdhui.getMonth()) {
            return "courant " + label.toLocaleString('default', { month: 'long', year: 'numeric' });
        } else if (label.getMonth() > aujourdhui.getMonth()) {
            return "fin " + aujourdhui.toLocaleString('default', { month: 'long', year: 'numeric' });
        }
    }
    return label.toLocaleString('default', { month: 'long', year: 'numeric' });
}
