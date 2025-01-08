import React from "react";
import {Button, ButtonGroup} from "@mui/material";
import {handleSelect} from "./AnneeRange.controller";
import {AnneeRangeProps} from "../../Components.props";


/**
 * Date Range Select
 * @param selectedDate : date date sélectionnée
 * @param onAnneeChange : function sélection d'une date
 */
const AnneeRange = ({ selectedAnnee, onAnneeChange }: AnneeRangeProps) : JSX.Element => {

    const fullView = selectedAnnee === 2000;
    if (fullView) {
        selectedAnnee = new Date().getFullYear();
    }
    const dateCurrent :number = selectedAnnee;
    const datePrevious : number = dateCurrent - 1;
    const dateNext : number = dateCurrent + 1;

    /**
     *  RENDER
     */
    return (
        <center>
            <ButtonGroup onClick={(e) => handleSelect(e, dateCurrent, onAnneeChange)}>
                <Button id="previous"
                    size={"small"}>{datePrevious}  </Button>
                <Button id="current"
                        variant={!fullView ? "contained" : "outlined"}>{dateCurrent}</Button>
                <Button id="next"
                        size={"small"} disabled={dateNext > new Date().getFullYear()}>{dateNext}</Button>
                <Button id="all"
                        size={"small"} variant={fullView ? "contained" : "outlined"}>Tout</Button>
            </ButtonGroup>
        </center>
    );
}

export default AnneeRange;
