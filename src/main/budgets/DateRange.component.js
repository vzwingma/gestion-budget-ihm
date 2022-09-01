import React, { Component } from "react";
import {Button, ButtonGroup, Modal, Pagination} from 'react-bootstrap'
import * as Controller from "./DateRange.controller"

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
            console.log("[TRIGGER] Context :: Compte=" + nextProps.idCompte )
            this.setState({idCompte : nextProps.idCompte})
            this.refreshDatesFromCompte(nextProps.idCompte)
            return true;
        }
        else if(this.state.dateCurrentBudget.getTime() !== nextStates.dateCurrentBudget.getTime()){
            console.log("[TRIGGER] Context :: date=" + nextStates.dateCurrentBudget )
            return true;
        }
        else if(this.state.showModale !== nextStates.showModale){
            return true
        }
        return false;
    }



/**
 *  RENDER
 */


    render() { return (
        <>
           <Pagination onClick={this.handleSelect} size={"sm"}>
             <Pagination.First id="firstButton"/>
             <Pagination.Item id="previous">{ this.state.datePreviousBudget.toLocaleString('default', { month: 'long' })} { this.state.datePreviousBudget.getFullYear()}  </Pagination.Item>
             <Pagination.Item id="current" active>{ this.state.dateCurrentBudget.toLocaleString('default', { month: 'long' })} { this.state.dateCurrentBudget.getFullYear() }</Pagination.Item>
             <Pagination.Item id="next">{ this.state.dateNextBudget.toLocaleString('default', { month: 'long' }) } { this.state.dateNextBudget.getFullYear() }</Pagination.Item>
             <Pagination.Last id="lastButton"/>
           </Pagination>

            <Modal show={this.state.showModale} onHide={this.hideModale} className="modal" centered >
                <Modal.Header closeButton>
                    <Modal.Title>Confirmation d'ouverture</Modal.Title>
                </Modal.Header>
                <Modal.Body><p>L'ouverture d'un nouveau mois, va clôturer le mois courant, et reporter toutes les opérations non réalisées</p><p>Voulez vous continuer ? </p></Modal.Body>

                <Modal.Footer>
                    <ButtonGroup onClick={this.handleModalClick}>
                        <Button action="ANNULER"    variant="secondary">Annuler</Button>
                        <Button action="CONFIRMER"  variant="success">Confirmer</Button>
                    </ButtonGroup>
                </Modal.Footer>
            </Modal>
        </>
    ); }
}

