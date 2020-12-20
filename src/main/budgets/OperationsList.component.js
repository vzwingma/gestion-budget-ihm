import React, { Component } from "react";
import Table from 'react-bootstrap/Table'
import * as AppConstants from "../Utils/AppEnums.constants"
import * as ClientHTTP from './../Services/ClientHTTP.service'

/*
 * Liste des opérations
 */
export default class OperationsList extends Component {

    /** Etats pour Budget et opérations **/
        state = {
            currentBudget: null
        }

    /** Constructeur **/
    constructor(props){
        super(props);
    }

    // Mise à jour du contexte de budget
    shouldComponentUpdate(nextProps, nextStates){
        // Update si budget change dans le parent
        if(nextProps.currentBudget !== nextStates.currentBudget && nextProps.currentBudget != null){
            //console.log("Update Context !: Budget " + nextProps.currentBudget.id);
            this.setState({currentBudget : nextProps.currentBudget});
            return true;
        }
        return false;
    }


/**
 *  RENDER
     // {this.state.currentBudget.listOperations.map((budget) => ( ))}
 */

    render() { return (
        <div>
        <Table striped bordered hover variant="dark">
          <thead>
            <tr>
              <th>Jour opération</th>
              <th>Catégorie</th>
              <th>SS Catégorie</th>
              <th>Description</th>
              <th>Valeur</th>
              <th>Actions</th>
              <th>Date MàJ</th>
            </tr>
          </thead>
          <tbody>

                      <tr>
                        <td>1</td>
                        <td>Mark</td>
                        <td>Otto</td>
                        <td>mdo</td>
                        <td>Mark</td>
                                                <td>Otto</td>
                                                <td>mdo</td>
                      </tr>

          </tbody>
        </Table>
        </div>
    ); }

}