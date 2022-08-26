import React, { Component } from "react";
import Badge from 'react-bootstrap/Badge';
import {OverlayTrigger, Tooltip} from "react-bootstrap";

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
                return null;
        }
    }

    /** Couleur du background du badge */
    getBackground(){
        switch (this.props.mensualite.periode) {
            case "MENSUELLE":
                return "light";
            case "TRIMESTRIELLE":
                return "info";
            case "SEMESTRIELLE":
                return "warning";
            case "ANNUELLE":
                return "danger";
            default:
                return null;
        }
    }

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
            { /* Pas d'affichage pour 0 */ }
            { this.props.mensualite !== null && this.props.mensualite.periode !== 0 &&
                <><OverlayTrigger overlay={ <Tooltip>{ this.getTooltip() }</Tooltip> }>
                    <Badge bg={this.getBackground()}>{this.getLibelle()}</Badge>
                </OverlayTrigger></>
            }
        </div>
      )
    }
}