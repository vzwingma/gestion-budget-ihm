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
            case 1:
                return "Mensuelle";
            case 3:
                return "Trimestrielle";
            case 6:
                return "Semestrielle";
            case 12:
                return "Annuelle";
            default:
                return null;
        }
    }

    /** Couleur du background du badge */
    getBackground(){
        switch (this.props.mensualite.periode) {
            case 1:
                return "light";
            case 3:
                return "info";
            case 6:
                return "warning";
            case 12:
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