import { getLabelFRFromDate } from "../../../Utils/Date.utils.ts";
import OperationModel from "../../../Models/budgets/Operation.model.ts";
import { sortOperations } from "../../../Utils/OperationData.utils.ts";
import { OPERATION_ETATS_ENUM, OPERATION_STATUS_ENUM } from "../../../Utils/AppBusinessEnums.constants.ts";
import CategorieOperationModel from "../../../Models/budgets/CategorieOperation.model.ts";

/**
 * Controleur des budgets
 */

/**
 * 
 * @param listeOperations liste des opérations
 */
export function updateOperationsStatus(listeOperations: OperationModel[]): void {
    listeOperations.forEach((operation: OperationModel) => {
        operation.statuts ??= [];
        if (operation.libelle.includes(OPERATION_STATUS_ENUM.EN_RETARD_LEGACY)) {
            operation.statuts.push(OPERATION_STATUS_ENUM.EN_RETARD);
            operation.libelle = operation.libelle.replaceAll(OPERATION_STATUS_ENUM.EN_RETARD_LEGACY, "");
        }
    })
}


/** Clé du groupe « À valider » (opérations PREVUE + REPORTEE), placé en tête de liste */
export const GROUPE_A_VALIDER = "A_VALIDER";

/**
 * @param operation opération
 * @returns true si l'opération est « à valider » : état PREVUE ou REPORTEE et sans date d'opération.
 * Dès qu'une date lui est donnée, elle rejoint son groupe de date.
 */
function isOperationAValider(operation: OperationModel): boolean {
    return (operation.etat === OPERATION_ETATS_ENUM.PREVUE || operation.etat === OPERATION_ETATS_ENUM.REPORTEE)
        && operation.autresInfos.dateOperation == null;
}

/**
 * Fonction appelée lorsque le budget est mis à jour. pour trier et grouper les opérations :
 * groupe « À valider » (PREVUE + REPORTEE sans date) en tête, puis le reste groupé par date d'opération
 * @param listeOperations liste des opérations
 */
export function getOperationsGroupedByDateOperation(listeOperations: OperationModel[]): { [key: string]: OperationModel[] } {
    const operationsTriees = listeOperations
        .filter((operation: OperationModel) => operation.etat !== OPERATION_ETATS_ENUM.PLANIFIEE)
        .sort((ope1: OperationModel, ope2: OperationModel) => sortOperations(ope1, ope2));

    const operationsAValider = operationsTriees.filter(isOperationAValider);
    const groupesInitiaux: { [key: string]: OperationModel[] } = operationsAValider.length > 0
        ? {[GROUPE_A_VALIDER]: operationsAValider}
        : {};

    return operationsTriees
        .filter((operation: OperationModel) => !isOperationAValider(operation))
        .reduce((group: { [key: string]: OperationModel[] }, operation: OperationModel) => {
            const opDateOperation: Date | null = operation.autresInfos.dateOperation;
            const dateOperation: string = (opDateOperation == null) ? "null" : getLabelFRFromDate(new Date(opDateOperation));
            group[dateOperation] = group[dateOperation] ?? [];
            group[dateOperation].push(operation);
            return group;
        }, groupesInitiaux);
}

/**
 *
 * @param listeCategories liste des catégories
 * @returns  liste des catégories avec les sous catégories
 */
export function populateAllCategories(listeCategories: CategorieOperationModel[]): CategorieOperationModel[] {
    listeCategories
        .forEach((cat: CategorieOperationModel) => {
            if (cat.listeSSCategories != null) {
                for (let ssCategorie of cat.listeSSCategories) {
                    ssCategorie.categorieParente = cat;
                }
            }
            return cat.listeSSCategories
        });
    return listeCategories;
}
