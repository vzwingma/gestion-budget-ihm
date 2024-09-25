import {TYPES_OPERATION_ENUM} from "../Utils/AppBusinessEnums.constants";
import CategorieOperationModel from "./CategorieOperation.model";

/**
 * Opérations model
 */
class OperationModel {

    id: string;
    libelle: string;
    etat: string;
    autresInfos: AutresInfos;
    categorie: CategorieOperationModel;
    ssCategorie: CategorieOperationModel;
    intercompte: string | null = null;
    typeOperation: string;
    valeur: number;
    mensualite: {
        periode: string;
    };

    /** */
    constructor(id: string, libelle: string, autresInfos: AutresInfos, categorie: CategorieOperationModel, ssCategorie: CategorieOperationModel, typeOperation: string, etat: string, valeur: number, mensualite: {
        periode: string
    }) {
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
        typeOperation: "null",
        etat: "PREVUE",
        valeur: 0,
        mensualite: {
            periode: "PONCTUELLE"
        },
        intercompte: null,
        autresInfos: {
            dateOperation: null
        }
    }
    return newOperation;
}


/**
 * Création d'un objet Operation à partir du formulaire
 * @param operation : object : Operation à copier
 */
export function cloneOperation(operation: OperationModel): OperationModel {
    return {
        id: operation.id,
        libelle: operation.libelle,
        categorie: {
            id: operation.categorie.id,
            libelle: operation.categorie.libelle
        },
        ssCategorie: {
            id: operation.ssCategorie.id != null ? operation.ssCategorie.id : null,
            libelle: operation.ssCategorie.libelle != null ? operation.ssCategorie.libelle : ""
        },
        typeOperation: operation.typeOperation,
        etat: operation.etat,
        valeur: (operation.typeOperation === TYPES_OPERATION_ENUM.DEPENSE ? -1 : 1) * operation.valeur,
        mensualite: operation.mensualite,
        autresInfos: {
            dateOperation: operation.autresInfos.dateOperation
        },
        intercompte: operation.intercompte
    }
}

