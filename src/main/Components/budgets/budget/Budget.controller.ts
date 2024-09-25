import BudgetMensuelModel from "../../../Models/BudgetMensuel.model";
import OperationModel from "../../../Models/Operation.model";
import {sortOperations} from "../../../Utils/DataUtils.utils";

/**
 * Controleur des budgets
 */

/**
 * Fonction appelée lorsque le budget est mis à jour.
 * @param budgetData - Les données du budget mensuel.
 * @param handleBudgetUpdate - Fonction de gestion de la mise à jour du budget.
 */
export function budgetUpdateloaded(budgetData : BudgetMensuelModel, handleBudgetUpdate : Function) {
    console.log("(Re)Chargement du budget", budgetData.id, budgetData.listeOperations.length + " opérations")

    let operationsGroupedByDateOperation: { [key: string]: OperationModel[] } = budgetData.listeOperations
        .filter((operation : OperationModel) => operation.etat !== "PLANIFIEE")
        .sort((ope1 : OperationModel, ope2 : OperationModel) => sortOperations(ope1, ope2))
        .reduce((group : { [key: string]: OperationModel[] } , operation : OperationModel) => {
            const dateOperation : string = operation.autresInfos.dateOperation?.toDateString() ?? "null";
            group[dateOperation] = group[dateOperation] ?? [];
            group[dateOperation].push(operation);
            return group;
        }, {});

    handleBudgetUpdate(budgetData, operationsGroupedByDateOperation);
    console.log("Chargement du budget correctement effectué");
}