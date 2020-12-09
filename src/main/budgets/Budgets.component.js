import React, { Component } from "react";
import { Form } from 'react-bootstrap';
import * as AppConstants from "../Utils/AppEnums.constants"
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

        const httpClientConfig = { method: 'GET',
            headers:{'accept':'application/json', 'Authorization' : 'Bearer : eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ2endpbmdtYW5uIiwianRpIjoidnp3aW5nbWFubiIsIlVTRVJJRCI6IjU0ODQyNjgzODRiN2ZmMWU1ZjI2YjY5MiIsImlhdCI6MTU2ODU0MDMwNCwiZXhwIjoxNjY4NTQzOTA0fQ.uOI3MMQZWnD_a2QJcefFBCmoW7Wg0DzsIOaO267Me70AEHTT2YKpaJgCpQp06XKvu42BGacE-vvuDOVt7fD-sw'},
            cache: 'default' }

        fetch(AppConstants.BACKEND_ENUM.URL_COMPTES + AppConstants.SERVICES_URL.COMPTES.GET_ALL, httpClientConfig)
            .then(res => res.json())
            .then((data) => {
                console.log(data)
              //  this.setState({ infos: [...this.state.infos, data.app] })
            })
            .catch(() => {
                console.log("Erreur lors du chargement des comptes")
            })

    }








    render() { return (
        <div>
            <Form.Group controlId="exampleForm.ControlSelect1">
                <Form.Control as="select">
                    <option>1</option>
                </Form.Control>
            </Form.Group>

            <Form.Label>Date</Form.Label>
      </div>
    ); }
}