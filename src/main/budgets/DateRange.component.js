import React, { Component } from "react";
import Pagination from 'react-bootstrap/Pagination'
import * as AppConstants from "../Utils/AppEnums.constants"
import { getHTTPHeaders } from './../Services/Auth.service'

/*
 * Date Range Select
 */
export default class DateRange extends Component {



    /** Etats pour la sélection du mois courant **/
      state = {
        selectedDate : null
      }
    constructor(props) {
        super(props);
        this.handleSelect = this.handleSelect.bind(this);
    }

    // Sélection d'un mois
    handleSelect(event) {
       console.log(event)
    }

    /** Appels WS vers pour charger la liste des comptes **/
    componentDidMount() {

    }



/**
 *  RENDER
 */


    render() { return (
    <div>
   <Pagination>
     <Pagination.First />
     <Pagination.Prev />
     <Pagination.Item>Novembre</Pagination.Item>
     <Pagination.Item active>Décembre</Pagination.Item>
     <Pagination.Item>Janvier</Pagination.Item>
     <Pagination.Next />
     <Pagination.Last disabled/>
   </Pagination>
    </div>
    ); }
}
