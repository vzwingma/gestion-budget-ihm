/**
 * CompteBancaire model
 */
class CompteBancaireModel {

    id: string;
    libelle: string;
    itemIcon: string;
    ordre : number;
    actif: boolean;

    /**
     * Constructor
     * @param id identifiant
     * @param libelle libellé
     * @param itemIcon icone du compte
     * @param ordre ordre d'affichage
     * @param actif compte actif
     */
    constructor(id: string, libelle: string, itemIcon: string, ordre: number, actif: boolean) {
        this.id = id;
        this.libelle = libelle;
        this.itemIcon = itemIcon;
        this.ordre = ordre;
        this.actif = actif;
    }
}
export default CompteBancaireModel;  // export default is used to export a single class, function or primitive from a script file.
