
/**
 * SoldeMensuelModel
 */
class AnalyseSoldesCategorie {
    id?: string;
    libelleCategorie : string;
    totalAtFinMoisCourant: number;
    totalAtMaintenant: number;
    couleur?: string;
    filterActive?: boolean;
    mois: number;
    annee: number;
    /**
     * Constructor
     * @param libelleCategorie
     * @param totalAtFinMoisCourant
     * @param totalAtMaintenant
     * @param mois mois
     * @param annee annee
     */
    constructor(libelleCategorie: string, totalAtFinMoisCourant: number, totalAtMaintenant: number, mois: number, annee: number) {
        this.libelleCategorie = libelleCategorie;
        this.totalAtFinMoisCourant = totalAtFinMoisCourant;
        this.totalAtMaintenant = totalAtMaintenant;
        this.mois = mois;
        this.annee = annee;
    }
}
export default AnalyseSoldesCategorie;  // export default is used to export a single class, function or primitive from a script file.
