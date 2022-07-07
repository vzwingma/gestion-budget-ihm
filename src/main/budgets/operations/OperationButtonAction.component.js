import { Button } from 'react-bootstrap';

/*
 * Composant Bouton pour actions sur la liste des opérations
 */
const OperationButtonAction = ({ action, iconAction, label }) => {

    return (
        <Button className="btn-light" action={action} variant="light">
            <img src={"/img/statuts/" + iconAction} width="20" height="20" className="d-inline-block align-top" alt={label}/>
        </Button>
    )
};

export default OperationButtonAction