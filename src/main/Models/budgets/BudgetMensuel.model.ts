import OperationModel from "./Operation.model.ts";

/**
 * Catégorie Opérations model
 */
class BudgetMensuelModel {

    id: string;
    libelle: string;
    actif: boolean = true;
    idCompteBancaire!: string;
    soldes: Soldes = new Soldes();
    totauxParTypeCategories: { [key: string]: TotauxParTypeCategorie } = {};
    listeOperations: Array<OperationModel> = new Array<OperationModel>();
    /**
     * Constructor
     * @param id id du compte
     * @param libelle libellé du compte
     */
    constructor(id: string, libelle: string) {
        this.id = id;
        this.libelle = libelle;
    }
}

export class Soldes {
    soldeAtMaintenant: number = 0;
    soldeAtFinMoisCourant: number = 0;
    soldeAtFinMoisPrecedent: number = 0;
}


export class TotauxParTypeCategorie {
    libelleCategorie: string;
    totalAtMaintenant: number;
    totalAtFinMoisCourant: number;
    constructor(libelleCategorie: string, totalAtMaintenant: number, totalAtFinMoisCourant: number) {
        this.libelleCategorie = libelleCategorie;
        this.totalAtMaintenant = totalAtMaintenant;
        this.totalAtFinMoisCourant = totalAtFinMoisCourant;
    }
}
export default BudgetMensuelModel;  // export default is used to export a single class, function or primitive from a script file.
