import { Soldes } from "../../budgets/BudgetMensuel.model.js";
import AnalyseSoldesCategorie from "./AnalyseSoldesCategorie.model.js";

/**
 * Modèle des soldes d'un mois
 */
class SoldesMensuelModel {

    actif: boolean;
    idCompteBancaire: string;
    dateMiseAJour: Date = new Date();
    mois: string ;
    annee: number;
    soldes: Soldes = new Soldes();
    totauxParCategories : { [key: string]: AnalyseSoldesCategorie } = {};


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
export default SoldesMensuelModel;  // export default is used to export a single class, function or primitive from a script file.
