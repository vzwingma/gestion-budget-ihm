import { toast } from "react-toastify";
import { OPERATION_ETATS_ENUM, TYPES_OPERATION_ENUM } from "../../../Utils/AppBusinessEnums.constants";
import { getCategorieColor } from "../../../Utils/renderers/CategorieItem.renderer";
import AnalyseCategoriesModel from "../../../Models/analyses/categories/AnalyseCategories.model";
import BudgetMensuelModel from "../../../Models/BudgetMensuel.model";
import OperationModel from "../../../Models/Operation.model";
import CategorieOperationModel from "../../../Models/CategorieOperation.model";
import { DataCalculationResultsProps } from "../../Components.props";

/**
 * Contrôleur des analyses
 */


/**
 * Notification lors de la mise à jour du budget
 * @param {Object} budgetData - Les données du budget
 */
export function calculateResumes(currentBudget: BudgetMensuelModel, handleDataCalculationResult: ({ currentBudget,
    analysesGroupedByCategories,
    totauxGroupedByEtat }: DataCalculationResultsProps) => void): void {

    console.log("Calcul de l'analyse du budget [" + currentBudget.id + "] : " + currentBudget.listeOperations.length + " opérations")

    let totauxGroupedByEtat: { [key: string]: number } =
        currentBudget.listeOperations
            .filter((operation: OperationModel) => operation.etat === OPERATION_ETATS_ENUM.REALISEE || operation.etat === OPERATION_ETATS_ENUM.PREVUE)
            .reduce((group: { [idOperationEtatType: string]: number }, operation: OperationModel) => {
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

    let analysesGroupedByCategories: { [key: string]: AnalyseCategoriesModel } = currentBudget.listeOperations
        .filter((operation: OperationModel) => operation.etat === OPERATION_ETATS_ENUM.REALISEE || operation.etat === OPERATION_ETATS_ENUM.PREVUE)
        .reduce((group: { [idCategorieOperation: string]: AnalyseCategoriesModel }, operation: OperationModel) => {
            let couleurCategorie = getCategorieColor(operation.categorie.id);
            if (operation.categorie?.id !== null) {
                populateCategorie(group, operation, operation.categorie, totauxGroupedByEtat, couleurCategorie);
                populateCategorie(group[operation.categorie.id].resumesSsCategories, operation, operation.ssCategorie, totauxGroupedByEtat, couleurCategorie);
            }
            else {
                console.warn("La catégorie de l'opération [" + operation.id + "] est vide")
            }
            return group;
        }, {});

    handleDataCalculationResult({ currentBudget, analysesGroupedByCategories, totauxGroupedByEtat });

    toast.success("Analyse du budget correctement effectué ")
}

/**
 * Remplit les informations de la catégorie dans le groupe donné en fonction de l'opération et de la catégorie d'opération.
 *
 * @param group - Un objet contenant les catégories d'analyse, indexées par leur identifiant.
 * @param operation - L'opération à analyser.
 * @param categorie - La catégorie de l'opération.
 * @param totauxParEtats - Un objet contenant les totaux par états, indexés par état et type d'opération.
 * @param couleurCategorie - La couleur associée à la catégorie.
 */
function populateCategorie(group: { [idCategorie: string]: AnalyseCategoriesModel }, operation: OperationModel, categorie: CategorieOperationModel, totauxParEtats: { [idCategorie: string]: number; }, couleurCategorie: string) {
    if (categorie?.id !== null) {

        group[categorie.id] = group[categorie.id] ?? new AnalyseCategoriesModel();
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
            const idp: string = OPERATION_ETATS_ENUM.PREVUE + "_" + operation.typeOperation;
            group = initGroup(group, categorie.id, idp)
            group[categorie.id].nbTransactions[idp] = group[categorie.id].nbTransactions[idp] + 1;
            group[categorie.id].total[idp] = group[categorie.id].total[idp] + operation.valeur;
            group[categorie.id].pourcentage[idp] = Math.round((Math.abs(group[categorie.id].total[idp]) / Math.abs(totauxParEtats[idp])) * 100);
        }
    }
}

/**
 * Initialise les données du groupe
 * @param {Object} group - Le groupe
 * @param {string} idCategorie - L'ID de la catégorie
 * @param {string} idxOperation - L'index de l'opération
 * @returns {Object} Le groupe initialisé
 */
function initGroup(group: { [idCategorie: string]: AnalyseCategoriesModel }, idCategorie: string, idxOperation: string) {
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

const PART_TYPE_ANALYSE_REGEX : RegExp = /(.*)_(.*)/;
/**
 * Change l'état de l'analyse
 * @param {Event} e - L'événement
 */
export function selectEtatOperation(e: any, currentTypeAnalyse : string, setSelectedTypeAnalyse : React.Dispatch<React.SetStateAction<string>>) {
    const newEtat = e.target.checked ? OPERATION_ETATS_ENUM.REALISEE : OPERATION_ETATS_ENUM.PREVUE
    const partTypeAnalyse = PART_TYPE_ANALYSE_REGEX.exec(currentTypeAnalyse);
    if (partTypeAnalyse) {
        setSelectedTypeAnalyse(newEtat + "_" + partTypeAnalyse[2]);
    }
}

/**
 * Change le type d'opération
 * @param {Event} e - L'événement
 */
export function selectTypeOperation(e: any, currentTypeAnalyse : string, setSelectedTypeAnalyse : React.Dispatch<React.SetStateAction<string>>) {
    const newEtat = e.target.checked ? TYPES_OPERATION_ENUM.CREDIT : TYPES_OPERATION_ENUM.DEPENSE
    const partTypeAnalyse = PART_TYPE_ANALYSE_REGEX.exec(currentTypeAnalyse);
    if (partTypeAnalyse) {
        setSelectedTypeAnalyse(partTypeAnalyse[1] + "_" + newEtat);
    }
}
