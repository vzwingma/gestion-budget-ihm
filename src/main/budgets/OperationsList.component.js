import React, { Component } from "react";
import Table from 'react-bootstrap/Table';
import OperationActions from "./OperationActions.component"
/*
 * Liste des opérations
 */
export default class OperationsList extends Component {

    /** Etats pour Budget et opérations **/
        state = {
            currentBudget: null,
            listeOperations: []
        }

    /** Constructeur **/
    constructor(props){
        super(props);

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

    render() { return (
        <div>
        <Table striped bordered hover variant="dark">
          <thead>
            <tr>
              <th>Jour opération</th>
              <th colspan="2">Catégorie</th>
              <th>Description</th>
              <th>Valeur</th>
              <th>Actions</th>
              <th>Date MàJ</th>
            </tr>
          </thead>
          <tbody>
          { this.state.listeOperations.map((operation, key) => (
                <tr>
                    <td>{
                        operation.autresInfos.dateOperation != null ?
                        operation.autresInfos.dateOperation[2]+"/"+operation.autresInfos.dateOperation[1] +"/"+ operation.autresInfos.dateOperation[0]
                        : "-"
                     }</td>
                    <td>{operation.categorie.libelle}</td>
                    <td>{operation.ssCategorie.libelle}</td>
                    <td>{operation.libelle}</td>
                    <td>{operation.valeur} €</td>
                    <td><OperationActions key={key} id={operation.id} etat={operation.etat}/></td>
                    <td>{
                        operation.autresInfos.dateMaj != null ?
                        operation.autresInfos.dateMaj[2]+"/"+operation.autresInfos.dateMaj[1] +"/"+ operation.autresInfos.dateMaj[0]
                        : "-"
                        }</td>
                </tr>
          ))}
          </tbody>
        </Table>
        </div>
    ); }

}