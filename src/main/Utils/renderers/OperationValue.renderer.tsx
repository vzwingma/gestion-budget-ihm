/**
 * Affichage d'une valeur dans la liste des opérations
 */
import React from 'react';
import {addEndingZeros} from '../DataUtils.utils'
import Operation from '../../Models/Operation.model';

/**
 * Affichage du style de l'opération suivant sa valeur
 * @param operation opération
 * @param valueOperation valeur de l'opération
 * @returns {string} : class name du style
 */
export function getStyleOperation(valueOperation : number, operation? : Operation): string {

    let style = "";
    if (operation?.etat != null && ("ANNULEE" === operation.etat || "SUPPRIMEE" === operation.etat)) {
        style += "text-ANNULEE ";
    } else if (valueOperation === 0) {
        style += "";
    } else if (valueOperation > 0) {
        style += "text-CREDIT";
    } else {
        style += "text-DEPENSE";
    }
    return style;
}


interface OperationValueProps {
    valueOperation: number;
    showSign: boolean;
    operation?: Operation;
}

/**
 * Affichage d'une opération
 * @param {Operation} operation : opération
 * @param valueOperation : number valeur de l'opération
 * @param showSign : boolean affichage du signe
 * @returns {JSX.Element} JSX
 * @constructor
 */
const OperationValue: React.FC<OperationValueProps> = ({ valueOperation, showSign, operation }) : JSX.Element => {
    if (valueOperation === undefined || valueOperation === null) {
        return  <></>
    } else {
        // définition du libellé
        return (
            <span className={getStyleOperation(valueOperation, operation)}>
                {addEndingZeros(showSign ? valueOperation : Math.abs(valueOperation))} €
            </span>
        )
    }
};
export default OperationValue
