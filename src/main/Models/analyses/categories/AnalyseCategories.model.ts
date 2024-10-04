import CategorieOperationModel from "../../budgets/CategorieOperation.model";

/**
 * Model pour les analyse des catégories
 */
class AnalyseCategoriesModel {
    categorie: CategorieOperationModel;
    couleurCategorie: string;
    resumesSsCategories: { [key: string]: AnalyseCategoriesModel };
    nbTransactions: { [key: string]: number };
    pourcentage: { [key: string]: number };
    total: { [key: string]: number };


    /**
     * Constructor
     */
    constructor() {
        this.categorie = new CategorieOperationModel("defaultId", "defaultLibelle");
        this.couleurCategorie = "#808080";
        this.resumesSsCategories = {};
        this.nbTransactions = {};
        this.pourcentage = {};
        this.total = {};
    }
}
export default AnalyseCategoriesModel
