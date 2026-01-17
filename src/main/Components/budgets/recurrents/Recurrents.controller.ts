import OperationModel from "../../../Models/budgets/Operation.model.ts";
import {sortPeriodicOperations} from "../../../Utils/OperationData.utils.ts";
import {OPERATION_STATUS_ENUM, PERIODES_MENSUALITE_ENUM} from "../../../Utils/AppBusinessEnums.constants.ts";
import { isDerniereEcheanceRO } from "../operations/recurrentes/details/OperationRecurrenteDetailPage.constants.ts";

/**
 * Controleur des budgets
 */

/**
 * Fonction appelée lorsque le budget est mis à jour. pour trier et grouper les opérations
 * @param listeOperations liste des opérations
 */
export function getOperationsRecurrentesGroupedByPeriodicity(listeOperations: OperationModel[], budgetId: string): { [key: string]: OperationModel[] } {

    if(listeOperations == null || listeOperations.length === 0){
        return {};
    }
    return listeOperations
        .filter((operation: OperationModel) => operation.mensualite != null && operation.mensualite?.periode !== PERIODES_MENSUALITE_ENUM.PONCTUELLE)
        .sort((ope1: OperationModel, ope2: OperationModel) => sortPeriodicOperations(ope1, ope2))
        // Calcul des status
        .map((operation: OperationModel) => setStatusOperations(operation, budgetId))
        .reduce((group: { [key: string]: OperationModel[] }, operation: OperationModel) => {
            const periodeOperation: PERIODES_MENSUALITE_ENUM | null = operation.mensualite.periode;

            group[periodeOperation] = group[periodeOperation] ?? [];
            group[periodeOperation].push(operation);
            return group;
        }, {});
}


/** * 
 * @param operation opération
 * @param budgetId id du budget
 * @returns status de l'opération
 */
function setStatusOperations(operation: OperationModel, budgetId: string): OperationModel {
    operation.statuts = [];
    if(isDerniereEcheanceRO(operation, budgetId)) {
        operation.statuts.push(OPERATION_STATUS_ENUM.DERNIERE_ECHEANCE);
    }
    return operation;
}