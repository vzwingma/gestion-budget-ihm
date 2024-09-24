
/**
 * Opérations model
 */
class Operation {

    id: string;
    libelle: string;
    etat: string;
    autresInfos: AutresInfos;

    /**
     * Constructor
     * @param id id du compte
     * @param libelle libellé du compte
     */
    constructor(id: string, libelle: string, etat: string, autresInfos: AutresInfos) {
        this.id = id;
        this.libelle = libelle;
        this.etat = etat;
        this.autresInfos = autresInfos;
    }
}
export default Operation;  // export default is used to export a single class, function or primitive from a script file.

/**
 * Model AutresInfos dans Operation.model.ts
 */
class AutresInfos {
    dateOperation: Date;
    dateMaj: Date;

    constructor(dateOperation: Date, dateMaj: Date) {
        this.dateOperation = dateOperation;
        this.dateMaj = dateMaj;
    }
}