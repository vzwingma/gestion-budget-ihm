/**
 * Controleur de graphique pour l'analyse temporelle.
 */

import { AnalyseSoldesTimelineItemModel } from "../../../Models/analyses/temporelles/AnalyseSoldesTimelineItem.model";
import { AnalyseCategorieTimelineItem } from "../../../Models/analyses/temporelles/AnalyseCategorieTimelineItem.model";
import AnalyseSoldesCategorie from "../../../Models/analyses/temporelles/AnalyseSoldesCategorie.model";


interface DataTemporelleMois {
    id: string,
    name: string,
    categories: { [key: string]: number }
}


export interface DataTemporelleAnnee {
    datasTemporellesMois: { [key: string]: DataTemporelleMois }
}

/**
 * Remplit le graphique avec les données d'une catégorie.
 * @param {number} anneeAnalyses - L'année des analyses.
 * @param {Array} listeCategories - Le tableau des catégories.
 * @param {Array} timelinesGroupedByCategories - Les analyses groupées par catégories.
 * @param {Boolean} isAtTerminaison - Les soldes
 * @param {Array} datasTemporellesAnnee - Le tableau pour alimenter le graphique.
 */
export function populateGraphCategories(anneeAnalyses: number, listeCategories: AnalyseSoldesCategorie[], timelinesGroupedByCategories: { [key: string]: AnalyseCategorieTimelineItem }[], isAtTerminaison: boolean, datasTemporellesAnnee: DataTemporelleAnnee) {

    Object.keys(timelinesGroupedByCategories)
        .forEach((month: string) => {
            const mois = parseInt(month);

            let datasTemporellesMois: DataTemporelleMois;
            datasTemporellesMois = getDataTemporelleMois(datasTemporellesAnnee, mois, anneeAnalyses);

            if (datasTemporellesMois === undefined) {
                datasTemporellesMois = {
                    id: "id_" + mois + "_" + anneeAnalyses + "_" + (isAtTerminaison ? "prev_" : ""),
                    name: createLabelTimeline(mois, anneeAnalyses),
                    categories: {}
                };
            }
            // Ajout des données pour chaque catégorie

            listeCategories
                .filter(categorie => categorie.filterActive)
                .forEach(categorie => {
                    const timelinesCategory = Object.values(timelinesGroupedByCategories[mois])
                        .filter(timeline => timeline.categorie?.id === categorie.id)[0]
                    datasTemporellesMois.categories[(isAtTerminaison ? "prev_" : "") + categorie.libelleCategorie] =
                        timelinesCategory !== undefined ? Math.abs(timelinesCategory.total) : 0;

                })

            // Publication des données temporelles
            if (datasTemporellesAnnee.datasTemporellesMois === undefined) {
                datasTemporellesAnnee.datasTemporellesMois = {};
            }
            datasTemporellesAnnee.datasTemporellesMois[datasTemporellesMois.id] = datasTemporellesMois;
        });
}

/**
 * Remplit le graphique avec les données des soldes.
 * @param {number} anneeAnalyses - L'année des analyses.
 * @param {Array} timelinesSoldes - Les analyses groupées du soldes.
 * @param {Boolean} filterSoldesActive - Le filtre des soldes.
 * @param {Boolean} isAtTerminaison - Est-ce que c'est à la terminaison.
 * @param {Array} datasTemporellesAnnee - Le tableau pour alimenter le graphique.
 */
export function populateGraphSoldes(anneeAnalyses: number, timelinesSoldes: AnalyseSoldesTimelineItemModel[], filterSoldesActive: boolean, isAtTerminaison: boolean, datasTemporellesAnnee: DataTemporelleAnnee) {
    Object.keys(timelinesSoldes)
        .forEach((month: string) => {
            const mois = parseInt(month);

            let datasTemporellesMois: DataTemporelleMois;
            datasTemporellesMois = getDataTemporelleMois(datasTemporellesAnnee, mois, anneeAnalyses);
            
            // Ajout des soldes
            if (filterSoldesActive) {
                datasTemporellesMois.categories[(isAtTerminaison ? "prev_" : "") + "SoldesD"] = timelinesSoldes[mois] !== undefined ? timelinesSoldes[mois].soldeAtFinMoisPrecedent : 0;
                datasTemporellesMois.categories[(isAtTerminaison ? "prev_" : "") + "SoldesF"] = timelinesSoldes[mois] !== undefined ? timelinesSoldes[mois].soldeAtMaintenant : 0;
            }            
            datasTemporellesAnnee.datasTemporellesMois[datasTemporellesMois.id] = datasTemporellesMois;
        });
}

/**
 * Remplit les données pour le graphique temporel annuel avec les données des mois.
 * @param {Array} dataTemporelleAnnee
 * @param {number} mois
 * @param {number} anneeAnalyses
 */
function getDataTemporelleMois(dataTemporelleAnnee: DataTemporelleAnnee, mois: number, anneeAnalyses: number) {
    let label = createLabelTimeline(mois, anneeAnalyses);
    return Object.values(dataTemporelleAnnee.datasTemporellesMois)?.filter(dataTemporelleMois => dataTemporelleMois.name === label)[0];
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
export function createLabelTimeline(mois: number, annee: number) {
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
