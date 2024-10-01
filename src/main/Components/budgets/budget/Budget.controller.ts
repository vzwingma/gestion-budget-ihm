import { getLabelFromDate } from "../../../Utils/Date.utils";
import OperationModel from "../../../Models/Operation.model";
import { sortOperations } from "../../../Utils/OperationData.utils";
import { OPERATION_ETATS_ENUM } from "../../../Utils/AppBusinessEnums.constants";

/**
 * Controleur des budgets
 */

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
            const dateOperation: string = opDateOperation != null ? getLabelFromDate(new Date(opDateOperation)) : "null" ?? "null";
            group[dateOperation] = group[dateOperation] ?? [];
            group[dateOperation].push(operation);
            return group;
        }, {});
}
