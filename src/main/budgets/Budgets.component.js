import React, { Component } from "react";
import { Container, Row, Col } from 'react-bootstrap'

import ComptesList from "./ComptesList.component"
import DateRange from "./DateRange.component"
import OperationsList from "./operations/OperationsList.component"

import ResumeSoldes from "./resume/ResumeSoldes.component"
import ResumeCategories from "./resume/categories/ResumeCategories.component"

import CreationActionButton from "./creation/CreationActionButton.component"

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
            currentBudget: null,
            categories: null
        }

    /** Constructeur **/
    constructor(props){
        super(props);
        this.handleCompteChange = this.handleCompteChange.bind(this);
        this.handleDateChange = this.handleDateChange.bind(this);
        this.handleBudgetUpdate = this.handleBudgetUpdate.bind(this);
        this.refreshBudget = this.refreshBudget.bind(this);
    }


    /** Chargement des catégories **/
    componentDidMount(){
        console.log("Chargement des catégories");
        const getURL = ClientHTTP.getURL(AppConstants.BACKEND_ENUM.URL_PARAMS, AppConstants.SERVICES_URL.PARAMETRES.CATEGORIES)
                    fetch(getURL,
                    {
                        method: 'GET', headers: ClientHTTP.getHeaders()
                    })
                    .then(res => res.json())
                    .then((data) => {
                        this.setState({ categories : data })
                    })
                    .catch((e) => {
                        console.log("Erreur lors du chargement des catégories >> "+ e)
                    })
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
        else if(this.state.selectedDate != null && nextStates.selectedDate != null &&
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

    /**
     * Render du budget
     */
    render() { return (
        <Container fluid>
          <Row>
            <Col sm={4}>
              <ComptesList onCompteChange={this.handleCompteChange} />
            </Col>
            <Col sm={8}>
              <DateRange onDateChange={this.handleDateChange} idCompte={this.state.selectedCompte}/>
            </Col>
          </Row>
          <Row>
            <Col sm={4}>
                <Container fluid>
                    <Row>
                        <Col fluid>
                        {
                            this.state.currentBudget != null ? <ResumeCategories currentBudget={this.state.currentBudget} categories={this.state.categories} />: "Chargement..."
                        }
                        </Col>
                    </Row>
                    <Row>
                        <Col fluid>
                        {
                            this.state.currentBudget != null ? <ResumeSoldes currentBudget={this.state.currentBudget} /> : "Chargement..."
                        }
                        </Col>
                    </Row>
                </Container>
            </Col>
            <Col sm={8}>
                <Container fluid>
                    <Row>{
                        this.state.currentBudget != null ? <OperationsList onBudgetChange={this.handleBudgetUpdate} currentBudget={this.state.currentBudget} />: "Chargement..."
                    }</Row>
                    <Row className="alignCenter">
                        <CreationActionButton categories={this.state.categories} />
                    </Row>
                </Container>
            </Col>
          </Row>

        </Container>
    ); }
}