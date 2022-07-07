import React, { Component } from "react";
import { ButtonGroup } from 'react-bootstrap';
import * as AppConstants from "../../Utils/AppEnums.constants"
import * as ClientHTTP from './../../Services/ClientHTTP.service'
import OperationButtonAction from "./OperationButtonAction.component"

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
                this.props.onOperationChange(data);
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
                    <OperationButtonAction action="REALISEE" iconAction="circle_ok.png" label="Valider l'opération"/>
                }
                { this.props.operation.etat !== "PREVUE" &&
                    <OperationButtonAction action="PREVUE" iconAction="circle_clock.png" label="Prévoir l'opération"/>
                }
                { this.props.operation.etat !== "ANNULEE" &&
                    <OperationButtonAction action="ANNULEE" iconAction="circle_cancel.png" label="Annuler l'opération"/>
                }
                { this.props.operation.etat !== "SUPPRIMEE" &&
                    <OperationButtonAction action="SUPPRIMEE" iconAction="circle_remove.png" label="Supprimer l'opération"/>
                }
                { this.props.operation.etat !== "REPORTEE" &&
                    <OperationButtonAction action="REPORTEE" iconAction="circle_arrow_right.png" label="Reporter l'opération"/>
                }
            </ButtonGroup>
        )
    }
}