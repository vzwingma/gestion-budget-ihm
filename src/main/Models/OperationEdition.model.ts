import {OPERATION_ETATS_ENUM, PERIODES_MENSUALITE_ENUM, TYPES_OPERATION_ENUM} from "../Utils/AppBusinessEnums.constants";
import CategorieOperationModel from "./CategorieOperation.model";
import OperationModel, { createNewOperation } from "./Operation.model";

/**
 * Opérations Edition model
 */
class OperationEditionModel {

    id: string | null;
    libelle: string;
    etat: OPERATION_ETATS_ENUM;
    autresInfos: AutresInfos;
    categorie: CategorieOperationModel;
    ssCategorie: CategorieOperationModel;
    intercompte: string | null = null;
    typeOperation: TYPES_OPERATION_ENUM | null;
    valeur: string | null;
    mensualite: {
        periode: PERIODES_MENSUALITE_ENUM;
    };

    /** */
    constructor(id: string, libelle: string, autresInfos: AutresInfos, categorie: CategorieOperationModel, ssCategorie: CategorieOperationModel, typeOperation: TYPES_OPERATION_ENUM, etat: OPERATION_ETATS_ENUM, valeur: string, mensualite: {
        periode: PERIODES_MENSUALITE_ENUM
    }) {
        this.id = id;
        this.libelle = libelle;
        this.etat = etat;
        this.autresInfos = autresInfos;
        this.categorie = categorie;
        this.ssCategorie = ssCategorie;
        this.typeOperation = typeOperation;
        this.valeur = valeur;
        this.mensualite = mensualite;
    }
}
export default OperationEditionModel;  // export default is used to export a single class, function or primitive from a script file.

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
 * @returns {OperationEditionModel} - Un nouvel objet OperationModel initialisé.
 */
export function createNewOperationEdition(): OperationEditionModel {
    return cloneOperation(createNewOperation());
}


/**
 * Création d'un objet Operation à partir du formulaire
 * @param operation : object : Operation à copier
 */
export function cloneOperation(operation: OperationModel): OperationEditionModel {
    const typeOperationSign : number = operation.typeOperation === TYPES_OPERATION_ENUM.DEPENSE ? -1 : 1;
    const valeur = (typeOperationSign * operation.valeur).toString() ?? null;
    return {
        id: operation.id,
        libelle: operation.libelle,
        categorie: {
            id: operation.categorie.id,
            libelle: operation.categorie.libelle
        },
        ssCategorie: {
            id: operation.ssCategorie.id ?? null,
            libelle: operation.ssCategorie.libelle ?? ""
        },
        typeOperation: operation.typeOperation,
        etat: operation.etat,
        valeur: valeur,
        mensualite: operation.mensualite,
        autresInfos: {
            dateOperation: operation.autresInfos.dateOperation
        },
        intercompte: operation.intercompte
    }
} 

