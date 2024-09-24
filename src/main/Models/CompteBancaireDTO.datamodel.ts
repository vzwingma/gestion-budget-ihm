/**
 * CompteBancaire model
 */
class CompteBancaireDTO {

    id: string;
    libelle: string;
    itemIcon: string;
    ordre: number;
    actif: boolean

    /**
     * Constructor
     * @param id id du compte
     * @param libelle libellé du compte
     * @param icon icone du compte
     * @param ordre ordre d'affichage
     * @param actif compte désactivé ou pas
     */
    constructor(id: string, libelle: string, icon: string, ordre : number, actif: boolean) {
        this.id = id;
        this.libelle = libelle;
        this.ordre = ordre;
        this.itemIcon = icon;
        this.actif = actif;
    }
}
export default CompteBancaireDTO;  // export default is used to export a single class, function or primitive from a script file.
