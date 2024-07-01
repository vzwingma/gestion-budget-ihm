import React, {Component} from "react";
import * as Controller from "./AnneeRange.controller"
import {Button, ButtonGroup} from "@mui/material";
import PropTypes from "prop-types";

/**
 * Date Range Select
 * @param selectedDate : date date sélectionnée
 * @param onDateChange : function sélection d'une date
 */
export default class AnneeRange extends Component {

    /**
     * Constructeur
     */
    constructor(props) {
        super(props);

        // Init date à maintenant
        let selectedAnnee = this.props.selectedAnnee
        this.state = {
            datePrevious: selectedAnnee - 1,
            dateCurrent: selectedAnnee,
            dateNext: selectedAnnee + 1
        }
        this.handleSelect = Controller.handleSelect.bind(this);
    }

    /**
     *  Mise à jour du contexte de budget
     * @param nextProps next properties
     * @param nextStates next states
     * @param nextContext next Context
     * @returns {boolean} s'il faut refresh ou pas
     */
    shouldComponentUpdate(nextProps, nextStates, nextContext) {
        return this.state.dateCurrent !== nextStates.dateCurrent
    }


    /**
     *  RENDER
     */


    render() {
        return (
            <center>
                <ButtonGroup onClick={this.handleSelect}>
                    <Button id="previous"
                            size={"small"}>{this.state.datePrevious}  </Button>
                    <Button id="current"
                            variant={"contained"}>{this.state.dateCurrent}</Button>
                    <Button id="next"
                            size={"small"}>{this.state.dateNext}</Button>
                </ButtonGroup>
            </center>
        );
    }
}
AnneeRange.propTypes = {
    selectedAnnee: PropTypes.number.isRequired,
    onAnneeChange: PropTypes.func.isRequired
}
