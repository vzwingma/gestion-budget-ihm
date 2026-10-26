import {
    OPERATION_ETATS_ENUM,
    PERIODES_MENSUALITE_ENUM,
    TYPES_CATEGORIES_OPERATION_ENUM,
    TYPES_OPERATION_ENUM
} from "../../Utils/AppBusinessEnums.constants.ts";
import CategorieOperationModel from "./CategorieOperation.model.ts";
import OperationModel, {AutresInfos, createNewOperation} from "./Operation.model.ts";
import SsCategorieOperationModel from "./SsCategorieOperation.model.ts";

/**
 * Opérations Edition model
 */
class OperationEditionModel {

    public id: string | null;
    libelle: string;
    etat: OPERATION_ETATS_ENUM;
    readonly autresInfos: AutresInfos = new AutresInfos(null);
    readonly categorie: CategorieOperationModel = {id: "", libelle: ""};
    readonly ssCategorie: SsCategorieOperationModel = {id: "", libelle: "", type: TYPES_CATEGORIES_OPERATION_ENUM.ESSENTIEL};
    intercompte: string | null = null;
    typeOperation: TYPES_OPERATION_ENUM | null;
    valeur: string | null;
    mensualite: {
        periode: PERIODES_MENSUALITE_ENUM;
        dateFin?: Date | null;
    };

    /** */
    constructor(id: string, libelle: string, typeOperation: TYPES_OPERATION_ENUM, etat: OPERATION_ETATS_ENUM, valeur: string, mensualite: {
        periode: PERIODES_MENSUALITE_ENUM
    }) {
        this.id = id;
        this.libelle = libelle;
        this.etat = etat;
        this.typeOperation = typeOperation;
        this.valeur = valeur;
        this.mensualite = mensualite;
    }
}
export default OperationEditionModel;  // export default is used to export a single class, function or primitive from a script file.


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
            libelle: operation.ssCategorie.libelle ?? "",
            type: operation.ssCategorie.type ?? TYPES_CATEGORIES_OPERATION_ENUM.ESSENTIEL,
        },
        
        typeOperation: operation.typeOperation,
        etat: operation.etat,
        valeur: valeur,
        // Copie (et non référence partagée avec l'opération du contexte) : l'édition ne doit jamais muter l'original
        mensualite: {...operation.mensualite},
        autresInfos: {
            dateOperation: operation.autresInfos.dateOperation
        },
        intercompte: operation.intercompte
    }
}


/**
 * Copie profonde d'une opération en cours d'édition (état immuable : toute modification passe par une copie).
 * Les dates (`Date`) sont partagées par référence : elles sont remplacées, jamais modifiées en place.
 * @param edition opération en édition à copier
 */
export function cloneOperationEdition(edition: OperationEditionModel): OperationEditionModel {
    return {
        ...edition,
        categorie: {...edition.categorie},
        ssCategorie: {...edition.ssCategorie},
        mensualite: {...edition.mensualite},
        autresInfos: {...edition.autresInfos}
    };
}
