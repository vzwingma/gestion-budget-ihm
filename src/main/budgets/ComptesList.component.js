import React, { Component } from "react";
import { Form } from 'react-bootstrap';
import * as AppConstants from "../Utils/AppEnums.constants";
import * as ClientHTTP from './../Services/ClientHTTP.service';
/*
 * Composant Select Comptes
 */
export default class ComptesList extends Component {


    /** Etats pour la sélection du compte **/
      state = {
        comptes: []
      }

    constructor(props) {
        super(props);
        this.handleSelect = this.handleSelect.bind(this);
    }

    /** Appels WS vers pour charger la liste des comptes **/
    componentDidMount() {
        const getURL = ClientHTTP.getURLRequest(AppConstants.BACKEND_ENUM.URL_COMPTES, AppConstants.SERVICES_URL.COMPTES.GET_ALL)
        fetch(getURL,
            {
                method: 'GET', headers: ClientHTTP.getHeaders()
            })
            .then(res => ClientHTTP.getJSONResponse(res))
            .then((data) => {
                this.comptesLoaded(data)
            })
            .catch((e) => {
                console.log("Erreur lors du chargement des comptes " + e)
            })
    }

    // Chargement des comptes et tri suivant l'ordre
    comptesLoaded(data){
        console.log("Chargement de " + data.length + " comptes");
        // console.log(data);
        data.sort((c1, c2) => (c1.ordre > c2.ordre) ? 1 : -1);
        this.setState({ comptes: data });
        this.props.onCompteChange(data[0].id);
    }

    // Sélection d'un compte
    handleSelect(event) {
        // Select du compte parmi la liste
        const compteLabel =event.target.value;
        console.log("Changement de compte : " + compteLabel)
        var selectedIdCompte = null;
        Array.from(event.target.options)
             .forEach(function (option) {
                if(option.value === compteLabel){
                    selectedIdCompte = option.id;
                }
             })
        // Compte sélectionné, remonté à budget
        this.props.onCompteChange(selectedIdCompte);
    }




/**
 *  RENDER
 */

    render() { return (
        <div>
            <Form.Group controlId="CompteForm.CompteSelect">
                <Form.Control as="select" size="sm" onChange={this.handleSelect}>
                    { this.state.comptes.map((compte, key) => ( <option key={key} id={compte.id}> {compte.libelle}</option> ))}
                </Form.Control>
            </Form.Group>
      </div>
    ); }
}
