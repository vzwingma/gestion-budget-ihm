
/**
 * Représente un élément de la timeline pour l'analyse graphique mensuelle.
 *
 * @interface GraphAnalyseTimelineItemModel
 *
 * @property {string} id - Identifiant unique de l'élément.
 * @property {string} name - Nom de l'élément.
 * @property {{ [key: string]: number }} categories - Catégories associées à l'élément, avec des valeurs numériques.
 */
export interface GraphAnalyseTimelineItemModel {
    id: string,
    name: string,
    categories: { [idCategorie: string]: number },
    [key: string]: any; // Add this index signature
}
