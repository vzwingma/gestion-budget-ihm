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
            let label = new Date();
            label.setMonth(mois);
            label.setFullYear(anneeAnalyses);
            datasTemporellesMois["name"] = label.toLocaleString('default', {month: 'long', year: 'numeric'});

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
