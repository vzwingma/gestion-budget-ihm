import React, { Component } from "react";
import { Form } from 'react-bootstrap';
import ComptesList from "./ComptesList.component"
/*
 * Page principale des budgets
 */
export default class Budgets extends Component {


    /** Etats pour la page Budget **/
      state = {
        infos: []
      }

    /** Appels WS vers pour charger la liste des comptes **/
    componentDidMount() {

    }








    render() { return (
        <div>
            <ComptesList />

            <Form.Label>Date</Form.Label>
      </div>
    ); }
}