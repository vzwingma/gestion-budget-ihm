/**
 * CompteBancaire model
 */
class CompteBancaireModel {

    id: string;
    libelle: string;
    itemIcon: string;
    isDisabled: boolean;
    ordre : number;

    /**
     * Constructor
     * @param id identifiant
     * @param libelle libellé
     * @param icon icone
     * @param isDisabled compte désactivé
     * @param ordre ordre d'affichage
     */
    constructor(id: string, libelle: string, itemIcon: string, isDisabled: boolean, ordre: number) {
        this.id = id;
        this.libelle = libelle;
        this.itemIcon = itemIcon;
        this.isDisabled = isDisabled;
        this.ordre = ordre;
    }
}
export default CompteBancaireModel;  // export default is used to export a single class, function or primitive from a script file.
