import React, { Component } from "react";
import { Container, Row, Col } from 'react-bootstrap'

import ComptesList from "./ComptesList.component"
import DateRange from "./DateRange.component"
import OperationsList from "./operations/OperationsList.component"

import ResumeSoldes from "./resume/ResumeSoldes.component"
import ResumeCategories from "./resume/categories/ResumeCategories.component"
import CreateOperationActionForm from "./creation/CreateOperationActionForm.component"
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
        ClientHTTP.call('GET', AppConstants.BACKEND_ENUM.URL_PARAMS, AppConstants.SERVICES_URL.PARAMETRES.CATEGORIES)
                    .then(data => {
                        this.categoriesLoaded(data)
                    })
                    .catch((e) => {
                        console.log("Erreur lors du chargement des catégories >> "+ e)
                    })
    }

    /** Chargement des catégories **/
    categoriesLoaded(data) {
        console.log("Chargement de " + data.length + " catégories");
        this.setState({ categories : data })
    }

    /** Notification lorsque le compte change **/
    handleCompteChange(selectedIdCompteFromComponent){
     //   console.log("[SELECT] Compte=" + selectedIdCompteFromComponent)
        this.setState({ selectedCompte: selectedIdCompteFromComponent })
    }
    // Notification lorsque la date change
    handleDateChange(selectedDateFromComponent){
     //   console.log("[SELECT] Date=" + selectedDateFromComponent)
        this.setState({ selectedDate : selectedDateFromComponent})
    }
    // Notification lorsque le budget est mis à jour
    handleBudgetUpdate(budgetData){
        console.log("(Re)Chargement du budget [" + budgetData.id + "] : " + budgetData.listeOperations.length +  " opérations")
        this.setState({ currentBudget : budgetData })
    }

    /** Appels WS vers pour charger la liste des opérations pour le mois et le budget **/
    // Mise à jour du contexte de budget
    shouldComponentUpdate(nextProps, nextStates){
        let componentUpdate = false;
        let budgetUpdate = false;
        if(this.state.selectedCompte !== nextStates.selectedCompte){
            console.log("[TRIGGER] Context compte=" + nextStates.selectedCompte )
            componentUpdate = true;
            budgetUpdate = true;
        }
        else if(this.state.selectedDate != null && nextStates.selectedDate != null &&
            (this.state.selectedDate.getTime() !== nextStates.selectedDate.getTime()))
        {
            console.log("[TRIGGER] Context date=" + nextStates.selectedDate )
            componentUpdate = true;
            budgetUpdate = true;
        }
        else if(this.state.currentBudget !== nextStates.currentBudget){
            console.log("[TRIGGER] Context budget=" + nextStates.currentBudget.id )
            componentUpdate = true;
            budgetUpdate = false;
        }
        if(budgetUpdate){
            console.log("[TRIGGER] Update budget")
            this.refreshBudget(nextStates.selectedCompte, nextStates.selectedDate );
        }
        return componentUpdate;
    }

    /**
        Refresh du budget
    **/
    refreshBudget(selectedCompte, selectedDate){
        if(selectedCompte != null && selectedDate != null){
            ClientHTTP.call('GET',
                            AppConstants.BACKEND_ENUM.URL_OPERATIONS, AppConstants.SERVICES_URL.BUDGETS.GET,
                            [ selectedCompte, selectedDate.getFullYear(), selectedDate.getMonth()+1 ])
                    .then(data => this.handleBudgetUpdate(data))
                    .catch(e => console.log("Erreur lors du chargement du budget " + selectedCompte + " du " + selectedDate + " >> "+ e))
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
                <Container fluid={"xl"}>
                    <Row>
                        <Col>{
                            this.state.currentBudget != null ? <ResumeCategories currentBudget={this.state.currentBudget} categories={this.state.categories} />: "Chargement..."
                        }</Col>
                    </Row>
                    <Row>
                        <Col>{
                            this.state.currentBudget != null ? <ResumeSoldes currentBudget={this.state.currentBudget} /> : "Chargement..."
                        }</Col>
                    </Row>
                </Container>
            </Col>
            <Col sm={8}>
                <Container fluid={"xl"}>
                    <Row>{
                        this.state.currentBudget != null ? <OperationsList onOperationChange={this.handleBudgetUpdate} currentBudget={this.state.currentBudget} />: "Chargement..."
                    }</Row>
                    <Row className="alignCenter">
                        <CreateOperationActionForm idCompte={this.state.selectedCompte} />
                    </Row>
                </Container>
            </Col>
          </Row>

        </Container>
    ); }
}