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


/**
 * Fonction appelée lorsque le budget est mis à jour. pour trier et grouper les opérations
 * @param listeOperations liste des opérations
 */
export function getOperationsGroupedByDateOperation(listeOperations: OperationModel[]): { [key: string]: OperationModel[] } {
    return listeOperations
        .filter((operation: OperationModel) => operation.etat !== OPERATION_ETATS_ENUM.PLANIFIEE)
        .sort((ope1: OperationModel, ope2: OperationModel) => sortOperations(ope1, ope2))
        .reduce((group: { [key: string]: OperationModel[] }, operation: OperationModel) => {
            const opDateOperation: Date | null = operation.autresInfos.dateOperation;
            const dateOperation: string = (opDateOperation == null) ? "null" : getLabelFRFromDate(new Date(opDateOperation));
            group[dateOperation] = group[dateOperation] ?? [];
            group[dateOperation].push(operation);
            return group;
        }, {});
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
