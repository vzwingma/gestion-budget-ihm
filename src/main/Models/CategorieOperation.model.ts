/**
 * Catégorie Opérations model
 */
class CategorieOperation {

    id: string;
    libelle: string;
    categorieParente: CategorieOperation;

    /**
     * Constructor
     * @param id id du compte
     * @param libelle libellé du compte
     * @param icon icone du compte
     * @param isDisabled compte désactivé ou pas
     */
    constructor(id: string, libelle: string, categorieParente: CategorieOperation) {
        this.id = id;
        this.libelle = libelle;
        this.categorieParente = categorieParente;
    }
}
export default CategorieOperation;  // export default is used to export a single class, function or primitive from a script file.
