/**
 * Affichage d'une valeur dans la liste des opérations
 */
import React, {JSX} from 'react';
import OperationModel from '../../Models/budgets/Operation.model.ts';
import {OPERATION_ETATS_ENUM} from '../AppBusinessEnums.constants.ts';
import { addEndingZeros } from '../OperationData.utils.ts';

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
    /** Préfixe « + » explicite devant une valeur strictement positive (le signe n'est alors plus porté par la seule couleur) */
    explicitPlus?: boolean;
}

/**
 * Affichage d'une opération
 * @param id
 * @param valueOperation : number valeur de l'opération
 * @param showSign : boolean affichage du signe
 * @param operation : OperationModel opération
 * @param explicitPlus : boolean préfixe « + » devant les valeurs positives
 * @returns {JSX.Element} JSX
 * @constructor
 */
const OperationValue: React.FC<OperationValueProps> = ({   id,
                                                           valueOperation,
                                                           showSign,
                                                           operation,
                                                           explicitPlus
                                                       }: OperationValueProps): JSX.Element => {
    if (valueOperation === null) {
        return <span style={{color: "#808080"}}>Non initialisé</span>
    } else {
        // définition du libellé
        const plus = explicitPlus && showSign && valueOperation > 0 ? "+" : "";
        return (
            <span id={id} className={getStyleOperation(valueOperation, operation)}
                  style={{fontVariantNumeric: "tabular-nums"}}>
                {plus}{addEndingZeros(showSign ? valueOperation : Math.abs(valueOperation))} €
            </span>
        )
    }
};
export default OperationValue
