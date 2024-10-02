import {toast} from "react-toastify";
import {getMonthFromString} from "../../../Utils/Date.utils";
import {getCategorieColor} from "../../../Utils/renderers/CategorieItem.renderer";
import SoldeMensuelModel from "../../../Models/analyses/temporelles/SoldeMensuel.model";
import SoldeCategorieModel from "../../../Models/analyses/temporelles/SoldeCategorie.model";
import { DataCalculationTemporelResultsProps } from "../../Components.props";
import { CategorieTimelineItem } from "../../../Models/analyses/temporelles/AnalyseTemportelleCategorieTimelineItem.model";
import { SoldesTimelineItem } from "../../../Models/analyses/temporelles/AnalyseTemporelleSoldesTimelineItem.model";
/**
 * Controleur des analyses temporelles
 */



/**
 * Crée un nouveau résumé de catégorie
 * @returns Un objet CategorieTimelineItem avec les propriétés initialisées
 */
function createNewCategorieTimelineItem() {
    let newResumeCategorie: CategorieTimelineItem;
    newResumeCategorie = {
        categorie: null,
        total: 0,
        nbTransactions: 0
    };
    return newResumeCategorie;
}

/**
 * Calcule les lignes de temps basées sur les données des soldes budgétaires et appelle une fonction de gestion des résultats.
 *
 * @param soldesBudgetsData - Un tableau de modèles de soldes mensuels représentant les données budgétaires.
 * @param handleDataCalculationResult - Une fonction de rappel qui gère les résultats du calcul des données temporelles.
 * 
 * @returns void
 */
export function calculateTimelines(soldesBudgetsData : SoldeMensuelModel[], handleDataCalculationResult : ({soldesBudgetsData,
                                                                                                               categoriesData,
                                                                                                               timelinesGroupedByCategoriesData,
                                                                                                               timelinesPrevisionnellesGroupedByCategoriesData,
                                                                                                               timelinesSoldesData,
                                                                                                               timelinesPrevisionnellesSoldesData} : DataCalculationTemporelResultsProps) => void) : void {
    soldesBudgetsData = Object.values(soldesBudgetsData)
        .sort((budget1: SoldeMensuelModel, budget2: SoldeMensuelModel) => getMonthFromString(budget1.mois) - getMonthFromString(budget2.mois))

    let soldesCategoriesData : SoldeCategorieModel[] = [];
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
            soldesCategoriesData = getListeCategories(soldesBudgetsData[mois]);
        });
    // Génération du budget à terminaison pour le budget courant

    if (soldesBudgetsData.length < 12) {
        timelinesPrevisionnellesGroupedByCategoriesData[soldesBudgetsData.length - 1] = calculateTimelineCategories(soldesBudgetsData[soldesBudgetsData.length - 1], false);
        timelinesPrevisionnellesGroupedByCategoriesData[soldesBudgetsData.length] = calculateTimelineCategories(soldesBudgetsData[soldesBudgetsData.length - 1], true);
        timelinesPrevisionnellesSoldesData[soldesBudgetsData.length] = calculateTimelineSoldes(soldesBudgetsData[soldesBudgetsData.length - 1], true);
    }

    handleDataCalculationResult({soldesBudgetsData, categoriesData: soldesCategoriesData, timelinesGroupedByCategoriesData, timelinesPrevisionnellesGroupedByCategoriesData, timelinesSoldesData, timelinesPrevisionnellesSoldesData});
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
    const newTimelineSoldes: SoldesTimelineItem = {
        soldeAtFinMoisPrecedent : Math.ceil(soldeMensuelData.soldes.soldeAtFinMoisPrecedent),
        soldeAtMaintenant : Math.ceil(aTerminaison ? soldeMensuelData.soldes.soldeAtFinMoisCourant : soldeMensuelData.soldes.soldeAtMaintenant)
    };
    return newTimelineSoldes;
}



/**
 * Récupère la liste des catégories à partir d'un solde mensuel.
 *
 * @param {SoldeMensuelModel} soldeMensuel - Le modèle de solde mensuel contenant les totaux par catégories.
 * @returns {SoldeCategorieModel[]} La liste des catégories triées par libellé.
 */
function getListeCategories(soldeMensuel : SoldeMensuelModel): SoldeCategorieModel[] {
    const listeCategories : SoldeCategorieModel[] = [];
    for (let idCategorie in soldeMensuel.totauxParCategories) {
        let categorie : SoldeCategorieModel;
        categorie = soldeMensuel.totauxParCategories[idCategorie];
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



