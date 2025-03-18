import CategorieOperationModel from "../../budgets/CategorieOperation.model";
import OperationModel from "../../budgets/Operation.model";

/**
 * Model pour les analyse des catégories
 */
interface AnalyseCategoriesModel {
    categorie: CategorieOperationModel;
    couleurCategorie: string;
    resumesSsCategories: { [key: string]: AnalyseCategoriesModel };
    nbTransactions: { [key: string]: number };
    pourcentage: { [key: string]: number };
    total: { [key: string]: number };
    listeOperations: OperationModel[];
}
export default AnalyseCategoriesModel
