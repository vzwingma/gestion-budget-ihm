/**
 * Affichage d'une valeur dans la liste des opérations
 */
import React, {JSX} from 'react';
import {addEndingZeros} from '../OperationData.utils'
import OperationModel from '../../Models/budgets/Operation.model';
import { OPERATION_ETATS_ENUM } from '../AppBusinessEnums.constants';

/**
 * Affichage du style de l'opération suivant sa valeur
 * @param operation opération
 * @param valueOperation valeur de l'opération
 * @returns {string} : class name du style
 */
export function getStyleOperation(valueOperation : number | null, operation? : OperationModel): string {

    let style = "";
    if (operation?.etat != null && (OPERATION_ETATS_ENUM.ANNULEE === operation.etat || OPERATION_ETATS_ENUM.SUPPRIMEE === operation.etat)) {
        style += "text-ANNULEE ";
    } else if (valueOperation === 0 || valueOperation === null) {
        style += "";
    } else if (valueOperation > 0) {
        style += "text-CREDIT";
    } else {
        style += "text-DEPENSE";
    }
    return style;
}


interface OperationValueProps {
    id: string,
    valueOperation: number | null;
    showSign: boolean;
    operation?: OperationModel;
}

/**
 * Affichage d'une opération
 * @param id
 * @param {OperationModel} operation : opération
 * @param valueOperation : number valeur de l'opération
 * @param showSign : boolean affichage du signe
 * @returns {JSX.Element} JSX
 * @constructor
 */
const OperationValue: React.FC<OperationValueProps> = ({   id,
                                                           valueOperation,
                                                           showSign,
                                                           operation
                                                       }: OperationValueProps): JSX.Element => {
    if (valueOperation === null) {
        return <span style={{color: "#808080"}}>Non initialisé</span>
    } else {
        // définition du libellé
        return (
            <span id={id} className={getStyleOperation(valueOperation, operation)}>
                {addEndingZeros(showSign ? valueOperation : Math.abs(valueOperation))} €
            </span>
        )
    }
};
export default OperationValue
