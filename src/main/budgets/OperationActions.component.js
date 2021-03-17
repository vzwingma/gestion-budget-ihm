import React, { Component } from "react";
import { ButtonGroup, Button } from 'react-bootstrap';
import * as AppConstants from "../Utils/AppEnums.constants"
import * as ClientHTTP from './../Services/ClientHTTP.service'

export default class OperationActions extends Component {

    // Constructor
    /** Constructeur **/
    constructor(props){
        super(props);
        this.handleToggleClick= this.handleToggleClick.bind(this);
        this.updateOperation = this.updateOperation.bind(this);
    }

    // Modification de l'opération
    updateOperation(operation){
        console.log("Modification de l'opération " + operation.id + " -> " + operation.etat);
        const getURL = ClientHTTP.getURL(AppConstants.BACKEND_ENUM.URL_OPERATIONS, AppConstants.SERVICES_URL.OPERATIONS.UPDATE,
                                [ this.props.budgetid, operation.id ])
        fetch(getURL,
            {
                method: 'POST', headers: ClientHTTP.getHeaders(), body: JSON.stringify(operation)
            })
            .then(res => res.json())
            .then((data) => {
                // Update du budget global (parent)
                this.props.onBudgetChange(data);
            })
            .catch((e) => {
                console.log("Erreur lors de la mise à jour de l'opération " + operation.id + " >> "+ e);
                console.log(operation);
            })
    }


    // Mise à jour de l'état de l'opération
    handleToggleClick(event) {
        this.props.operation.etat=event.target.attributes["action"].value;
        this.updateOperation(this.props.operation);
    }

    render(){
      return (
        <ButtonGroup aria-label="Actions" onClick={this.handleToggleClick}>
            <style type="text/css">{`
                .btn-light {
                    padding: 0px 1px 0px 1px;
                }
            `}</style>
            { this.props.operation.etat !== "REALISEE" &&
                <Button action="REALISEE" variant="light">
                    <img action="REALISEE" src="/img/statuts/circle_ok.png" width="20" height="20" className="d-inline-block align-top" alt="Valider l'opération"/>
                </Button>
            }
            { this.props.operation.etat !== "PREVUE" &&
                <Button action="PREVUE" variant="light">
                    <img action="PREVUE" src="/img/statuts/circle_clock.png" width="20" height="20" className="d-inline-block align-top" alt="Prévoir l'opération"/>
                </Button>
            }
            { this.props.operation.etat !== "ANNULEE" &&
                <Button action="ANNULEE" variant="light">
                    <img action="ANNULEE" src="/img/statuts/circle_cancel.png" width="20" height="20" className="d-inline-block align-top" alt="Annuler l'opération"/>
                </Button>
            }
            { this.props.operation.etat !== "SUPPRIMEE" &&
                <Button action="SUPPRIMEE" variant="light">
                    <img action="SUPPRIMEE" src="/img/statuts/circle_remove.png" width="20" height="20" className="d-inline-block align-top" alt="Supprimer l'opération"/>
                </Button>
            }
            { this.props.operation.etat !== "REPORTEE" &&
                <Button action="REPORTEE" variant="light">
                    <img action="REPORTEE" src="/img/statuts/circle_arrow_right.png" width="20" height="20" className="d-inline-block align-top" alt="Reporter l'opération"/>
                </Button>
            }
        </ButtonGroup>
      )
    }
}