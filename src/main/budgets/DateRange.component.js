import React, { Component } from "react";
import * as Controller from "./DateRange.controller"
import {
    Button,
    ButtonGroup,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle
} from "@mui/material";

/**
 * Date Range Select
 */
export default class DateRange extends Component {

    /**
     * Constructeur
     */
    constructor(props) {
        super(props);

        // Init date à maintenant
        let now = new Date(Date.now())
        this.state = {
            // Fenêtre modale
            showModale: false,
            datePremierBudget : null,
            dateDernierBudget : null,
            datePreviousBudget : new Date(now.getFullYear(), now.getMonth() - 1, 1, 0, 0, 0),
            dateCurrentBudget : new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0),
            dateNextBudget : new Date(now.getFullYear(), now.getMonth() + 1, 1, 0, 0, 0),
            idCompte : this.props.idCompte
        }
        this.refreshDatesFromCompte = Controller.refreshDatesFromCompte.bind(this);

        this.handleSelect = Controller.handleSelect.bind(this);
        this.confirmInitNextMonth = Controller.confirmInitNextMonth.bind(this);
        this.updateMonths = Controller.updateMonths.bind(this);
        this.intervalleLoaded = Controller.intervalleLoaded.bind(this);
        this.handleModalClick = Controller.handleModalClick.bind(this);
        this.hideModale = Controller.hideModale.bind(this);
    }

    // Mise à jour du contexte de budget
    shouldComponentUpdate(nextProps, nextStates, nextContext){
        // Update ssi c'est le compte qui change
        if(nextProps.idCompte !== nextStates.idCompte){
            // console.log("[TRIGGER] Context :: Compte=" + nextProps.idCompte )
            this.setState({idCompte : nextProps.idCompte})
            this.refreshDatesFromCompte(nextProps.idCompte)
            return true;
        }
        else if(this.state.dateCurrentBudget.getTime() !== nextStates.dateCurrentBudget.getTime()){
            // console.log("[TRIGGER] Context :: date=" + nextStates.dateCurrentBudget.toLocaleDateString() )
            this.refreshDatesFromCompte(nextProps.idCompte)
            return true;
        }
        else if(this.state.showModale !== nextStates.showModale){
            this.refreshDatesFromCompte(nextProps.idCompte)
            return true
        }
        return false;
    }



/**
 *  RENDER
 */


    render() { return (
        <center>
        <ButtonGroup onClick={this.handleSelect}>
            <Button id="firstButton" size={"small"}>{"<<"}</Button>
            <Button id="previous" size={"small"}>{ this.state.datePreviousBudget.toLocaleString('default', { month: 'long' })} { this.state.datePreviousBudget.getFullYear()}  </Button>
            <Button id="current" variant={"contained"}>{ this.state.dateCurrentBudget.toLocaleString('default', { month: 'long' })} { this.state.dateCurrentBudget.getFullYear() }</Button>
            <Button id="next"  size={"small"}>{ this.state.dateNextBudget.toLocaleString('default', { month: 'long' }) } { this.state.dateNextBudget.getFullYear() }</Button>
            <Button id="lastButton" size={"small"}>{">>"}</Button>
        </ButtonGroup>


            { /* Fenêtre modale de suppression */ }
            <Dialog open={this.state.showModale} >
                <DialogTitle>Confirmation d'ouverture</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description"><p>L'ouverture d'un nouveau mois, va clôturer le mois courant, et reporter toutes les opérations non réalisées</p><p>Voulez vous continuer ? </p></DialogContentText>
                </DialogContent>
                <DialogActions>
                    <ButtonGroup>
                        <Button id="ANNULER" onClick={this.handleModalClick} color="error" type="submit">Annuler</Button>
                        <Button id="CONFIRMER" color="success" onClick={this.handleModalClick} type="submit">Confirmer</Button>
                    </ButtonGroup>
                </DialogActions>
            </Dialog>

        </center>
    ); }
}

