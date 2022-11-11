import React, { Component } from "react";
import {Chip, Tooltip} from '@mui/material';

export default class OperationMensualite extends Component {


    /** Tooltip */
    getTooltip(){
            return "Prochaine échéance dans " + this.props.mensualite.prochaineEcheance + " mois";
    }

    /** Libellé du badge */
    getLibelle(){
        switch (this.props.mensualite.periode) {
            case "MENSUELLE":
                return "Mensuelle";
            case "TRIMESTRIELLE":
                return "Trimestrielle";
            case "SEMESTRIELLE":
                return "Semestrielle";
            case "ANNUELLE":
                return "Annuelle";
            default:
                return "";
        }
    }

    /** Couleur du background du badge */
    getBackground(){
        switch (this.props.mensualite.periode) {
            case "MENSUELLE":
                return "default";
            case "TRIMESTRIELLE":
                return "info";
            case "SEMESTRIELLE":
                return "warning";
            case "ANNUELLE":
                return "error";
            default:
                return "default"
        }
    }

    // Render de l'état de l'opération avec surcharge du style du bouton
    render(){
      return (
        <div id={this.props.id}>

            { /* Pas d'affichage pour 0 */ }
            { this.props.mensualite !== null && this.props.mensualite.periode !== 0 &&
                <Tooltip title={ this.getTooltip() }>
                    <Chip color={this.getBackground()} label={this.getLibelle()} size={"small"} />
                </Tooltip>
            }
        </div>
      )
    }
}