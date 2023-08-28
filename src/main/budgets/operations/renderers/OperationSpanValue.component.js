/**
 * Affichage d'une valeur dans la liste des opérations
 */
import {addEndingZeros} from '../../../Utils/DataUtils.utils'

/**
 * Affichage du style de l'opération suivant sa valeur
 * @param operation opération
 * @param valueOperation valeur de l'opération
 * @returns {string} : class name du style
 */
export function getStyleOperation(operation, valueOperation){

    let style = "";
    if(operation?.etat != null && ("ANNULEE" === operation.etat || "SUPPRIMEE" === operation.etat)){
        style += "text-barree ";
    } else if (valueOperation === 0) {
        style += "";
    }
    else if(valueOperation > 0){
        style += "text-success";
    }
    else{
        style += "text-danger";
    }
    return style;
}

const OperationValue = ({ operation, valueOperation, showSign }) => {

    // définition du libellé
    return (
        <span className={ getStyleOperation(operation, valueOperation) }> { addEndingZeros( showSign ? valueOperation : Math.abs(valueOperation)) } €</span>
    )
};

export default OperationValue
