/**
 * Catégorie Opérations model
 */
interface CategorieOperationModel {

    id: string | null;
    libelle: string;
    categorieParente?: CategorieOperationModel;
    listeSSCategories?: CategorieOperationModel[];
}
export default CategorieOperationModel;  // export default is used to export a single class, function or primitive from a script file.
