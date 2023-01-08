import React, { Component } from "react";
import {Chip, Tooltip} from '@mui/material';

import {getLibellePeriode, getBackgroundColorForPeriode} from "../../../Utils/DataUtils.utils";

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
            { this.props.mensualite !== null && this.props.mensualite.periode !== 0 && this.props.mensualite.periode !== "PONCTUELLE" &&
                <Tooltip title={ this.getTooltip() }>
                    <Chip color={getBackgroundColorForPeriode(this.props.mensualite.periode)} label={getLibellePeriode(this.props.mensualite.periode)}
                          size={"small"} style={{width: "100 px"}} className={"chipMensualite"} />
                </Tooltip>
            }
        </div>
      )
    }
}