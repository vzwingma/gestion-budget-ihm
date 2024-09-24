/**
 * Catégorie Opérations model
 */
class MsInfoModel {

    nom: string;
    version: string | undefined;

    /**
     * Constructor
     * @param nom nom du compte
     * @param version version du compte
     */
    constructor(nom: string, version: string) {
        this.nom = nom;
        this.version = version;
    }
}
export default MsInfoModel;  // export default is used to export a single class, function or primitive from a script file.
