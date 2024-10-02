import {toast} from "react-toastify";
import {getMonthFromString} from "../../../Utils/Date.utils";
import {getCategorieColor} from "../../../Utils/renderers/CategorieItem.renderer";
import SoldeMensuelModel from "../../../Models/SoldeMensuel.model";
import SoldeCategorieModel from "../../../Models/SoldeCategorie.model";
import { DataCalculationTemporelResultsProps } from "../../Components.props";
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
export interface CategorieTimelineItem {
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
export interface SoldesTimelineItem {
    soldeAtFinMoisPrecedent : number,
    soldeAtMaintenant : number
}

/**
 * Crée un nouveau résumé de catégorie
 * @returns Un objet CategorieTimelineItem avec les propriétés initialisées
 */
function createNewCategorieTimelineItem() {
    let newResumeCategorie: CategorieTimelineItem;
    newResumeCategorie = {
        categorie: {},
        total: 0,
        nbTransactions: 0
    };
    return newResumeCategorie;
}

/**
 * Calcule les analyses de temps pour les budgets donnés
 * @param {Array} soldesBudgetsData - Les données des budgets à analyser
 * @param handleDataCalculationResult - La fonction de rappel pour les résultats de l'analyse
 */
export function calculateTimelines(soldesBudgetsData : SoldeMensuelModel[], handleDataCalculationResult : ({soldesBudgetsData,
                                                                                                               categoriesData,
                                                                                                               timelinesGroupedByCategoriesData,
                                                                                                               timelinesPrevisionnellesGroupedByCategoriesData,
                                                                                                               timelinesSoldesData,
                                                                                                               timelinesPrevisionnellesSoldesData} : DataCalculationTemporelResultsProps) => void) : void {
    soldesBudgetsData = Object.values(soldesBudgetsData)
        .sort((budget1: SoldeMensuelModel, budget2: SoldeMensuelModel) => getMonthFromString(budget1.mois) - getMonthFromString(budget2.mois))

    let categoriesData : SoldeCategorieModel[] = [];
    let timelinesGroupedByCategoriesData : { [key: string]: CategorieTimelineItem }[] = new Array(soldesBudgetsData.length - 1);
    let timelinesPrevisionnellesGroupedByCategoriesData : { [key: string]: CategorieTimelineItem }[]= new Array(soldesBudgetsData.length);
    let timelinesSoldesData = new Array(soldesBudgetsData.length - 1);
    let timelinesPrevisionnellesSoldesData = new Array(soldesBudgetsData.length);

    Object.keys(soldesBudgetsData)
        .forEach((month: string) => {
            let mois : number = Number.parseInt(month);

            timelinesGroupedByCategoriesData[mois] = calculateTimelineCategories(soldesBudgetsData[mois], false);

            // Si année en cours, recopie les données pour le budget à terminaison
            if (soldesBudgetsData.length < 12) {
                timelinesPrevisionnellesGroupedByCategoriesData[mois] = calculateTimelineCategories(soldesBudgetsData[mois], false);
            }
            timelinesSoldesData[mois] = calculateTimelineSoldes(soldesBudgetsData[mois], false);
            categoriesData = getListeCategories(soldesBudgetsData[mois]);
        });
    // Génération du budget à terminaison pour le budget courant

    if (soldesBudgetsData.length < 12) {
        timelinesPrevisionnellesGroupedByCategoriesData[soldesBudgetsData.length - 1] = calculateTimelineCategories(soldesBudgetsData[soldesBudgetsData.length - 1], false);
        timelinesPrevisionnellesGroupedByCategoriesData[soldesBudgetsData.length] = calculateTimelineCategories(soldesBudgetsData[soldesBudgetsData.length - 1], true);
        timelinesPrevisionnellesSoldesData[soldesBudgetsData.length] = calculateTimelineSoldes(soldesBudgetsData[soldesBudgetsData.length - 1], true);
    }

    handleDataCalculationResult({soldesBudgetsData, categoriesData, timelinesGroupedByCategoriesData, timelinesPrevisionnellesGroupedByCategoriesData, timelinesSoldesData, timelinesPrevisionnellesSoldesData});
    toast.success("Analyse des budgets correctement effectuée ")
}



/**
 * Calcule l'analyse de temps pour un budget donné
 * @param {Object} budgetData - Les données du budget à analyser
 * @param {Boolean} aTerminaison - Les données du budget à terminaison
 * @returns {Object} Un objet contenant les résultats de l'analyse
 */
function calculateTimelineCategories(budgetData : SoldeMensuelModel, aTerminaison : boolean) : { [key: string]: CategorieTimelineItem } {

    let group : { [key: string]: CategorieTimelineItem } = {};

    for (let idCategorie in budgetData.totauxParCategories) {
        let categorie : SoldeCategorieModel = budgetData.totauxParCategories[idCategorie];

        group[idCategorie] = group[idCategorie] ?? createNewCategorieTimelineItem();
        categorie.id = idCategorie;
        categorie.couleur = getCategorieColor(categorie.id);
        group[idCategorie].categorie = categorie;
        group[idCategorie].total = Math.ceil(
            aTerminaison ? categorie.totalAtFinMoisCourant : categorie.totalAtMaintenant
        );
    }
    return group;
}


/**
 * Calcule l'analyse de temps pour les soldes d'un budget donné
 * @param soldeMensuelData - Les données du budget à analyser
 * @param aTerminaison - Les données du budget à terminaison
 * @returns {SoldesTimelineItem} Un objet contenant les résultats de l'analyse
 */
function calculateTimelineSoldes(soldeMensuelData : SoldeMensuelModel, aTerminaison : boolean) : SoldesTimelineItem {
    let newTimelineSoldes: SoldesTimelineItem;
    newTimelineSoldes = {
        soldeAtFinMoisPrecedent : Math.ceil(soldeMensuelData.soldes.soldeAtFinMoisPrecedent),
        soldeAtMaintenant : Math.ceil(aTerminaison ? soldeMensuelData.soldes.soldeAtFinMoisCourant : soldeMensuelData.soldes.soldeAtMaintenant)
    };
    return newTimelineSoldes;
}


/**
 * Calcule la liste des catégories présentes
 * @param {SoldeCategorieModel[]} budgetData - Les données du budget à analyser
 * @returns {Array} La liste des catégories présentes
 */
function getListeCategories(budgetData : SoldeMensuelModel): SoldeCategorieModel[] {
    const listeCategories : SoldeCategorieModel[] = [];
    for (let idCategorie in budgetData.totauxParCategories) {
        let categorie : SoldeCategorieModel;
        categorie = budgetData.totauxParCategories[idCategorie];
        categorie.id = idCategorie;
        categorie.couleur = getCategorieColor(categorie.id);
        categorie.filterActive = true;

        if (!listeCategories.some((categorieInList) => categorieInList.id === categorie.id) && categorie.id !== null) {
            listeCategories.push(categorie);
        }
    }
    listeCategories.sort((categorie1 : SoldeCategorieModel, categorie2: SoldeCategorieModel) => categorie1.libelleCategorie.localeCompare(categorie2.libelleCategorie));
    return listeCategories;
}



