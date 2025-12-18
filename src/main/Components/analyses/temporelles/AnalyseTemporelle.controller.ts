import {toast} from "react-toastify";
import {getMonthFromString} from "../../../Utils/Date.utils.ts";
import {getCategorieColor} from "../../../Utils/renderers/CategorieItem.renderer.tsx";
import SoldesMensuelModel from "../../../Models/analyses/temporelles/SoldeMensuel.model.ts";
import AnalyseSoldesCategorieModel from "../../../Models/analyses/temporelles/AnalyseSoldesCategorie.model.ts";
import {DataCalculationTemporelResultsProps} from "../../Components.props.tsx";
import {AnalyseCategorieTimelineItem} from "../../../Models/analyses/temporelles/AnalyseCategorieTimelineItem.model.ts";
import {AnalyseSoldesTimelineItemModel} from "../../../Models/analyses/temporelles/AnalyseSoldesTimelineItem.model.ts";

/**
 * Controleur des analyses temporelles
 */



/**
 * Crée un nouveau résumé de catégorie
 * @returns Un objet CategorieTimelineItem avec les propriétés initialisées
 */
function createNewCategorieTimelineItem() {
    let newResumeCategorie: AnalyseCategorieTimelineItem;
    newResumeCategorie = {
        categorie: null,
        total: 0,
        nbTransactions: 0,
        annee: 0,
        mois: ""
    };
    return newResumeCategorie;
}

/**
 * Calcule les lignes de temps basées sur les données des soldes budgétaires et appelle une fonction de gestion des résultats.
 *
 * @param soldesMensuelsData - Un tableau de modèles de soldes mensuels représentant les données budgétaires.
 * @param handleDataCalculationResult - Une fonction de rappel qui gère les résultats du calcul des données temporelles.
 *
 * @returns void
 */
export function calculateTimelines(soldesMensuelsData : SoldesMensuelModel[], handleDataCalculationResult : ({soldesMensuelsData,
                                                                                                               soldesCategoriesData,
                                                                                                               timelinesByCategoriesData,
                                                                                                               timelinesPrevisionnellesByCategoriesData,
                                                                                                               timelinesSoldesData,
                                                                                                               timelinesPrevisionnellesSoldesData} : DataCalculationTemporelResultsProps) => void) : void {
    soldesMensuelsData = Object.values(soldesMensuelsData)
        .sort((budget1: SoldesMensuelModel, budget2: SoldesMensuelModel) => (budget1.annee * 100 + getMonthFromString(budget1.mois)) - (budget2.annee * 100 + getMonthFromString(budget2.mois)));

    let soldesCategoriesData : AnalyseSoldesCategorieModel[] = [];

    let timelinesByCategoriesData : { [idCategorie: string]: AnalyseCategorieTimelineItem }[] = new Array(soldesMensuelsData.length - 1);
    let timelinesPrevisionnellesByCategoriesData : { [idCategorie: string]: AnalyseCategorieTimelineItem }[]= new Array(soldesMensuelsData.length);
    let timelinesSoldesData = new Array(soldesMensuelsData.length - 1);
    let timelinesPrevisionnellesSoldesData = new Array(soldesMensuelsData.length);

    Object.keys(soldesMensuelsData)
        .forEach((month: string) => {
            let idxMois: number = Number.parseInt(month);
            timelinesByCategoriesData[idxMois] = calculateTimelineCategories(soldesMensuelsData[idxMois], false);

            // Si année en cours, recopie les données pour le budget à terminaison
            if (soldesMensuelsData.length < 12) {
                timelinesPrevisionnellesByCategoriesData[idxMois] = calculateTimelineCategories(soldesMensuelsData[idxMois], false);
            }
            timelinesSoldesData[idxMois] = calculateTimelineSoldes(soldesMensuelsData[idxMois], false);
            soldesCategoriesData = getSoldesByCategories(soldesMensuelsData[idxMois]);
        });
    // Génération du budget à terminaison pour le budget courant

    if (soldesMensuelsData.length < 12) {
        timelinesPrevisionnellesByCategoriesData[soldesMensuelsData.length - 1]   = calculateTimelineCategories(soldesMensuelsData.at(-1), false);
        timelinesPrevisionnellesByCategoriesData[soldesMensuelsData.length]       = calculateTimelineCategories(soldesMensuelsData.at(-1), true);
        timelinesPrevisionnellesSoldesData[soldesMensuelsData.length]             = calculateTimelineSoldes(soldesMensuelsData.at(-1), true);
    }

    handleDataCalculationResult({soldesMensuelsData, soldesCategoriesData, timelinesByCategoriesData, timelinesPrevisionnellesByCategoriesData, timelinesSoldesData, timelinesPrevisionnellesSoldesData});
    toast.success("Analyse temporelle du compte correctement effectuée ")
}



/**
 * Calcule l'analyse de temps pour un budget donné
 * @param {Object} soldesMensuelData - Les soldes du mois à analyser
 * @param {Boolean} aTerminaison - Les données du budget à terminaison
 * @returns {Object} Un objet contenant les résultats de l'analyse
 */
function calculateTimelineCategories(soldesMensuelData : SoldesMensuelModel, aTerminaison : boolean) : { [idCategorie: string]: AnalyseCategorieTimelineItem } {

    let group : { [idCategorie: string]: AnalyseCategorieTimelineItem } = {};

    for (let idCategorie in soldesMensuelData.totauxParCategories) {
        let categorie : AnalyseSoldesCategorieModel = soldesMensuelData.totauxParCategories[idCategorie];

        group[idCategorie] = group[idCategorie] ?? createNewCategorieTimelineItem();
        categorie.id = idCategorie;
        categorie.couleur = getCategorieColor(categorie.id);
        group[idCategorie].categorie = categorie;
        group[idCategorie].total = Math.ceil(
            aTerminaison ? categorie.totalAtFinMoisCourant : categorie.totalAtMaintenant
        );
        group[idCategorie].annee = soldesMensuelData.annee;
        group[idCategorie].mois = soldesMensuelData.mois;
    }
    return group;
}


/**
 * Calcule l'analyse de temps pour les soldes d'un budget donné
 * @param soldesMensuelData - Les soldes du mois à analyser
 * @param aTerminaison - Les données du budget à terminaison
 * @returns {AnalyseSoldesTimelineItemModel} Un objet contenant les résultats de l'analyse
 */
function calculateTimelineSoldes(soldesMensuelData : SoldesMensuelModel, aTerminaison : boolean) : AnalyseSoldesTimelineItemModel {
    return {
        soldeAtFinMoisPrecedent: Math.ceil(soldesMensuelData.soldes.soldeAtFinMoisPrecedent),
        soldeAtMaintenant: Math.ceil(aTerminaison ? soldesMensuelData.soldes.soldeAtFinMoisCourant : soldesMensuelData.soldes.soldeAtMaintenant),
        mois: soldesMensuelData.mois,
        annee: soldesMensuelData.annee
    };
}



/**
 * Récupère la liste des catégories à partir d'un solde mensuel.
 *
 * @param {SoldesMensuelModel} soldeMensuel - Le modèle de solde mensuel contenant les totaux par catégories.
 * @returns {AnalyseSoldesCategorieModel[]} La liste des catégories triées par libellé.
 */
function getSoldesByCategories(soldeMensuel : SoldesMensuelModel): AnalyseSoldesCategorieModel[] {
    const soldesByCategories : AnalyseSoldesCategorieModel[] = [];
    for (let idCategorie in soldeMensuel.totauxParCategories) {
        let categorie : AnalyseSoldesCategorieModel;
        categorie = soldeMensuel.totauxParCategories[idCategorie];
        categorie.id = idCategorie;
        categorie.couleur = getCategorieColor(categorie.id);
        categorie.filterActive = true;
        categorie.mois = Number.parseInt(soldeMensuel.mois);
        categorie.annee = soldeMensuel.annee;
        if (!soldesByCategories.some((categorieInList) => categorieInList.id === categorie.id) && categorie.id !== null) {
            soldesByCategories.push(categorie);
        }
    }
    soldesByCategories.sort((categorie1 : AnalyseSoldesCategorieModel, categorie2: AnalyseSoldesCategorieModel) => categorie1.libelleCategorie.localeCompare(categorie2.libelleCategorie));
    return soldesByCategories;
}



