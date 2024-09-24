import BudgetMensuelModel from "../../Models/BudgetMensuel.model";
import OperationModel from "../../Models/Operation.model";
import {sortOperations} from "../../Utils/DataUtils.utils";

/**
 * Controleur des budgets
 */

/**
 *  Notification lorsque le budget est mis à jour
 * @param budgetData budget
 */
export function handleBudgetUpdate(budgetData : BudgetMensuelModel) {
    console.log("(Re)Chargement du budget", budgetData.id, budgetData.listeOperations.length + " opérations")

    let operationsGroupedByDateOperation: { [key: string]: OperationModel[] } = budgetData.listeOperations
        .filter(operation => operation.etat !== "PLANIFIEE")
        .sort((ope1, ope2) => sortOperations(ope1, ope2))
        .reduce((group, operation) => {
            const dateOperation : string = operation.autresInfos.dateOperation?.toISOString() ?? "null";
            group[dateOperation] = group[dateOperation] ?? [];
            group[dateOperation].push(operation);
            return group;
        }, {});

    this.setState({currentBudget: budgetData, operationsGroupedByDateOperation: operationsGroupedByDateOperation});
    console.log("Chargement du budget correctement effectué");
}



/**
 * Création d'une nouvelle opération
 * @returns {OperationModel}
 */
export function createNewOperation() {

    let newOperation: OperationModel = {
        id: -1,
        libelle: "null",
        categorie: {
            id: "null",
            libelle: "null"
        },
        ssCategorie: {
            id: "null",
            libelle: "null"
        },
        typeOperation: "null",
        etat: "PREVUE",
        valeur: 0,
        mensualite: {
            periode: "PONCTUELLE"
        },
        autresInfos: {
            dateOperation: new Date()
        }
    }
    return newOperation;
}
