import React, {JSX} from "react";
import {Button, ButtonGroup} from "@mui/material";
import {handleSelect} from "./AnneeRange.controller";
import {AnneeRangeProps} from "../../Components.props";


/**
 * Date Range Select
 * @param selectedDate : date date sélectionnée
 * @param onAnneeChange : function sélection d'une date
 */
const AnneeRange = ({ selectedAnnee, onAnneeChange }: AnneeRangeProps) : JSX.Element => {

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
                    variant={"contained"}>{dateCurrent}</Button>
                <Button id="next"
                        size={"small"} disabled={dateNext > new Date().getFullYear()}>{dateNext}</Button>
            </ButtonGroup>
        </center>
    );
}

export default AnneeRange;
