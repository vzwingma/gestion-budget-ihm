import CategorieOperationModel from "../../budgets/CategorieOperation.model.ts";

/**
 * Model pour la représentation graphique des analyses des catégories
 */
class GraphAnalyseCategoriesModel {
    id: string;
    categorie: CategorieOperationModel;
    name: string;
    value: number;

    /**
     * Constructor
     */
    constructor(id: string, categorie: CategorieOperationModel, name: string, value: number) {
        this.id = id;
        this.categorie = categorie;
        this.name = name;
        this.value = value;
    }
}
export default GraphAnalyseCategoriesModel
