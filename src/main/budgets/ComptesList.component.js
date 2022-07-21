import React, { Component } from "react";
import { Form } from 'react-bootstrap';
import * as Controller from './ComptesList.controller';
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
        this.handleSelect   = Controller.handleSelect.bind(this);
        this.loadComptes    = Controller.loadComptes.bind(this);
        this.comptesLoaded  = Controller.comptesLoaded.bind(this);
    }

    /** Appels WS vers pour charger la liste des comptes **/
    componentDidMount() {
        this.loadComptes();
    }




/**
 *  RENDER
 */

    render() { return (
        <div>
            <Form.Group controlId="CompteForm.CompteSelect">
                <Form.Control as="select" size="sm" onChange={this.handleSelect}>
                    { this.state.comptes
                                .map(compte => ( <option key={compte.id} id={compte.id}>{compte.libelle}</option> ))}
                </Form.Control>
            </Form.Group>
      </div>
    ); }
}
