/**
 * Controleur de graphique pour l'analyse temporelle.
 */

/**
 * Remplit le graphique avec les données d'une catégorie.
 * @param {string} anneeAnalyses - L'année des analyses.
 * @param {Array} analysesGroupedByCategories - Les analyses groupées par catégories.
 * @param {Array} timelinesSoldes - Les soldes
 * @param {Array} listeCategories - Le tableau des catégories.
 * @param {Boolean} filterSoldesActive - Le filtre des soldes.
 * @param {Array} datasTemporellesAnnee - Le tableau pour alimenter le graphique.
 */
export function populateGraphCategoriesEtSoldes(anneeAnalyses, analysesGroupedByCategories, timelinesSoldes, listeCategories, filterSoldesActive, datasTemporellesAnnee) {

    console.log("Affichage de l'analyse temporelle pour", anneeAnalyses)

    for (let budgetId in analysesGroupedByCategories) {
        let datasTemporellesMois = {};
        let budgetIdParts = budgetId.split("_");
        if (budgetIdParts[1] === "" + anneeAnalyses) {

            let label = new Date();
            label.setMonth(budgetIdParts[2] - 1);
            datasTemporellesMois["name"] = label.toLocaleString('default', {month: 'long', year: 'numeric'});

            listeCategories
                .filter(categorie => categorie.filterActive)
                .forEach(categorie => {
                    datasTemporellesMois[categorie.libelle] =
                        analysesGroupedByCategories[budgetId][categorie.id] !== undefined ? Math.abs(analysesGroupedByCategories[budgetId][categorie.id].total) : 0;
                })

            // Ajout des soldes
            console.log(filterSoldesActive)
            if (filterSoldesActive) {
                datasTemporellesMois["Soldes"] = timelinesSoldes[budgetId] !== undefined ? timelinesSoldes[budgetId].totaux : [0, 0];
            }

            // Publication des données temporelles
            datasTemporellesAnnee.push(datasTemporellesMois);
        }
    }
}
