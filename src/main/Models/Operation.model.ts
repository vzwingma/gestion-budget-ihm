import CategorieOperationModel from "./CategorieOperation.model";

/**
 * Opérations model
 */
class OperationModel {

    id: number;
    libelle: string;
    etat: string;
    autresInfos: AutresInfos;
    categorie: CategorieOperationModel;
    ssCategorie: CategorieOperationModel;
    typeOperation: string;
    valeur: number;
    mensualite: {
        periode: string;
    };
    
    /** */
    constructor(id: number, libelle: string, autresInfos: AutresInfos, categorie: CategorieOperationModel, ssCategorie: CategorieOperationModel, typeOperation: string, etat: string, valeur: number, mensualite: {periode: string}) {
        this.id = id;
        this.libelle = libelle;
        this.etat = etat;
        this.autresInfos = autresInfos;
        this.categorie = categorie;
        this.ssCategorie = ssCategorie;
        this.typeOperation = typeOperation;
        this.etat = etat;
        this.valeur = valeur;
        this.mensualite = mensualite;
    }
}
export default OperationModel;  // export default is used to export a single class, function or primitive from a script file.

/**
 * Model AutresInfos dans Operation.model.ts
 */
class AutresInfos {
    dateOperation?: Date;
    dateMaj?: Date;

    constructor(dateOperation: Date, dateMaj: Date) {
        this.dateOperation = dateOperation;
        this.dateMaj = dateMaj;
    }
}
