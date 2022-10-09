import {Tooltip, Button} from '@mui/material';

/*
 * Composant Bouton pour actions sur la liste des opérations
 */
const OperationButtonAction = ({ action, iconAction, label}) => {

    return (

        <Tooltip title={label}>
            <Button className="btn-actions-operation">
                <img id={action} src={"/img/statuts/" + iconAction} width="20" height="20" className="d-inline-block align-top" alt={label}/>
            </Button>
        </Tooltip>
    )
};

export default OperationButtonAction