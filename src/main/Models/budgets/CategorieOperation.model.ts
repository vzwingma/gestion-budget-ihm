/**
 * Catégorie Opérations model
 */
interface CategorieOperationModel {

    readonly id: string | null;
    readonly libelle: string;
    readonly categorieParente?: CategorieOperationModel;
    readonly listeSSCategories?: CategorieOperationModel[];
}
export default CategorieOperationModel;  // export default is used to export a single class, function or primitive from a script file.
