import {Tooltip} from '@mui/material';
import {Button} from 'react-bootstrap';
/*
 * Composant Bouton pour actions sur la liste des opérations
 */
const OperationButtonAction = ({ action, iconAction, label}) => {

    return (
        <Tooltip title={label}>
            <Button className="btn-light" action={action} variant="light">
                <img id={action} action={action} src={"/img/statuts/" + iconAction} width="20" height="20" className="d-inline-block align-top" alt={label}/>
            </Button>
        </Tooltip>
    )
};

export default OperationButtonAction