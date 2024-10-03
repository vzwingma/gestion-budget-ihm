/**
 * Catégorie Opérations model
 */
class CategorieOperationModel {

    id: string | null;
    libelle: string;
    categorieParente?: CategorieOperationModel;
    listeSSCategories?: CategorieOperationModel[] = [];
    /**
     * Constructor
     * @param id id du compte
     * @param libelle libellé du compte
     * @param categorieParente catégorie parente
     */
    constructor(id: string, libelle: string, categorieParente?: CategorieOperationModel) {
        this.id = id;
        this.libelle = libelle;
        this.categorieParente = categorieParente;
    }
}
export default CategorieOperationModel;  // export default is used to export a single class, function or primitive from a script file.
