/*
 * Affichage d'une valeur dans la liste des opérations
 */
const OperationValue = ({ valueOperation }) => {

    // définition du libellé
    return (
        valueOperation === 0 ?
            <span>{valueOperation.toFixed(2)} €</span>
            :
            valueOperation > 0 ?
                <span className="text-success">{valueOperation.toFixed(2)} €</span> :
                <span className="text-danger">{valueOperation.toFixed(2)} €</span>
    )
};

export default OperationValue