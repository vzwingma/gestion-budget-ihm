import {toast} from "react-toastify";
import {OPERATION_ETATS_ENUM} from "../../Utils/AppBusinessEnums.constants";
import * as Renderer from "../../Utils/renderers/CategorieItem.renderer";

/**
 * Controleur des analyses temporelles
 */

/**
 * Crée un nouveau résumé de catégorie
 * @returns {ResumeCategorie} Un objet ResumeCategorie avec les propriétés initialisées
 */
function createNewResumeCategorie() {
    let newResumeCategorie: ResumeCategorie =
        {
            categorie: {},
            nbTransactions: 0,
            total: 0
        }
    return newResumeCategorie;
}

/**
 * Calcule les analyses de temps pour les budgets donnés
 * @param {Array} budgetsData - Les données des budgets à analyser
 */
export function calculateTimelines(budgetsData) {
    console.log("Calcul de l'analyse des  [" + budgetsData.length + "] budgets");

    var analysesGroupedByCategories = new Array(budgetsData.length);
    for (let i = 0; i < budgetsData.length; i++) {
        analysesGroupedByCategories[budgetsData[i].id] = calculateTimeline(budgetsData[i]);
    }

    this.setState({
        currentBudgets: budgetsData,
        analysesGroupedByCategories: analysesGroupedByCategories
    })
    toast.success("Analyse des budgets correctement effectuée ")
}

/**
 * Calcule l'analyse de temps pour un budget donné
 * @param {Object} budgetData - Les données du budget à analyser
 * @returns {Object} Un objet contenant les résultats de l'analyse
 */
export function calculateTimeline(budgetData) {
    console.log("Calcul de l'analyse du budget [" + budgetData.id + "] : " + budgetData.listeOperations.length + " opérations")

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

    group[categorie.id] = group[categorie.id] ?? createNewResumeCategorie();
    categorie.couleurCategorie = couleurCategorie;
    group[categorie.id].categorie = categorie;
    // init des tableaux
    group[categorie.id].nbTransactions = group[categorie.id].nbTransactions ?? 0;
    group[categorie.id].nbTransactions = group[categorie.id].nbTransactions + 1;
    group[categorie.id].total = group[categorie.id].total ?? 0;
    group[categorie.id].total = group[categorie.id].total + operation.valeur;
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
