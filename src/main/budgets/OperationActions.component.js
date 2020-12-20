import React, { Component } from "react";
import Button from 'react-bootstrap/Button';
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

    // Mise à jour de l'état de l'opération
    handleToggleClick(event) {
        this.props.operation.etat=event.target.attributes["action"].value;
        this.updateOperation(this.props.operation);
    }

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



    render(){
      return (
        <div>{this.props.id} : {this.props.operation.etat}
            <div class="btn-group" role="group" aria-label="Actions" onClick={this.handleToggleClick}>
            { this.props.operation.etat !== "REALISEE" &&
                <Button action="REALISEE" variant="outline-success">Validation</Button>
            }
            { this.props.operation.etat !== "PREVUE" &&
                <Button action="PREVUE" variant="outline-warning">Prévision</Button>
            }
            { this.props.operation.etat !== "ANNULEE" &&
                <Button action="ANNULEE" variant="outline-secondary">Annulation</Button>
            }
            { this.props.operation.etat !== "SUPPRIMEE" &&
                <Button action="SUPPRIMEE" variant="outline-danger">Suppression</Button>
            }
            { this.props.operation.etat !== "REPORTEE" &&
                <Button action="REPORTEE" variant="outline-info">Report</Button>
            }
            </div>
        </div>
      )
    }
}