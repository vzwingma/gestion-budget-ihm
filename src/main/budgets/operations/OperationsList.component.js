import React, { Component } from "react";
import Table from 'react-bootstrap/Table';
import OperationActions from './OperationActions.component'
import OperationEtat from './OperationEtat.component'
import OperationValue from './OperationValue.component'
import * as DataUtils from '../../Utils/DataUtils.utils'

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
        this.handleOperationsListUpdate = this.handleOperationsListUpdate.bind(this)
    }

    // Update du budget, suite à une action sur une opération
    handleOperationsListUpdate(budgetUpdated){
        console.log("[TRIGGER] Refresh budget [" + budgetUpdated.id+ "]")
        this.props.onOperationChange(budgetUpdated);
    }


    // Mise à jour du contexte de budget
    shouldComponentUpdate(nextProps, nextStates){
        // Update si budget change dans le parent
        if(nextProps.currentBudget !== nextStates.currentBudget && nextProps.currentBudget != null){
            console.log("[TRIGGER] Context operations [" + nextProps.currentBudget.listeOperations.length + "]");
            this.setState(
                {
                    currentBudget : nextProps.currentBudget,
                    listeOperations : nextProps.currentBudget.listeOperations
                }
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
                <tbody className="tbodyOperation">
                { this.state.listeOperations.map((operation) => (

                    <tr key={operation.id} id={operation.id}>
                        <td>{ DataUtils.getLibelleDate(operation.autresInfos.dateOperation) }</td>
                        <td>{ operation.categorie != null ? operation.categorie.libelle : "-" }</td>
                        <td>{ operation.ssCategorie != null ? operation.ssCategorie.libelle : "-" }</td>
                        <td>{operation.libelle}</td>
                        <td><OperationValue valueOperation={operation.valeur} /></td>
                        <td><OperationEtat key={operation.id} id={operation.id} operation={operation} /></td>
                        <td><OperationActions key={operation.id} id={operation.id}
                                              operation={operation} budgetid={this.props.currentBudget.id}
                                              onOperationChange={this.handleOperationsListUpdate} /></td>
                        <td>{ DataUtils.getLibelleDate(operation.autresInfos.dateMaj) }</td>
                    </tr>
                ))}
                </tbody>
            </Table>
        ); }

}