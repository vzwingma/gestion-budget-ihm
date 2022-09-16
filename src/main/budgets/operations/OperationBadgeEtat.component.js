import React, { Component } from "react";
import Badge from 'react-bootstrap/Badge';

export default class OperationEtat extends Component {

    // Render de l'état de l'opération avec surcharge du style du bouton
    render(){
      return (
          <div id={this.props.id}>
            { this.props.etat === "REALISEE" &&
            <Badge bg="success">Réalisée</Badge>
            }
            { this.props.etat === "PREVUE" &&
            <Badge bg="warning">Prévue</Badge>
            }
            { this.props.etat === "ANNULEE" &&
            <Badge bg="Secondary">Annulée</Badge>
            }
            { this.props.etat === "SUPPRIMEE" &&
            <Badge bg="danger">Supprimée</Badge>
            }
            { this.props.etat === "REPORTEE" &&
            <Badge bg="info">Reportée</Badge>
            }
            { this.props.etat === "PLANIFIEE" &&
            <Badge bg="Secondary">Planifiée</Badge>
            }
        </div>
      )
    }
}