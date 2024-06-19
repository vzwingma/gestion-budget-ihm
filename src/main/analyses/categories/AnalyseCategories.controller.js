import {toast} from "react-toastify";
import {OPERATION_ETATS_ENUM, TYPES_OPERATION_ENUM} from "../../Utils/AppBusinessEnums.constants";
import * as Renderer from "../../Utils/renderers/CategorieItem.renderer";

/**
 * Contrôleur des analyses
 */

/**
 * Crée un nouveau résumé de catégorie
 * @returns {ResumeCategorie} Le résumé de la catégorie
 */
function createNewResumeCategorie() {

    let newResumeCategorie: ResumeCategorie =
        {
            categorie: {},
            couleurCategorie: "#808080",
            resumesSsCategories: {},
            nbTransactions: [],
            pourcentage: [],
            total: []
        }
    return newResumeCategorie;
}


/**
 * Notification lors de la mise à jour du budget
 * @param {Object} budgetData - Les données du budget
 */
export function calculateResumes(budgetData) {
    console.log("Calcul de l'analyse du budget [" + budgetData.id + "] : " + budgetData.listeOperations.length + " opérations")

    let totauxGroupedByEtat = budgetData.listeOperations
        .filter(operation => operation.etat === OPERATION_ETATS_ENUM.REALISEE || operation.etat === OPERATION_ETATS_ENUM.PREVUE)
        .reduce((group, operation) => {
            const idx = operation.etat + "_" + operation.typeOperation;

            group[idx] = group[idx] ?? 0;
            group[idx] = group[idx] + operation.valeur
            // On ajoute les opérations réalisées aux prévues
            if (operation.etat === OPERATION_ETATS_ENUM.REALISEE) {
                const idp = OPERATION_ETATS_ENUM.PREVUE + "_" + operation.typeOperation
                group[idp] = group[idp] ?? 0;
                group[idp] = group[idp] + operation.valeur
            }
            return group;
        }, {});


    let analysesGroupedByCategories = budgetData.listeOperations
        .filter(operation => operation.etat === OPERATION_ETATS_ENUM.REALISEE || operation.etat === OPERATION_ETATS_ENUM.PREVUE)
        .reduce((group, operation) => {
            let couleurCategorie = Renderer.getCategorieColor(operation.categorie);
            populateCategorie(group, operation, operation.categorie, totauxGroupedByEtat, couleurCategorie);
            populateCategorie(group[operation.categorie.id].resumesSsCategories, operation, operation.ssCategorie, totauxGroupedByEtat, couleurCategorie);
            return group;
        }, {});

    this.setState({
        currentBudget: budgetData,
        analysesGroupedByCategories: analysesGroupedByCategories,
        totauxGroupedByEtat: totauxGroupedByEtat
    })
    toast.success("Analyse du budget correctement effectué ")
}

/**
 * Remplit une catégorie
 * @param {Object} group - Le groupe de catégories (ou sous-catégories)
 * @param {Object} operation - L'opération à traiter
 * @param {Object} categorie - La catégorie
 * @param {Object} totauxParEtats - Les totaux par états
 * @param {string} couleurCategorie - La couleur de la catégorie
 */
function populateCategorie(group, operation, categorie, totauxParEtats, couleurCategorie) {


    group[categorie.id] = group[categorie.id] ?? createNewResumeCategorie();
    group[categorie.id].categorie = categorie;
    group[categorie.id].couleurCategorie = couleurCategorie;

    const idx = operation.etat + "_" + operation.typeOperation;
    // init des tableaux
    group = initGroup(group, categorie.id, idx)
    group[categorie.id].nbTransactions[idx] = group[categorie.id].nbTransactions[idx] + 1;
    group[categorie.id].total[idx] = group[categorie.id].total[idx] + operation.valeur;
    group[categorie.id].pourcentage[idx] = Math.round((Math.abs(group[categorie.id].total[idx]) / Math.abs(totauxParEtats[idx])) * 100);

    // On ajoute les opérations réalisées aux prévues
    if (operation.etat === OPERATION_ETATS_ENUM.REALISEE) {
        const idp = OPERATION_ETATS_ENUM.PREVUE + "_" + operation.typeOperation;
        group = initGroup(group, categorie.id, idp)
        group[categorie.id].nbTransactions[idp] = group[categorie.id].nbTransactions[idp] + 1;
        group[categorie.id].total[idp] = group[categorie.id].total[idp] + operation.valeur;
        group[categorie.id].pourcentage[idp] = Math.round((Math.abs(group[categorie.id].total[idp]) / Math.abs(totauxParEtats[idp])) * 100);
    }
}

/**
 * Initialise les données du groupe
 * @param {Object} group - Le groupe
 * @param {string} idCategorie - L'ID de la catégorie
 * @param {string} idxOperation - L'index de l'opération
 * @returns {Object} Le groupe initialisé
 */
function initGroup(group, idCategorie, idxOperation) {
    if (group[idCategorie].nbTransactions[idxOperation] === undefined) {
        group[idCategorie].nbTransactions[idxOperation] = 0;
    }
    if (group[idCategorie].total[idxOperation] === undefined) {
        group[idCategorie].total[idxOperation] = 0;
    }
    if (group[idCategorie].pourcentage[idxOperation] === undefined) {
        group[idCategorie].pourcentage[idxOperation] = 0;
    }
    return group
}

/**
 * Gère la sélection d'une catégorie
 * @param {number} rang - Le rang de la catégorie dans la liste
 * @param {Object} resumeSelectedCategorie - Le résumé de la catégorie sélectionnée
 */
export function handleCategorieSelect(rang, resumeSelectedCategorie) {
    this.setState({
        rangSelectedCategorie: rang,
        resumeSelectedCategorie: resumeSelectedCategorie,
        resumeSelectedSsCategorie: null
    })
}

/**
 * Gère la sélection d'une sous-catégorie
 * @param {number} rang - Le rang de la sous-catégorie dans la liste
 * @param {Object} resumeSelectedSsCategorie - Le résumé de la sous-catégorie sélectionnée
 */
export function handleSsCategorieSelect(rang, resumeSelectedSsCategorie) {
    this.setState({resumeSelectedSsCategorie: resumeSelectedSsCategorie})
}

/**
 * Change l'état de l'analyse
 * @param {Event} e - L'événement
 */
export function selectEtatOperation(e) {
    const newEtat = e.target.checked ? OPERATION_ETATS_ENUM.REALISEE : OPERATION_ETATS_ENUM.PREVUE
    const partTypeAnalyse = this.state.selectedTypeAnalyse.match("(.*)_(.*)");
    this.setState({selectedTypeAnalyse: newEtat + "_" + partTypeAnalyse[2]})
}

/**
 * Change le type d'opération
 * @param {Event} e - L'événement
 */
export function selectTypeOperation(e) {
    const newEtat = e.target.checked ? TYPES_OPERATION_ENUM.CREDIT : TYPES_OPERATION_ENUM.DEPENSE
    const partTypeAnalyse = this.state.selectedTypeAnalyse.match("(.*)_(.*)");
    this.setState({selectedTypeAnalyse: partTypeAnalyse[1] + "_" + newEtat})

}
