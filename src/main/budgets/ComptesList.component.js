import React, { Component } from "react";
import { Form } from 'react-bootstrap';
import * as AppConstants from "../Utils/AppEnums.constants"
import { getHTTPHeaders } from './../Services/Auth.service'

/*
 * Composant Select Comptes
 */
export default class ComptesList extends Component {


    /** Etats pour la sélection des budgets **/
      state = {
        comptes: []
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
            <Form.Group controlId="exampleForm.ControlSelect1">
                <Form.Control as="select">
                    { this.state.comptes.map((compte, key) => ( <option key={key} id={compte.id}>{compte.libelle}</option> ))}
                </Form.Control>
            </Form.Group>

      </div>
    ); }
}
