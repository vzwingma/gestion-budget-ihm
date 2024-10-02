import SoldeCategorieModel from "../SoldeCategorie.model";

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
    categorie: SoldeCategorieModel | null,
    nbTransactions: number,
    total: number
}

