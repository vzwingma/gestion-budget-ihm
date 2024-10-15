/**
 * Modèle de l'objet LibelleCategorieOperation
 */
class LibelleCategorieOperationModel {
    libelle: string;
    categorieId: string;
    ssCategorieId: string;

    constructor(libelle: string, categorieId: string, ssCategorieId: string) {
        this.libelle = libelle;
        this.categorieId = categorieId;
        this.ssCategorieId = ssCategorieId;
    }
}

export default LibelleCategorieOperationModel;  // export default is used to export a single class, function or primitive from a script file.
