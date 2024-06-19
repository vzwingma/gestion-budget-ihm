import {toast} from "react-toastify";
import {OPERATION_ETATS_ENUM} from "../../Utils/AppBusinessEnums.constants";
import * as Renderer from "../../Utils/renderers/CategorieItem.renderer";

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

interface SoldesTimelineItem {
    totaux: array
}

/**
 * Crée un nouveau résumé de catégorie
 * @returns Un objet CategorieTimelineItem avec les propriétés initialisées
 */
function createNewCategorieTimelineItem() {
    let newResumeCategorie: CategorieTimelineItem;
    newResumeCategorie = {
        categorie: {},
        nbTransactions: 0,
        total: 0
    };
    return newResumeCategorie;
}

/**
 * Calcule les analyses de temps pour les budgets donnés
 * @param {Array} budgetsData - Les données des budgets à analyser
 */
export function calculateTimelines(budgetsData) {
    console.log("Calcul de l'analyse des  [" + budgetsData.length + "] budgets");
    let listeCategories = [];
    let analysesGroupedByCategories = new Array(budgetsData.length);
    let timelinesSoldes = new Array(budgetsData.length);

    for (let budgetData of budgetsData) {
        analysesGroupedByCategories[budgetData.id] = calculateTimelineCategories(budgetData);

        timelinesSoldes[budgetData.id] = calculateTimelineSoldes(budgetData);

        // Identification de toutes les catégories présentes
        for (const categoryKey in analysesGroupedByCategories[budgetData.id]) {
            let category = analysesGroupedByCategories[budgetData.id][categoryKey].categorie;
            category.filterActive = true;
            if (!listeCategories.some((categorie) => categorie.id === category.id) && category.id !== null) {
                listeCategories.push(category);
            }
        }
    }
    listeCategories.sort((categorie1, categorie2) => categorie1.libelle.localeCompare(categorie2.libelle));
    this.setState({
        currentBudgets: budgetsData,
        listeCategories: listeCategories,
        analysesGroupedByCategories: analysesGroupedByCategories,
        timelinesSoldes: timelinesSoldes
    })
    toast.success("Analyse des budgets correctement effectuée ")
}

/**
 * Calcule l'analyse de temps pour un budget donné
 * @param {Object} budgetData - Les données du budget à analyser
 * @returns {Object} Un objet contenant les résultats de l'analyse
 */
export function calculateTimelineCategories(budgetData) {
    // console.log(" - Analyse du budget [" + budgetData.id + "] : " + budgetData.listeOperations.length + " opérations")
    return budgetData.listeOperations
        .filter(operation => operation.etat === OPERATION_ETATS_ENUM.REALISEE && operation.categorie !== null)
        .reduce((group, operation) => {
            let couleurCategorie = Renderer.getCategorieColor(operation.categorie);
            populateCategorie(group, operation, operation.categorie, couleurCategorie);
            return group;
        }, {});
}


/**
 * Peuple une catégorie avec les données d'une opération
 * @param {Object} group - Le groupe de catégories à peupler
 * @param {Object} operation - L'opération à traiter
 * @param {Object} categorie - La catégorie à peupler
 * @param {String} couleurCategorie - La couleur de la catégorie
 */
function populateCategorie(group, operation, categorie, couleurCategorie) {

    group[categorie.id] = group[categorie.id] ?? createNewCategorieTimelineItem();
    categorie.couleurCategorie = couleurCategorie;
    group[categorie.id].categorie = categorie;
    // init des tableaux
    group[categorie.id].nbTransactions = group[categorie.id].nbTransactions ?? 0;
    group[categorie.id].nbTransactions = group[categorie.id].nbTransactions + 1;
    group[categorie.id].total = group[categorie.id].total ?? 0;
    group[categorie.id].total = Math.ceil(group[categorie.id].total + operation.valeur);
}


/**
 * Calcule l'analyse de temps pour les soldes d'un budget donné
 * @param budgetData - Les données du budget à analyser
 * @returns {SoldesTimelineItem} Un objet contenant les résultats de l'analyse
 */
export function calculateTimelineSoldes(budgetData) {
    let newTimelineSoldes: SoldesTimelineItem;
    newTimelineSoldes = {
        totaux: []
    };
    newTimelineSoldes.totaux.push(Math.ceil(budgetData.soldes.soldeAtFinMoisPrecedent));
    newTimelineSoldes.totaux.push(Math.ceil(budgetData.soldes.soldeAtFinMoisCourant));
    return newTimelineSoldes;
}


/**
 * Gère le changement de l'année courante
 * @param {Number} currentAnnee - L'année courante
 */
export function onAnneeChange(currentAnnee) {

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
