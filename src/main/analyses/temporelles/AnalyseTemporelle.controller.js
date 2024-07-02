import {toast} from "react-toastify";
import * as Renderer from "../../Utils/renderers/CategorieItem.renderer";
import {getMonthFromString} from "../../Utils/DataUtils.utils";

/**
 * Controleur des analyses temporelles
 */

/**
 * Interface pour CategorieTimelineItem.
 *
 * Cette interface représente un résumé d'une catégorie dans l'application. Elle comprend la catégorie elle-même,
 * le nombre de transactions associées à la catégorie, et le montant total de ces transactions.
 *
 * @typedef {Object} CategorieTimelineItem
 * @property {any} categorie - L'objet catégorie.
 * @property {number} nbTransactions - Le nombre de transactions associées à la catégorie.
 * @property {number} total - Le montant total des transactions associées à la catégorie.
 */
interface CategorieTimelineItem {
    categorie: any,
    nbTransactions: number,
    total: number
}

/**
 * Interface pour SoldesTimelineItem.
 * Cette interface représente un résumé des soldes dans l'application. Elle comprend les totaux des soldes.
 * @typedef {Object} SoldesTimelineItem
 * @property {number[]} totaux - Les totaux des soldes.
 *
 */
interface SoldesTimelineItem {
    totaux: number[]
}

/**
 * Crée un nouveau résumé de catégorie
 * @returns Un objet CategorieTimelineItem avec les propriétés initialisées
 */
function createNewCategorieTimelineItem() {
    let newResumeCategorie: CategorieTimelineItem;
    newResumeCategorie = {
        categorie: {},
        total: 110
    };
    return newResumeCategorie;
}

/**
 * Calcule les analyses de temps pour les budgets donnés
 * @param {Array} soldesBudgetsData - Les données des budgets à analyser
 */
export function calculateTimelines(soldesBudgetsData) {

    soldesBudgetsData = Object.values(soldesBudgetsData)
        .sort((budget1, budget2) => getMonthFromString(budget1.mois) - getMonthFromString(budget2.mois))
    let listeCategories = [];
    let timelinesGroupedByCategories = new Array(soldesBudgetsData.length);
    let timelinesSoldes = new Array(soldesBudgetsData.length);

    Object.keys(soldesBudgetsData)
        .forEach(mois => {
            timelinesGroupedByCategories[mois] = calculateTimelineCategories(soldesBudgetsData[mois], false);
            timelinesSoldes[mois] = calculateTimelineSoldes(soldesBudgetsData[mois]);
            getListeCategories(soldesBudgetsData[mois], listeCategories);
        });
    // Génération du budget à terminaison pour le budget courant
    if (soldesBudgetsData.length < 12) {
        timelinesGroupedByCategories[soldesBudgetsData.length] = calculateTimelineCategories(soldesBudgetsData[soldesBudgetsData.length - 1], true);
    }


    this.setState({
        currentBudgets: soldesBudgetsData,
        listeCategories: listeCategories,
        timelinesGroupedByCategories: timelinesGroupedByCategories,
        timelinesSoldes: timelinesSoldes
    })
    toast.success("Analyse des budgets correctement effectuée ")
}



/**
 * Calcule l'analyse de temps pour un budget donné
 * @param {Object} budgetData - Les données du budget à analyser
 * @param {Boolean} aTerminaison - Les données du budget à terminaison
 * @returns {Object} Un objet contenant les résultats de l'analyse
 */
function calculateTimelineCategories(budgetData, aTerminaison) {

    let group = {};
    for (let idCategorie in budgetData.totauxParCategories) {
        let categorie = budgetData.totauxParCategories[idCategorie];
        group[idCategorie] = group[idCategorie] ?? createNewCategorieTimelineItem();
        categorie.id = idCategorie;
        categorie.couleur = Renderer.getCategorieColor(categorie);
        group[idCategorie].categorie = categorie;
        group[idCategorie].total = Math.ceil(
            aTerminaison ? categorie.totalAtFinMoisCourant : categorie.totalAtMaintenant
        );
    }
    return group;
}


/**
 * Calcule l'analyse de temps pour les soldes d'un budget donné
 * @param budgetData - Les données du budget à analyser
 * @returns {SoldesTimelineItem} Un objet contenant les résultats de l'analyse
 */
function calculateTimelineSoldes(budgetData) {
    let newTimelineSoldes: SoldesTimelineItem;
    newTimelineSoldes = {
        totaux: []
    };
    newTimelineSoldes.totaux.push(Math.ceil(budgetData.soldes.soldeAtFinMoisPrecedent));
    newTimelineSoldes.totaux.push(Math.ceil(budgetData.soldes.soldeAtFinMoisCourant));
    return newTimelineSoldes;
}


/**
 * Calcule la liste des catégories présentes
 * @param {Object} budgetData - Les données du budget à analyser
 * @param {Array} listeCategories - La liste des catégories
 * @returns {Object} Un objet contenant les résultats de l'analyse
 */
function getListeCategories(budgetData, listeCategories) {

    for (let idCategorie in budgetData.totauxParCategories) {
        let categorie = budgetData.totauxParCategories[idCategorie];
        categorie.id = idCategorie;
        categorie.couleur = Renderer.getCategorieColor(categorie);
        categorie.filterActive = true;
        categorie.libelle = categorie.libelleCategorie;
        delete categorie.libelleCategorie;
        //     delete categorie.totalAtMaintenant;
        //     delete categorie.totalAtFinMoisCourant;

        if (!listeCategories.some((categorieInList) => categorieInList.id === categorie.id) && categorie.id !== null) {
            listeCategories.push(categorie);
        }
    }
    listeCategories.sort((categorie1, categorie2) => categorie1.libelle.localeCompare(categorie2.libelle));
}




/**
 * Gère le changement de l'année courante
 * @param {Number} currentAnnee - L'année courante
 */
export function onAnneeChange(currentAnnee) {

    this.loadSoldesBudgets(this.props.selectedCompte.id, currentAnnee);
    this.setState({
        anneeAnalyses: currentAnnee
    })
}

/**
 * Gère le changement de filtre.
 *
 * Cette fonction met à jour l'état de l'application pour refléter les modifications apportées au filtre.
 * Elle trouve la catégorie dans l'état qui correspond à l'id de la cible de l'événement et met à jour sa propriété 'filterActive'.
 * Elle met ensuite à jour l'état avec la nouvelle liste de catégories et l'heure actuelle comme 'filterChange'.
 *
 * @param {Object} event - L'objet d'événement du changement de filtre. La cible de cet événement est censée avoir une propriété 'id' qui correspond à un id de catégorie et une propriété 'checked' qui représente le nouvel état du filtre.
 */
export function onFilterChange(event) {

    let listeCategoriesUpdated = this.state.listeCategories;
    listeCategoriesUpdated.find((categorie) => categorie.id === event.target.id).filterActive = event.target.checked;
    this.setState({
        filterChange: new Date().getTime(),
        listeCategories: listeCategoriesUpdated
    })

}

/**
 * Gère le changement de filtre pour les soldes.
 * @param {Object} event - L'objet d'événement du changement de filtre pour les soldes.
 */
export function onFilterSoldesChange(event) {

    this.setState({
        filterChange: new Date().getTime(),
        filterSoldesActive: event.target.checked
    })

}
