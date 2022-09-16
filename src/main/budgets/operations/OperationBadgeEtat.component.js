import React, { Component } from "react";
import Badge from 'react-bootstrap/Badge';
import BadgeMUI from "@mui/material/Badge";

export default class OperationEtat extends Component {

    // Render de l'état de l'opération avec surcharge du style du bouton, et englobé par un badge MUI pour la dernière opération
    render(){
      return (
          <div id={this.props.id}>
              <>
                  { this.props.etat === "REALISEE" && !this.props.derniere  && <Badge bg="success">Réalisée</Badge>    }
                  { this.props.etat === "REALISEE" && this.props.derniere   && <BadgeMUI  variant="dot" color="primary"><Badge bg="success">Réalisée</Badge></BadgeMUI>    }
                  { this.props.etat === "PREVUE"      && <Badge bg="warning">Prévue</Badge>      }
                  { this.props.etat === "ANNULEE"     && <Badge bg="Secondary">Annulée</Badge>   }
                  { this.props.etat === "SUPPRIMEE"   && <Badge bg="danger">Supprimée</Badge>    }
                  { this.props.etat === "REPORTEE"    && <Badge bg="info">Reportée</Badge>       }
                  { this.props.etat === "PLANIFIEE"   && <Badge bg="Secondary">Planifiée</Badge> }
              </>
        </div>
      )
    }
}