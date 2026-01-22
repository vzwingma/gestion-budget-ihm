import SsCategorieOperationModel from "./SSCategorieOperation.model.ts";

/**
 * Catégorie Opérations model
 */
interface CategorieOperationModel {

    id: string | null;
    libelle: string;
    listeSSCategories?: SsCategorieOperationModel[];

}
export default CategorieOperationModel;  // export default is used to export a single class, function or primitive from a script file.
