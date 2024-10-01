import {OPERATION_ETATS_ENUM, PERIODES_MENSUALITE_ENUM, TYPES_OPERATION_ENUM} from "../Utils/AppBusinessEnums.constants";
import CategorieOperationModel from "./CategorieOperation.model";

/**
 * Opérations model
 */
class OperationModel {

    id: string;
    libelle: string;
    etat: OPERATION_ETATS_ENUM;
    autresInfos: AutresInfos;
    categorie: CategorieOperationModel;
    ssCategorie: CategorieOperationModel;
    intercompte: string | null = null;
    typeOperation: TYPES_OPERATION_ENUM;
    valeur: number;
    mensualite: {
        periode: PERIODES_MENSUALITE_ENUM;
    };

    /** */
    constructor(id: string, libelle: string, autresInfos: AutresInfos, categorie: CategorieOperationModel, ssCategorie: CategorieOperationModel, typeOperation: TYPES_OPERATION_ENUM, etat: OPERATION_ETATS_ENUM, valeur: number, mensualite: {
        periode: PERIODES_MENSUALITE_ENUM
    }) {
        this.id = id;
        this.libelle = libelle;
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
    dateOperation: Date | null = null;
    dateMaj?: Date;

    constructor(dateOperation: Date, dateMaj: Date) {
        this.dateOperation = dateOperation;
        this.dateMaj = dateMaj;
    }
}


/**
 * Fonction de création d'une nouvelle opération.
 * @returns {OperationModel} - Un nouvel objet OperationModel initialisé.
 */
export function createNewOperation(): OperationModel {

    let newOperation: OperationModel = {
        id: "-1",
        libelle: "null",
        categorie: {
            id: null,
            libelle: "null"
        },
        ssCategorie: {
            id: null,
            libelle: "null"
        },
        typeOperation: TYPES_OPERATION_ENUM.CREDIT,
        etat: OPERATION_ETATS_ENUM.PREVUE,
        valeur: 0,
        mensualite: {
            periode: PERIODES_MENSUALITE_ENUM.MENSUELLE
        },
        intercompte: null,
        autresInfos: {
            dateOperation: null
        }
    }
    return newOperation;
}
