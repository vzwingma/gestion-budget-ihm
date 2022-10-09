/**
 * Affichage d'une valeur dans la liste des opérations
 */
import {addEndingZeros} from '../../../Utils/DataUtils.utils'

/**
 * Affichage du style de l'opération suivant sa valeur
 * @param valueOperation valeur de l'opération
 * @returns {string} : class name du style
 */
export function getStyleOperation(valueOperation){
    if(valueOperation === 0){
        return "";
    }
    else if(valueOperation > 0){
        return "text-success"
    }
    else{
        return "text-danger"
    }
}

const OperationValue = ({ valueOperation }) => {

    // définition du libellé
    return (
        <span className={ getStyleOperation(valueOperation) }>{ addEndingZeros(Math.abs(valueOperation)) } €</span>
    )
};

export default OperationValue