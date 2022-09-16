/**
 * Affichage d'une valeur dans la liste des opérations
 */


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
        <span className={ getStyleOperation(valueOperation) }>{ Math.abs(valueOperation).toFixed(2) } €</span>
    )
};

export default OperationValue