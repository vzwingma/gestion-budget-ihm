import {getLabelFRFromDate} from "../../../Utils/Date.utils.ts";
import OperationModel from "../../../Models/budgets/Operation.model.ts";
import {sortOperations, sortPeriodicOperations} from "../../../Utils/OperationData.utils.ts";
import {OPERATION_ETATS_ENUM, PERIODES_MENSUALITE_ENUM} from "../../../Utils/AppBusinessEnums.constants.ts";

/**
 * Controleur des budgets
 */

/**
 * Fonction appelée lorsque le budget est mis à jour. pour trier et grouper les opérations
 * @param listeOperations liste des opérations
 */
export function getOperationsGroupedByPeriodicity(listeOperations: OperationModel[]): { [key: string]: OperationModel[] } {
    return listeOperations
        .filter((operation: OperationModel) => operation.mensualite.periode !== PERIODES_MENSUALITE_ENUM.PONCTUELLE)
        .sort((ope1: OperationModel, ope2: OperationModel) => sortPeriodicOperations(ope1, ope2))
        .reduce((group: { [key: string]: OperationModel[] }, operation: OperationModel) => {
            const periodeOperation: PERIODES_MENSUALITE_ENUM | null = operation.mensualite.periode;

            group[periodeOperation] = group[periodeOperation] ?? [];
            group[periodeOperation].push(operation);
            return group;
        }, {});
}
