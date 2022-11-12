import React, { Component } from "react";
import {Chip, Tooltip} from '@mui/material';

import {getLibelle, getBackground} from "../../../Utils/DataUtils.utils";

export default class OperationMensualite extends Component {


    /** Tooltip */
    getTooltip(){
            return "Prochaine échéance dans " + this.props.mensualite.prochaineEcheance + " mois";
    }


    // Render de l'état de l'opération avec surcharge du style du bouton
    render(){
      return (
        <div id={this.props.id}>

            { /* Pas d'affichage pour 0 */ }
            { this.props.mensualite !== null && this.props.mensualite.periode !== 0 &&
                <Tooltip title={ this.getTooltip() }>
                    <Chip color={getBackground(this.props.mensualite.periode)} label={getLibelle(this.props.mensualite.periode)} size={"small"} />
                </Tooltip>
            }
        </div>
      )
    }
}