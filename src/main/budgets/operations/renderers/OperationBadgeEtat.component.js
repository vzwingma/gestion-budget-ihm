import React, { Component } from "react";
import BadgeMUI from "@mui/material/Badge";
import {Chip, Tooltip} from "@mui/material";

export default class OperationEtat extends Component {

    // Render de l'état de l'opération avec surcharge du style du bouton, et englobé par un badge MUI pour la dernière opération
    render(){
      return (
        <div id={this.props.id}>
            { this.props.etat === "REALISEE"  && !this.props.derniere && <Chip color="success" label="Réalisée" size={"small"} className={"chipEtat"} />    }
            { this.props.etat === "REALISEE"  && this.props.derniere  &&
                <Tooltip title="Dernière opération réalisée">
                <BadgeMUI  variant="dot" color="primary">
                    <Chip color="success" label="Réalisée"  size={"small"}  className={"chipEtat"}/>
                </BadgeMUI>
                </Tooltip> }
            { this.props.etat === "PREVUE"    && <Chip color="warning" label="Prévue" size={"small"} className={"chipEtat"} />   }
            { this.props.etat === "ANNULEE"   && <Chip color="default" label="Annulée" size={"small"} className={"chipEtat"} /> }
            { this.props.etat === "SUPPRIMEE" && <Chip color="error" label="Supprimée" size={"small"} className={"chipEtat"} />  }
            { this.props.etat === "REPORTEE"  && <Chip color="secondary" label="Reportée" size={"small"} className={"chipEtat"} /> }
            { this.props.etat === "PLANIFIEE" && <Chip color="info" label="Planifiée" size={"small"} className={"chipEtat"} /> }
        </div>
      )
    }
}