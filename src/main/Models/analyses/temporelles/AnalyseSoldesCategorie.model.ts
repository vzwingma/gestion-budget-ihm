
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
    /**
     * Constructor
     * @param libelleCategorie
     * @param totalAtFinMoisCourant
     * @param totalAtMaintenant
     */
    constructor(libelleCategorie: string, totalAtFinMoisCourant: number, totalAtMaintenant: number) {
        this.libelleCategorie = libelleCategorie;
        this.totalAtFinMoisCourant = totalAtFinMoisCourant;
        this.totalAtMaintenant = totalAtMaintenant;
    }
}
export default AnalyseSoldesCategorie;  // export default is used to export a single class, function or primitive from a script file.
