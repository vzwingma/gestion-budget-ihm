import {Button, OverlayTrigger, Tooltip} from 'react-bootstrap';

/*
 * Composant Bouton pour actions sur la liste des opérations
 */
const OperationButtonAction = ({ action, iconAction, label}) => {

    return (
        <OverlayTrigger overlay={  <Tooltip>{label}</Tooltip>  }>
            <Button className="btn-light" action={action} variant="light">
                <img action={action} src={"/img/statuts/" + iconAction} width="20" height="20" className="d-inline-block align-top" alt={label}/>
            </Button>
        </OverlayTrigger>
    )
};

export default OperationButtonAction