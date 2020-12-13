import React, { Component } from "react";
import { Form } from 'react-bootstrap';
import ComptesList from "./ComptesList.component"
import DateRange from "./DateRange.component"
import * as AppConstants from "../Utils/AppEnums.constants"
import * as ClientHTTP from './../Services/ClientHTTP.service'

/*
 * Page principale des budgets
 */
export default class Budgets extends Component {


    /** Etats pour la page Budget **/
        state = {
            selectedCompte : null,
            selectedDate : null,
            currentBudget : null
        }

    /** Constructeur **/
    constructor(props){
        super(props);
        this.handleCompteChange = this.handleCompteChange.bind(this);
        this.handleDateChange = this.handleDateChange.bind(this);
        this.refreshBudget = this.refreshBudget.bind(this);
    }


    /** Notification lorsque le compte change **/
    handleCompteChange(selectedIdCompteFromComponent){
        console.log("Changement Id Compte=" + selectedIdCompteFromComponent)
        this.setState({ selectedCompte: selectedIdCompteFromComponent })
    }
    // Notification lorsque la date change
    handleDateChange(selectedDateFromComponent){
        console.log("Changement Date=" + selectedDateFromComponent)
        this.setState({ selectedDate : selectedDateFromComponent})
    }


    /** Appels WS vers pour charger la liste des opérations pour le mois et le budget **/
    // Mise à jour du contexte de budget
    shouldComponentUpdate(nextProps, nextStates){
        var componentUpdate = false;
        if(this.state.selectedCompte !== nextStates.selectedCompte){
            console.log("Update Context :: idCompte=" + nextStates.selectedCompte )
            componentUpdate = true;
        }
        else if(this.state.selectedDate != null & nextStates.selectedDate != null &&
            (this.state.selectedDate.getTime() !== nextStates.selectedDate.getTime()))
        {
            console.log("Update Context :: date=" + nextStates.selectedDate )
            componentUpdate = true;
        }
        if(componentUpdate){
            this.refreshBudget(nextStates.selectedCompte, nextStates.selectedDate );
        }
        return componentUpdate;
    }

    /**
        Refresh du budget
    **/
    refreshBudget(selectedCompte, selectedDate){
        if(selectedCompte != null && selectedDate != null){
            const getURL = ClientHTTP.getURL(AppConstants.BACKEND_ENUM.URL_OPERATIONS, AppConstants.SERVICES_URL.OPERATIONS.LIST,
                                [ selectedCompte, selectedDate.getFullYear(), selectedDate.getMonth()+1 ])
            fetch(getURL,
            {
                method: 'GET', headers: ClientHTTP.getHeaders()
            })
            .then(res => res.json())
            .then((data) => {
                console.log(data)
                this.setState({ currentBudget : data })
            })
            .catch((e) => {
                console.log("Erreur lors du chargement des budgets " + e)
            })
        }
    }








    render() { return (
        <div>
            <ComptesList onCompteChange={this.handleCompteChange} />
            <DateRange onDateChange={this.handleDateChange} idCompte={this.state.selectedCompte}/>
            <Form.Label>Date</Form.Label>
      </div>
    ); }
}