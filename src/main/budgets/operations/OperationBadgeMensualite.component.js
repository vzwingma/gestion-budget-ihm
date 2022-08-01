import React, { Component } from "react";
import Badge from 'react-bootstrap/Badge';
import {OverlayTrigger, Tooltip} from "react-bootstrap";

export default class OperationMensualite extends Component {


    /** Tooltip */
    getTooltip(){
        return "Prochaine mensualité : " + this.props.prochaineMensualite;
    }

    /** Libellé du badge */
    getLibelle(){
        if(this.props.periodeMensualite === 1){
            return "Mensuelle"
        }
        else if(this.props.periodeMensualite === 3){
            return "Trimestrielle"
        }
        else if(this.props.periodeMensualite === 6){
            return "Semestrielle"
        }
        else if(this.props.periodeMensualite === 12){
            return "Annuelle"
        }
    }

    /** Couleur du background du badge */
    getBackground(){
        if(this.props.periodeMensualite === 1){
            return "light"
        }
        else if(this.props.periodeMensualite === 3){
            return "info"
        }
        else if(this.props.periodeMensualite === 6){
            return "warning"
        }
        else if(this.props.periodeMensualite === 12){
            return "danger"
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
            { this.props.periodeMensualite !== 0 &&
                <><OverlayTrigger overlay={ <Tooltip>{ this.getTooltip() }</Tooltip> }>
                    <Badge bg={this.getBackground()}>{this.getLibelle()}</Badge>
                </OverlayTrigger></>
            }
        </div>
      )
    }
}