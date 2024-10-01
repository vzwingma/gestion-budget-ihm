/**
 * Controleur de graphique pour l'analyse temporelle.
 */

import SoldeCategorieModel from "../../../Models/SoldeCategorie.model";
import SoldeMensuelModel from "../../../Models/SoldeMensuel.model";
import { CategorieTimelineItem } from "../temporelles/AnalyseTemporelle.controller";

/**
 * Remplit le graphique avec les données d'une catégorie.
 * @param {number} anneeAnalyses - L'année des analyses.
 * @param {Array} listeCategories - Le tableau des catégories.
 * @param {Array} timelinesGroupedByCategories - Les analyses groupées par catégories.
 * @param {Boolean} isAtTerminaison - Les soldes
 * @param {Array} datasTemporellesAnnee - Le tableau pour alimenter le graphique.
 */
export function populateGraphCategories(anneeAnalyses : number, listeCategories : SoldeCategorieModel[], timelinesGroupedByCategories : CategorieTimelineItem[][], isAtTerminaison : boolean, datasTemporellesAnnee : any[]) {

    Object.keys(timelinesGroupedByCategories)
        .forEach((month: string) => {
            const mois = parseInt(month);
            /*
            let datasTemporellesMois : any[] = [];
            let indxTemporellesMois = getDataTemporelleMois(datasTemporellesAnnee, mois, anneeAnalyses);
            if (indxTemporellesMois === -1) {
                datasTemporellesMois = {
                    id: "id_" + mois + "_" + anneeAnalyses + "_" + (isAtTerminaison ? "prev_" : ""),
                    name: createLabelTimeline(mois, anneeAnalyses)
                };
            } else {
                datasTemporellesMois = datasTemporellesAnnee[indxTemporellesMois];
            }
            // Ajout des données pour chaque catégorie
            listeCategories
                .filter(categorie => categorie.filterActive)
                .forEach(categorie => {
                    datasTemporellesMois[(isAtTerminaison ? "prev_" : "") + categorie.libelle] =
                        timelinesGroupedByCategories[mois][categorie.id] !== undefined ? Math.abs(timelinesGroupedByCategories[mois][categorie.id].total) : 0;
                    })
                // Publication des données temporelles
            if (indxTemporellesMois === -1) {
                datasTemporellesAnnee.push(datasTemporellesMois);
            } else {
                datasTemporellesAnnee[indxTemporellesMois] = datasTemporellesMois;
            } */
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
export function populateGraphSoldes(anneeAnalyses : number, timelinesSoldes : SoldeMensuelModel[], filterSoldesActive : boolean, isAtTerminaison : boolean, datasTemporellesAnnee : SoldeMensuelModel[]) {
    Object.keys(timelinesSoldes)
        .forEach((month: string) => {
            const mois = parseInt(month);
            /*
            let indxTemporellesMois = getDataTemporelleMois(datasTemporellesAnnee, mois, anneeAnalyses);
            let datasTemporellesMois = datasTemporellesAnnee[indxTemporellesMois];

            // Ajout des soldes
            
            if (filterSoldesActive) {
                datasTemporellesMois[(isAtTerminaison ? "prev_" : "") + "SoldesD"] = timelinesSoldes[mois] !== undefined ? timelinesSoldes[mois].totaux[0] : 0;
                datasTemporellesMois[(isAtTerminaison ? "prev_" : "") + "SoldesF"] = timelinesSoldes[mois] !== undefined ? timelinesSoldes[mois].totaux[1] : 0;
            }
   
            datasTemporellesAnnee[indxTemporellesMois] = datasTemporellesMois;
                         */
        });
}

/**
 * Remplit les données pour le graphique temporel annuel avec les données des mois.
 * @param {Array} dataTemporelleAnnee
 * @param {number} mois
 * @param {number} anneeAnalyses

function getDataTemporelleMois(dataTemporelleAnnee, mois : number, anneeAnalyses : number) {
    let label = createLabelTimeline(mois, anneeAnalyses);
    return dataTemporelleAnnee.findIndex(dataTemporelleMois => dataTemporelleMois.name === label);
}
 */
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
export function createLabelTimeline(mois : number, annee : number) {
    let label = new Date();
    label.setMonth(mois);
    label.setFullYear(annee);

    let aujourdhui = new Date();
    if (label.getFullYear() === aujourdhui.getFullYear()) {
        if (label.getMonth() === aujourdhui.getMonth()) {
            return "courant " + label.toLocaleString('default', {month: 'long', year: 'numeric'});
        } else if (label.getMonth() > aujourdhui.getMonth()) {
            return "fin " + aujourdhui.toLocaleString('default', {month: 'long', year: 'numeric'});
        }
    }
    return label.toLocaleString('default', {month: 'long', year: 'numeric'});
}
