import React, { Component } from "react";
import Table from 'react-bootstrap/Table';
import OperationActions from "./OperationActions.component"
import OperationEtat from "./OperationEtat.component"
/*
 * Liste des opérations
 */
export default class OperationsList extends Component {

    /** Etats pour Budget et opérations **/
        state = {
            currentBudget: null,
            listeOperations: []
        }

    constructor(props){
        super(props)
        this.handleBudgetUpdate = this.handleBudgetUpdate.bind(this)
    }

    // Update du budget
    handleBudgetUpdate(budgetUpdated){
        this.props.onBudgetChange(budgetUpdated);
    }


    // Mise à jour du contexte de budget
    shouldComponentUpdate(nextProps, nextStates){
        // Update si budget change dans le parent
        if(nextProps.currentBudget !== nextStates.currentBudget && nextProps.currentBudget != null){
            console.log("Update Context :: Budget " + nextProps.currentBudget.id + "  [" + nextProps.currentBudget.listeOperations.length + "] opérations");
            this.setState(
                {   currentBudget : nextProps.currentBudget,
                    listeOperations : nextProps.currentBudget.listeOperations }
            );
        }
        return true;
    }

/**
 *  RENDER
     //
 */

    render() {

        return (
            <Table striped bordered hover size="sm" variant="light">
              <thead>
                <tr>
                  <th scope="col">Jour opération</th>
                  <th scope="col" colSpan="2">Catégorie</th>
                  <th scope="col">Description</th>
                  <th scope="col">Valeur</th>
                  <th scope="col">Etat</th>
                  <th scope="col">Actions</th>
                  <th scope="col">Mise à Jour</th>
                </tr>
              </thead>
              <tbody>
              { this.state.listeOperations.map((operation, key) => (

                    <tr key={key} id={operation.id}>
                        <td>{
                            operation.autresInfos.dateOperation != null ?
                            operation.autresInfos.dateOperation[2]+"/"+operation.autresInfos.dateOperation[1] +"/"+ operation.autresInfos.dateOperation[0]
                            : "-"
                         }</td>
                        <td>{operation.categorie.libelle}</td>
                        <td>{operation.ssCategorie.libelle}</td>
                        <td>{operation.libelle}</td>
                        <td>{
                            operation.valeur > 0 ? <span class="text-success">{operation.valeur} €</span> : <span class="text-danger">{operation.valeur} €</span>
                            }
                        </td>
                        <td><OperationEtat key={operation.id} id={operation.id} operation={operation} /></td>
                        <td><OperationActions key={operation.id} id={operation.id}
                                              operation={operation} budgetid={this.props.currentBudget.id}
                                              onBudgetChange={this.handleBudgetUpdate} /></td>
                        <td>{
                            operation.autresInfos.dateMaj != null ?
                            operation.autresInfos.dateMaj[2]+"/"+operation.autresInfos.dateMaj[1] +"/"+ operation.autresInfos.dateMaj[0]
                            : "-"
                            }</td>
                    </tr>
              ))}
              </tbody>
            </Table>
    ); }

}