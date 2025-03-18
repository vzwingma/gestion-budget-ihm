import {
    OPERATION_ETATS_ENUM,
    PERIODES_MENSUALITE_ENUM,
    TYPES_OPERATION_ENUM
} from "../../Utils/AppBusinessEnums.constants";
import CategorieOperationModel from "./CategorieOperation.model";

/**
 * Opérations model
 */
class OperationModel {

    public id: string;
    libelle: string;
    etat: OPERATION_ETATS_ENUM;
    readonly autresInfos: AutresInfos = new AutresInfos(null);
    public categorie: CategorieOperationModel = {id: "", libelle: ""};
    public ssCategorie: CategorieOperationModel = {id: "", libelle: ""};
    intercompte: string | null = null;
    typeOperation: TYPES_OPERATION_ENUM;
    valeur: number;
    mensualite: {
        periode: PERIODES_MENSUALITE_ENUM;
    };

    /** */
    constructor(id: string, libelle: string, typeOperation: TYPES_OPERATION_ENUM, etat: OPERATION_ETATS_ENUM, valeur: number, mensualite: {
        periode: PERIODES_MENSUALITE_ENUM
    }) {
        this.id = id;
        this.libelle = libelle;
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
export class AutresInfos {
    dateOperation: Date | null = null;
    dateMaj?: Date;

    constructor(dateOperation: Date | null, dateMaj?: Date) {
        this.dateOperation = dateOperation;
        this.dateMaj = dateMaj;
    }
}


/**
 * Fonction de création d'une nouvelle opération.
 * @returns {OperationModel} - Un nouvel objet OperationModel initialisé.
 */
export function createNewOperation(): OperationModel {

    return {
        id: "-1",
        libelle: "",
        categorie: {
            id: null,
            libelle: ""
        },
        ssCategorie: {
            id: null,
            libelle: ""
        },
        typeOperation: TYPES_OPERATION_ENUM.DEPENSE,
        etat: OPERATION_ETATS_ENUM.PREVUE,
        valeur: 0,
        mensualite: {
            periode: PERIODES_MENSUALITE_ENUM.PONCTUELLE
        },
        intercompte: null,
        autresInfos: {
            dateOperation: null
        }
    };
}
