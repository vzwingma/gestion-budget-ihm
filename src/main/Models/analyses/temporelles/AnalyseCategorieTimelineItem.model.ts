import AnalyseSoldesCategorie from "./AnalyseSoldesCategorie.model.js";


/**
 * Représente un élément de la chronologie des analyses par catégorie.
 *
 * @interface AnalyseCategorieTimelineItem
 *
 * @property {AnalyseSoldesCategorie | null} categorie - La catégorie des soldes analysés, ou null si non applicable.
 * @property {number} nbTransactions - Le nombre de transactions associées à cette catégorie.
 * @property {number} total - Le montant total des transactions pour cette catégorie.
 */
export interface AnalyseCategorieTimelineItem {
    categorie: AnalyseSoldesCategorie | null,
    nbTransactions: number,
    total: number,
    mois: string,
    annee: number
}

