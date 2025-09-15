import CategorieOperationModel from "../../budgets/CategorieOperation.model.ts";
import OperationModel from "../../budgets/Operation.model.ts";

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
    listeOperations: OperationModel[];


    /**
     * Constructor
     */
    constructor() {
        this.categorie = {id: "defaultId", libelle: "defaultLibelle"} as CategorieOperationModel;
        this.couleurCategorie = "#808080";
        this.resumesSsCategories = {};
        this.nbTransactions = {};
        this.pourcentage = {};
        this.total = {};
        this.listeOperations = [];
    }
}
export default AnalyseCategoriesModel
