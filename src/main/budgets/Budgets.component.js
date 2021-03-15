import React, { Component } from "react";
import ComptesList from "./ComptesList.component"
import DateRange from "./DateRange.component"
import OperationsList from "./OperationsList.component"

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
            currentBudget: null
        }

    /** Constructeur **/
    constructor(props){
        super(props);
        this.handleCompteChange = this.handleCompteChange.bind(this);
        this.handleDateChange = this.handleDateChange.bind(this);
        this.handleBudgetUpdate = this.handleBudgetUpdate.bind(this);
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
    // Notification lorsque le budget est mis à jour
    handleBudgetUpdate(budgetUpdated){
        console.log("Budget mis à jour")
        this.setState({ currentBudget : budgetUpdated })
    }

    /** Appels WS vers pour charger la liste des opérations pour le mois et le budget **/
    // Mise à jour du contexte de budget
    shouldComponentUpdate(nextProps, nextStates){
        var componentUpdate = false;
        var budgetUpdate = false;
        if(this.state.selectedCompte !== nextStates.selectedCompte){
            console.log("Update Context :: idCompte=" + nextStates.selectedCompte )
            componentUpdate = true;
            budgetUpdate = true;
        }
        else if(this.state.selectedDate != null & nextStates.selectedDate != null &&
            (this.state.selectedDate.getTime() !== nextStates.selectedDate.getTime()))
        {
            console.log("Update Context :: date=" + nextStates.selectedDate )
            componentUpdate = true;
            budgetUpdate = true;
        }
        else if(this.state.currentBudget !== nextStates.currentBudget){
            console.log("Update Context :: budget=" + nextStates.currentBudget.id )
            componentUpdate = true;
            budgetUpdate = false;
        }
        if(budgetUpdate){
            this.refreshBudget(nextStates.selectedCompte, nextStates.selectedDate );
        }
        return componentUpdate;
    }

    /**
        Refresh du budget
    **/
    refreshBudget(selectedCompte, selectedDate){
        if(selectedCompte != null && selectedDate != null){
            const getURL = ClientHTTP.getURL(AppConstants.BACKEND_ENUM.URL_OPERATIONS, AppConstants.SERVICES_URL.BUDGETS.GET,
                                [ selectedCompte, selectedDate.getFullYear(), selectedDate.getMonth()+1 ])
            fetch(getURL,
            {
                method: 'GET', headers: ClientHTTP.getHeaders()
            })
            .then(res => res.json())
            .then((data) => {
                this.setState({ currentBudget : data })
            })
            .catch((e) => {
                console.log("Erreur lors du chargement du budget " + selectedCompte + " du " + selectedDate + " >> "+ e)
            })
        }
    }








    render() { return (
        <div>
            <ComptesList onCompteChange={this.handleCompteChange} />
            <DateRange onDateChange={this.handleDateChange} idCompte={this.state.selectedCompte}/>
            <OperationsList onBudgetChange={this.handleBudgetUpdate} currentBudget={this.state.currentBudget}/>
      </div>
    ); }
}