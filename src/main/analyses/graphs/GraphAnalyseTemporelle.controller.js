/**
 * Controleur de graphique pour l'analyse temporelle.
 */

/**
 * Remplit le graphique avec les données d'une catégorie.
 * @param {string} anneeAnalyses - L'année des analyses.
 * @param {Array} timelinesGroupedByCategories - Les analyses groupées par catégories.
 * @param {Array} timelinesSoldes - Les soldes
 * @param {Array} listeCategories - Le tableau des catégories.
 * @param {Boolean} filterSoldesActive - Le filtre des soldes.
 * @param {Array} datasTemporellesAnnee - Le tableau pour alimenter le graphique.
 */
export function populateGraphCategoriesEtSoldes(anneeAnalyses, timelinesGroupedByCategories, timelinesSoldes, listeCategories, filterSoldesActive, datasTemporellesAnnee) {

    console.log("Affichage de l'analyse temporelle pour", anneeAnalyses);
    Object.keys(timelinesGroupedByCategories)
        .forEach(mois => {
            let datasTemporellesMois = {};
            datasTemporellesMois["name"] = createLabelTimeline(mois, anneeAnalyses);

            listeCategories
                .filter(categorie => categorie.filterActive)
                .forEach(categorie => {
                    datasTemporellesMois[categorie.libelle] =
                        timelinesGroupedByCategories[mois][categorie.id] !== undefined ? Math.abs(timelinesGroupedByCategories[mois][categorie.id].total) : 0;
                    })

                // Ajout des soldes
                if (filterSoldesActive) {
                    datasTemporellesMois["Soldes"] = timelinesSoldes[mois] !== undefined ? timelinesSoldes[mois].totaux : [0, 0];
                }

                // Publication des données temporelles
                datasTemporellesAnnee.push(datasTemporellesMois);
        });
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
export function createLabelTimeline(mois, annee) {
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
