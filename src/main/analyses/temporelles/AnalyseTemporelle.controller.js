import {toast} from "react-toastify";
import {OPERATION_ETATS_ENUM, TYPES_OPERATION_ENUM} from "../../Utils/AppBusinessEnums.constants";

/**
 * Controleur des analyses
 */


/**
 * Création d'un résumé de catégorie
 * @returns ResumeCategorie résumé de catégorie
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
 *  Notification lorsque les budgets sont chargés
 * @param budgetsData budgets
 */
export function calculateTimelines(budgetsData) {
    console.log("Calcul de l'analyse des  [" + budgetsData.length + "] budgets");

    /*
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
    }) */
    toast.success("Analyse des budgets correctement effectuée ")
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
 * init des données du groupe
 * @param group : array groupe
 * @param idCategorie : string id Catégorie
 * @param idxOperation : string index
 * @returns {*}
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

/**
 * Changement d'état d'analyse
 * @param e
 */
export function selectEtatOperation(e) {
    const newEtat = e.target.checked ? OPERATION_ETATS_ENUM.REALISEE : OPERATION_ETATS_ENUM.PREVUE
    const partTypeAnalyse = this.state.selectedTypeAnalyse.match("(.*)_(.*)");
    this.setState({selectedTypeAnalyse: newEtat + "_" + partTypeAnalyse[2]})
}

/**
 * Changement de tupe d'opération
 * @param e
 */
export function selectTypeOperation(e) {
    const newEtat = e.target.checked ? TYPES_OPERATION_ENUM.CREDIT : TYPES_OPERATION_ENUM.DEPENSE
    const partTypeAnalyse = this.state.selectedTypeAnalyse.match("(.*)_(.*)");
    this.setState({selectedTypeAnalyse: partTypeAnalyse[1] + "_" + newEtat})

}
