import React, { Component } from "react";
import { Form } from 'react-bootstrap';
import * as AppConstants from "../Utils/AppEnums.constants"
import { getHTTPHeaders } from './../Services/Auth.service'

/*
 * Date Range Select
 */
export default class DateRange extends Component {



    /** Etats pour la sélection des budgets **/
      state = {
        date: []
      }


    /** Appels WS vers pour charger la liste des comptes **/
    componentDidMount() {

        fetch(AppConstants.BACKEND_ENUM.URL_COMPTES + AppConstants.SERVICES_URL.COMPTES.GET_ALL,
            {
                method: 'GET', headers: getHTTPHeaders()
            })
            .then(res => res.json())
            .then((data) => {
                this.comptesLoaded(data)
            })
            .catch(() => {
                console.log("Erreur lors du chargement des comptes")
            })
    }

    // Chargement des comptes et tri suivant l'ordre
    comptesLoaded(data){
        console.log("Chargement de " + data.length + " comptes")
        console.log(data)
        data.sort((c1, c2) => (c1.ordre > c2.ordre) ? 1 : -1)
        this.setState({ comptes: data })
    //    this.state.comptes.forEach((item) => console.log(" - " + item.libelle) );
    }



/**
 *  RENDER
 */

    render() { return (
        <div>
           <Form>
                <Form.Group controlId="dateRange">
                    <Form.Label>Range</Form.Label>
                    <Form.Control type="range" custom />
                </Form.Group>
            </Form>
      </div>
    ); }
}
