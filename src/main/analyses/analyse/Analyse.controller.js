import {toast} from "react-toastify";
import {OPERATION_ETATS_ENUM} from "../../Utils/AppBusinessEnums.constants";
import * as Renderer from "../../Utils/renderers/CategorieItem.renderer";

/**
 * Controleur des analyses
 */


/**
 * Création d'un résumé de catégorie
 * @returns {ResumeCategorie} résumé de catégorie
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
 *  Notification lorsque le budget est mis à jour
 * @param budgetData budget
 */
export function calculateResumes(budgetData) {
    console.log("Calcul de l'analyse du budget [" + budgetData.id + "] : " + budgetData.listeOperations.length + " opérations")

    let totauxGroupedByEtat = budgetData.listeOperations
        .filter(operation => operation.etat === OPERATION_ETATS_ENUM.REALISEE || operation.etat === OPERATION_ETATS_ENUM.PREVUE)
        .reduce((group, operation) => {
            group[operation.etat + "_" + operation.typeOperation] = group[operation.etat + "_" + operation.typeOperation] ?? 0;
            group[operation.etat + "_" + operation.typeOperation] = group[operation.etat + "_" + operation.typeOperation] + operation.valeur
            // On ajoute les opérations réalisées aux prévues
            if (operation.etat === OPERATION_ETATS_ENUM.REALISEE) {
                group[OPERATION_ETATS_ENUM.PREVUE + "_" + operation.typeOperation] = group[OPERATION_ETATS_ENUM.PREVUE + "_" + operation.typeOperation] ?? 0;
                group[OPERATION_ETATS_ENUM.PREVUE + "_" + operation.typeOperation] = group[OPERATION_ETATS_ENUM.PREVUE + "_" + operation.typeOperation] + operation.valeur
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
 * Peuplement d'une catégorie
 * @param group groupe de catégorie (ou sous catégorie)
 * @param operation opération à traiter
 * @param categorie catégorie
 * @param totauxParEtats totauxParEtats
 * @param couleurCategorie couleur de la catégorie (et ses ssous catégories
 */
function populateCategorie(group, operation, categorie, totauxParEtats, couleurCategorie) {


    group[categorie.id] = group[categorie.id] ?? createNewResumeCategorie();
    group[categorie.id].categorie = categorie;
    group[categorie.id].couleurCategorie = couleurCategorie;

    // init des tableaux
    if (group[categorie.id].nbTransactions[operation.etat + "_" + operation.typeOperation] === undefined) {
        group[categorie.id].nbTransactions[operation.etat + "_" + operation.typeOperation] = 0;
    }
    if (group[categorie.id].total[operation.etat + "_" + operation.typeOperation] === undefined) {
        group[categorie.id].total[operation.etat + "_" + operation.typeOperation] = 0;
    }
    if (group[categorie.id].pourcentage[operation.etat + "_" + operation.typeOperation] === undefined) {
        group[categorie.id].pourcentage[operation.etat + "_" + operation.typeOperation] = 0;
    }
    group[categorie.id].nbTransactions[operation.etat + "_" + operation.typeOperation] = group[categorie.id].nbTransactions[operation.etat + "_" + operation.typeOperation] + 1;
    group[categorie.id].total[operation.etat + "_" + operation.typeOperation] = group[categorie.id].total[operation.etat + "_" + operation.typeOperation] + operation.valeur;
    group[categorie.id].pourcentage[operation.etat + "_" + operation.typeOperation] = Math.round((Math.abs(group[categorie.id].total[operation.etat + "_" + operation.typeOperation]) / Math.abs(totauxParEtats[operation.etat + "_" + operation.typeOperation])) * 100);

}


/**
 * Sélection d'une catégorie
 * @param rang : int Rang de la catégorie dans la liste
 * @param resumeSelectedCategorie résumé d'une catégorie
 */
export function handleCategorieSelect(rang, resumeSelectedCategorie) {
    this.setState({
        rangSelectedCategorie: rang,
        resumeSelectedCategorie: resumeSelectedCategorie,
        resumeSelectedSsCategorie: null
    })
}

/**
 * Sélection d'une sous catégorie
 * @param rang : int Rang de la catégorie dans la liste
 * @param resumeSelectedSsCategorie résumé d'une sous catégorie
 */
export function handleSsCategorieSelect(rang, resumeSelectedSsCategorie) {
    this.setState({resumeSelectedSsCategorie: resumeSelectedSsCategorie})
}
