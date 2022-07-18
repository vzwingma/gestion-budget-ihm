import React, { Component } from "react";
import Badge from 'react-bootstrap/Badge';

export default class OperationEtat extends Component {

    // Render de l'état de l'opération avec surcharge du style du bouton
    render(){
      return (

        <div id={this.props.id}>

            <style type="text/css">{`
                .badge {
                  width: 76px;
                  font-size: 80%;
                  vertical-align: middle;
                }
            `}</style>
            { this.props.operation.etat === "REALISEE" &&
                <Badge bg="success">Réalisée</Badge>
            }
            { this.props.operation.etat === "PREVUE" &&
                <Badge bg="warning">Prévue</Badge>
            }
            { this.props.operation.etat === "ANNULEE" &&
                <Badge bg="Secondary">Annulée</Badge>
            }
            { this.props.operation.etat === "SUPPRIMEE" &&
                <Badge bg="danger">Supprimée</Badge>
            }
            { this.props.operation.etat === "REPORTEE" &&
                <Badge bg="info">Reportée</Badge>
            }
        </div>
      )
    }
}