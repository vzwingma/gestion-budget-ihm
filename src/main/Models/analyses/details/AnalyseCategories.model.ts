import CategorieOperationModel from "../../budgets/CategorieOperation.model.ts";
import AnalyseSsCategoriesModel from "./AnalyseSsCategories.model.ts";


/**
 * Model pour les analyse des catégories
 */
class AnalyseCategoriesModel {
    categorie: CategorieOperationModel;
    couleurCategorie: string;
    resumesSsCategories: { [key: string]: AnalyseSsCategoriesModel };
    nbTransactions: number;
    pourcentage: number;
    total: number;


    /**
     * Constructor
     */
    constructor() {
        this.categorie = {id: "defaultId", libelle: "defaultLibelle"} as CategorieOperationModel;
        this.couleurCategorie = "#808080";
        this.resumesSsCategories = {};
        this.nbTransactions = 0;
        this.pourcentage = 0;
        this.total = 0;
    }
}
export default AnalyseCategoriesModel
