import { getLabelFromDate } from "../../../Utils/Date.utils";
import BudgetMensuelModel from "../../../Models/BudgetMensuel.model";
import OperationModel from "../../../Models/Operation.model";
import {sortOperations} from "../../../Utils/OperationData.utils";

/**
 * Controleur des budgets
 */
export interface FunctionHandleBudgetUpdateProps {
    budget: BudgetMensuelModel
    operationsGroupedByDateOperation :{ [key: string]: OperationModel[] } ;
}



/**
 * Fonction de tri des opérations
 * @param ope1 opération 1
 * @param ope2 opération 2
 * @returns {number} -1 si ope1 avant ope2, 1 si ope2 avant ope1, 0 si égalité
 * @private
 */
export function getOperationsGroupedByDateOperation(listeOperations: OperationModel[]): { [key: string]: OperationModel[] } {
    return listeOperations
                        .filter((operation: OperationModel) => operation.etat !== "PLANIFIEE")
                        .sort((ope1: OperationModel, ope2: OperationModel) => sortOperations(ope1, ope2))
                        .reduce((group: { [key: string]: OperationModel[] }, operation: OperationModel) => 
                            {
                                const opDateOperation : Date | null = operation.autresInfos.dateOperation;
                                const dateOperation: string = opDateOperation != null && opDateOperation != undefined ? getLabelFromDate(new Date(opDateOperation)) : "null" ?? "null";
                                group[dateOperation] = group[dateOperation] ?? [];
                                group[dateOperation].push(operation);
                                return group;
                            }, {});
}
