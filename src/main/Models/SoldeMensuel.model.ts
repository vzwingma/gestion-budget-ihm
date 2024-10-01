import {Soldes} from "./BudgetMensuel.model";

/**
 * SoldeMensuelModel
 */
class SoldeMensuelModel {

    actif: boolean;
    idCompteBancaire: string;
    dateMiseAJour: Date = new Date();
    mois: string ;
    annee: number;
    soldes: Soldes = new Soldes();
    totauxParCategories : any[] = [];


    /**
     * Constructor
     * @param actif
     * @param idCompteBancaire
     * @param dateMiseAJour
     * @param mois
     * @param annee
     */
    constructor(actif: boolean, idCompteBancaire: string, dateMiseAJour: Date, mois: string, annee: number) {
        this.actif = actif;
        this.idCompteBancaire = idCompteBancaire;
        this.dateMiseAJour = dateMiseAJour;
        this.mois = mois;
        this.annee = annee;
    }
}
export default SoldeMensuelModel;  // export default is used to export a single class, function or primitive from a script file.
