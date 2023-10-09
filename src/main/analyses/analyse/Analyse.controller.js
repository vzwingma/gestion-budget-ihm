import {toast} from "react-toastify";
import {OPERATION_ETATS_ENUM} from "../../Utils/AppBusinessEnums.constants";
import * as Renderer from "../../budgets/operations/renderers/OperationItem.renderer";

/**
 * Controleur des analyses
 */

/**
 *  Notification lorsque le budget est mis à jour
 * @param budgetData budget
 */
export function calculateResumes(budgetData) {
    console.log("Calcul de l'analyse du budget [" + budgetData.id + "] : " + budgetData.listeOperations.length + " opérations")

    let totauxGroupedByEtat = budgetData.listeOperations
        .filter(operation => operation.etat === OPERATION_ETATS_ENUM.PREVUE || operation.etat === OPERATION_ETATS_ENUM.REALISEE)
        .reduce((group, operation) => {
            group[operation.etat] = group[operation.etat] ?? 0;
            group[operation.etat] = group[operation.etat] + Math.abs(operation.valeur)
            return group;
        }, {});

    let analysesGroupedByCategories = budgetData.listeOperations
        .filter(operation => operation.etat === OPERATION_ETATS_ENUM.REALISEE)
        .reduce((group, operation) => {
            let couleurCategorie = Renderer.getCategorieColor(operation.categorie);
            this.populateCategorie(group, operation, operation.categorie, totauxGroupedByEtat, couleurCategorie);
            this.populateCategorie(group[operation.categorie.id].resumesSsCategories, operation, operation.ssCategorie, totauxGroupedByEtat, couleurCategorie);
            return group;
        }, {});

    this.setState({currentBudget: budgetData, analysesGroupedByCategories: analysesGroupedByCategories})
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
export function populateCategorie(group, operation, categorie, totauxParEtats, couleurCategorie) {


    group[categorie.id] = group[categorie.id] ?? this.createNewResumeCategorie();
    group[categorie.id].categorie = categorie;
    group[categorie.id].couleurCategorie = couleurCategorie;

    if (operation.etat === "REALISEE") {
        group[categorie.id].nbTransactions = group[categorie.id].nbTransactions + 1;
        group[categorie.id].totalRealise = group[categorie.id].totalRealise + operation.valeur;
        group[categorie.id].pourcentage = Math.round((Math.abs(group[categorie.id].totalRealise) / Math.abs(totauxParEtats["REALISEE"])) * 100);
    } else if (operation.etat === "PREVUE") {
        group[categorie.id].nbTransactionsPrevues = group[categorie.id].nbTransactionsPrevues + 1;
        group[categorie.id].totalPrevue = group[categorie.id].totalPrevue + operation.valeur;
    }

}


/**
 * Sélection d'une opération
 * @param resumeSelectedCategorie opération
 */
export function handleCategorieSelect(rang, resumeSelectedCategorie) {
    this.setState({rangSelectedCategorie: rang, resumeSelectedCategorie: resumeSelectedCategorie})
}



/**
 * Création d'un résumé de catégorie
 * @returns {ResumeCategorie} résumé de catégorie
 */
export function createNewResumeCategorie() {

    let newResumeCategorie: ResumeCategorie =
        {
            categorie: {},
            couleurCategorie: "#808080",
            resumesSsCategories: {},
            nbTransactions: 0,
            nbTransactionsPrevues: 0,
            pourcentage: 0,
            totalRealise: 0,
            totalPrevue: 0
        }
    return newResumeCategorie;
}
