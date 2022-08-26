import React, { Component } from "react";
import {Row, Col, Navbar} from 'react-bootstrap'

import ComptesList from "../ComptesList.component"
import DateRange from "../DateRange.component"
import OperationsList from "../operations/OperationsTableList.component"

import ResumeSoldes from "../resume/ResumeSoldes.component"
import ResumeCategories from "../resume/categories/ResumeCategories.component"
import BudgetActionsButtonGroupComponent from "./actions/BudgetActionsButtonGroup.component";
import CreateOperationButton from "../operations/creation/CreateOperationButton.component";
import * as Controller from './Budgets.controller'
import * as Services from './Budgets.extservices'

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
        this.handleCompteChange = Controller.handleCompteChange.bind(this);
        this.handleDateChange = Controller.handleDateChange.bind(this);
        this.handleBudgetUpdate = Controller.handleBudgetUpdate.bind(this);

        this.refreshBudget = Services.reloadBudget.bind(this);
        this.loadCategories = Services.loadCategories.bind(this);
        this.categoriesLoaded = Services.categoriesLoaded.bind(this);
    }


    /** Chargement des catégories **/
    componentDidMount(){
        this.loadCategories();
    }


    /** Appels WS vers pour charger la liste des opérations pour le mois et le budget **/
    // Mise à jour du contexte de budget
    shouldComponentUpdate(nextProps, nextStates){
        let componentUpdate = false;
        let budgetUpdate;
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
     * Render du budget
     */
    render() { return (
        <>
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
                    { /** Résumé des catégories **/ }
                    <Row>
                        <Col>{ this.state.currentBudget != null ? <ResumeCategories currentBudget={this.state.currentBudget} categories={this.state.categories} />: "Chargement..." }</Col>
                    </Row>
                    { /** Soldes **/ }
                    <Row>
                        <Col>{ this.state.currentBudget != null ? <ResumeSoldes currentBudget={this.state.currentBudget} /> : "Chargement..." }</Col>
                    </Row>
                </Col>
                <Col sm={8}>
                    { /** Liste des opérations **/ }
                    <Row>{ this.state.currentBudget != null ?<OperationsList onOperationChange={this.handleBudgetUpdate} budget={this.state.currentBudget} />: "Chargement..."}</Row>
                </Col>
            </Row>

            <Navbar fixed="bottom" bg="dark" variant="dark" className="justify-content-end">
                { /** Création d'une nouvelle opération **/
                    this.state.currentBudget != null ?
                        <CreateOperationButton idCompte={this.state.selectedCompte} budget={this.state.currentBudget} onOperationChange={this.handleBudgetUpdate}/> : "Chargement...."
                }
                {/** Actions sur le budget (close / reinit) **/
                    this.state.currentBudget != null ?
                        <BudgetActionsButtonGroupComponent budget={this.state.currentBudget} onActionBudgetChange={this.handleBudgetUpdate}/> : "Chargement...."
                }
            </Navbar>
        </>
    ); }
}