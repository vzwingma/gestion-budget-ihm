import React, { Component } from "react";
import { Form } from 'react-bootstrap';
import ComptesList from "./ComptesList.component"
import DateRange from "./DateRange.component"
/*
 * Page principale des budgets
 */
export default class Budgets extends Component {


    /** Etats pour la page Budget **/
        state = {
            selectedCompte : null,
            selectedDate : null,
        }

    /** Constructeur **/
    constructor(props){
        super(props);
        this.handleCompteChange = this.handleCompteChange.bind(this);
        this.handleDateChange = this.handleDateChange.bind(this);
    }


    /** Notification lorsque le compte change **/
    handleCompteChange(selectedIdCompteFromComponent){
        console.log("Changement Id Compte=" + selectedIdCompteFromComponent)
        this.setState({ selectedCompte: selectedIdCompteFromComponent })
        // this.props.selectedCompte = selectedIdCompteFromComponent;
    }
    // Notification lors de la date change
    handleDateChange(selectedDateFromComponent){
        console.log("Changement Date=" + selectedDateFromComponent)
        this.setState({ selectedDate : selectedDateFromComponent})
    }

    /** Appels WS vers pour charger la liste des comptes **/
    componentDidMount() {

    }








    render() { return (
        <div>
            <ComptesList onCompteChange={this.handleCompteChange} />
            <DateRange onDateChange={this.handleDateChange} idCompte={this.state.selectedCompte}/>
            <Form.Label>Date</Form.Label>
      </div>
    ); }
}