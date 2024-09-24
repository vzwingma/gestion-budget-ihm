/**
 * Catégorie Opérations model
 */
class MsInfo {

    nom: string;
    version: string;

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
export default MsInfo;  // export default is used to export a single class, function or primitive from a script file.
