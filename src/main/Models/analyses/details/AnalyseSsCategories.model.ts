import SsCategorieOperationModel from "../../budgets/SSCategorieOperation.model.ts";


/**
 * Model pour les analyse des catégories
 */
class AnalyseSsCategoriesModel {
    ssCategorie: SsCategorieOperationModel;
    couleurSsCategorie: string;
    nbTransactions: number;
    pourcentage: number;
    total: number;


    /**
     * Constructor
     */
    constructor() {
        this.ssCategorie = {id: "defaultId", libelle: "defaultLibelle"} as SsCategorieOperationModel;
        this.couleurSsCategorie = "#808080";
        this.nbTransactions = 0;
        this.pourcentage = 0;
        this.total = 0;
    }
}
export default AnalyseSsCategoriesModel
