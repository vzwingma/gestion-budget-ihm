 import React from 'react'
import Button from 'react-bootstrap/Button';

    const OperationActions = ({ id, etat }) => {
      return (
        <div>{id} : {etat}
            <div class="btn-group" role="group" aria-label="Actions">
            { etat !== "REALISEE" &&
                <Button variant="outline-success">Validation</Button>
            }
            { etat !== "PREVUE" &&
                <Button variant="outline-warning">Prévision</Button>
            }
            { etat !== "ANNULEE" &&
                <Button variant="outline-secondary">Annulation</Button>
            }
            { etat !== "SUPPRIMEE" &&
                <Button variant="outline-danger">Suppression</Button>
            }
            { etat !== "REPORTEE" &&
                <Button variant="outline-info">Report</Button>
            }
            </div>
        </div>
      )
    };

    export default OperationActions