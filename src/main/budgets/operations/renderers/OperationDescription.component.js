/**
 * Affichage du style
 */
const OperationDescription = ({ operation, libelle }) => {

        return (
            <span className={"operation_" +operation.etat}>{ libelle }</span>
        )
};
export default OperationDescription