import React, { Component } from "react";
import Pagination from 'react-bootstrap/Pagination'
import * as AppConstants from "../Utils/AppEnums.constants"
import * as ClientHTTP from './../Services/ClientHTTP.service'

/*
 * Date Range Select
 */
export default class DateRange extends Component {

    state = {
        datePremierBudget : null,
        dateDernierBudget : null,
        idCompte : null
    }

    // Constructeur
    constructor(props) {
        super(props);
        this.handleSelect = this.handleSelect.bind(this);
        this.refreshDatesFromCompte = this.refreshDatesFromCompte.bind(this);
        this.intervalleLoaded = this.intervalleLoaded.bind(this);
    }

    // Sélection d'un mois à partir du composant
    handleSelect(event) {
       console.log(event)
    }

    // Mise à jour du contexte de budget
    shouldComponentUpdate(nextProps, nextStates){
        // Update ssi c'est le compte qui change
        if(nextProps.idCompte === nextStates.idCompte){
            return false;
        }
        else{
            console.log("Update Context :: idCompte=" + nextProps.idCompte )
            this.setState({idCompte : nextProps.idCompte})
            this.refreshDatesFromCompte(nextProps.idCompte)
            return true;
        }
    }

    /** Appels WS vers pour charger la liste des comptes **/
    refreshDatesFromCompte(idCompte) {

        const replaceInURL = ClientHTTP.getURL(AppConstants.BACKEND_ENUM.URL_OPERATIONS, AppConstants.SERVICES_URL.BUDGETS.INTERVALLE,  idCompte)
        fetch(replaceInURL,
            {
                method: 'GET', headers: ClientHTTP.getHeaders()
            })
            .then(res => res.json())
            .then((data) => {
                console.log(data)
                this.intervalleLoaded(data.datePremierBudget, data.dateDernierBudget)
            })
            .catch(() => {
                console.log("Erreur lors du chargement de l'intervalle des budgets")
            })
    }

    // Chargement de l'intervalle de compte
    intervalleLoaded(datePremierBudget, dateDernierBudget) {
        console.log("Budget disponible : du  " + datePremierBudget + " au " + dateDernierBudget);
        // console.log(data);
        this.setState({ datePremierBudget: datePremierBudget, dateDernierBudget : dateDernierBudget });
        //this.props.onCompteChange(data[0].id);
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
