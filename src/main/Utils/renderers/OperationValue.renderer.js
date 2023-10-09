/**
 * Affichage d'une valeur dans la liste des opérations
 */
import {addEndingZeros} from '../DataUtils.utils'

/**
 * Affichage du style de l'opération suivant sa valeur
 * @param operation opération
 * @param valueOperation valeur de l'opération
 * @returns {string} : class name du style
 */
export function getStyleOperation(operation, valueOperation){

    let style = "";
    if(operation?.etat != null && ("ANNULEE" === operation.etat || "SUPPRIMEE" === operation.etat)){
        style += "text-ANNULEE ";
    } else if (valueOperation === 0) {
        style += "";
    }
    else if(valueOperation > 0){
        style += "text-CREDIT";
    }
    else{
        style += "text-DEPENSE";
    }
    return style;
}

/**
 * Affichage d'une opération
 * @param operation opération
 * @param valueOperation valeur de l'opération
 * @param showSign affichage du signe
 * @param id id de l'élément
 * @returns {JSX.Element} JSX
 * @constructor
 */
const OperationValue = ({operation, valueOperation, showSign, id}) => {

    // définition du libellé
    return (
        <span id={id}
              className={getStyleOperation(operation, valueOperation)}> {addEndingZeros(showSign ? valueOperation : Math.abs(valueOperation))} €</span>
    )
};

export default OperationValue
