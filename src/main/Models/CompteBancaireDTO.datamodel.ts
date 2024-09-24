/**
 * CompteBancaire model
 */
class CompteBancaire {

    id: string;
    libelle: string;
    icon: string;
    isDisabled: boolean

    /**
     * Constructor
     * @param id id du compte
     * @param libelle libellé du compte
     * @param icon icone du compte
     * @param isDisabled compte désactivé ou pas
     */
    constructor(id: string, libelle: string, icon: string, isDisabled: boolean) {
        this.id = id;
        this.libelle = libelle;
        this.icon = icon;
        this.isDisabled = isDisabled;
    }
}
export default CompteBancaire;  // export default is used to export a single class, function or primitive from a script file.
