import {toast} from "react-toastify";
import {PERIODES_MENSUALITE_ENUM} from "../../Utils/AppBusinessEnums.constants";

/**
 * Controleur des budgets
 */

/**
 *  Notification lorsque le budget est mis à jour
 * @param budgetData budget
 */
export function calculateResumes(budgetData) {
    console.log("Calcul de l'analyse du budget [" + budgetData.id + "] : " + budgetData.listeOperations.length + " opérations")

    let totauxGroupedByEtat = budgetData.listeOperations
        .filter(operation => operation.etat === "PREVUE" || operation.etat === "REALISEE")
        .reduce((group, operation) => {
            group[operation.etat] = group[operation.etat] ?? 0;
            group[operation.etat] = group[operation.etat] + operation.valeur
            return group;
        }, {});

    let operationsGroupedByCategories = budgetData.listeOperations
        .reduce((group, operation) => {
            this.populateCategorie(group, operation, operation.categorie, totauxGroupedByEtat);
            //  this.populateCategorie(operation.resumesSsCategories, operation, operation.ssCategorie);
            return group;
        }, {});

    this.setState({currentBudget: budgetData, operationsGroupedByCategories: operationsGroupedByCategories})
    toast.success("Chargement du budget correctement effectué ")
}

/**
 * Peuplement d'une catégorie
 * @param group groupe de catégorie (ou sous catégorie)
 * @param operation opération à traiter
 * @param categorie catégorie
 * @param totauxParEtats totauxParEtats
 */
export function populateCategorie(group, operation, categorie, totauxParEtats) {

    group[categorie.id] = group[categorie.id] ?? this.createNewResumeCategorie();
    group[categorie.id].categorie = categorie;
    if (operation.etat === "REALISEE") {
        group[categorie.id].nbTransactions = group[categorie.id].nbTransactions + 1;
        group[categorie.id].totalRealise = group[categorie.id].totalRealise + operation.valeur;
        group[categorie.id].pourcentage = Math.round((group[categorie.id].totalRealise / totauxParEtats["REALISEE"]) * 100);
    } else if (operation.etat === "PREVUE") {
        group[categorie.id].nbTransactionsPrevues = group[categorie.id].nbTransactionsPrevues + 1;
        group[categorie.id].totalPrevue = group[categorie.id].totalPrevue + operation.valeur;

    }

}


/**
 * Sélection d'une opération
 * @param operation opération
 */
export function handleOperationSelect(operation) {
    if (operation.mensualite == null) {
        operation.mensualite = {periode: PERIODES_MENSUALITE_ENUM.at(0)}
    }
    this.setState({currentOperation: operation})
}

/**
 * Création d'un résumé de catégorie
 * @returns {ResumeCategorie} résumé de catégorie
 */
export function createNewResumeCategorie() {

    let newResumeCategorie: ResumeCategorie =
        {
            categorie: {},
            resumesSsCategories: {},
            nbTransactions: 0,
            nbTransactionsPrevues: 0,
            pourcentage: 0,
            totalRealise: 0,
            totalPrevue: 0
        }
    return newResumeCategorie;
}
