/**
 * Catégorie Opérations model
 */
class MsInfo {

    nom: string;
    version: string;
    description: string;

    /**
     * Constructor
     * @param nom nom du compte
     * @param version version du compte
     * @param description description du compte
     */
    constructor(nom: string, version: string, description: string) {
        this.nom = nom;
        this.version = version;
        this.description = description;
    }
}
export default MsInfo;  // export default is used to export a single class, function or primitive from a script file.
