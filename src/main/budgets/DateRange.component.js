import React, { Component } from "react";
import { Pagination } from 'react-bootstrap'
import * as AppConstants from "../Utils/AppEnums.constants"
import * as ClientHTTP from './../Services/ClientHTTP.service'

/*
 * Date Range Select
 */
export default class DateRange extends Component {

    state = {
        datePremierBudget : null,
        dateDernierBudget : null,
        datePreviousBudget : null,
        dateCurrentBudget : null,
        dateNextBudget : null,
        idCompte : null
    }

    // Constructeur
    constructor(props) {
        super(props);

        // Init date à maintenant
        var now = new Date(Date.now())
        this.state = {
                     datePremierBudget : null,
                     dateDernierBudget : null,
                     datePreviousBudget : new Date(now.getFullYear(), now.getMonth() - 1, 1, 0, 0, 0),
                     dateCurrentBudget : new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0),
                     dateNextBudget : new Date(now.getFullYear(), now.getMonth() + 1, 1, 0, 0, 0),
                     idCompte : null
                 }
        this.props.onDateChange(new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0));

        this.handleSelect = this.handleSelect.bind(this);
        this.refreshDatesFromCompte = this.refreshDatesFromCompte.bind(this);
        this.intervalleLoaded = this.intervalleLoaded.bind(this);
    }

    // Mise à jour du contexte de budget
    shouldComponentUpdate(nextProps, nextStates){
        // Update ssi c'est le compte qui change
        if(nextProps.idCompte !== nextStates.idCompte){
            console.log("[TRIGGER] Context :: Compte=" + nextProps.idCompte )
            this.setState({idCompte : nextProps.idCompte})
            this.refreshDatesFromCompte(nextProps.idCompte)
            return true;
        }
        if(this.state.dateCurrentBudget.getTime() !== nextStates.dateCurrentBudget.getTime()){
                console.log("[TRIGGER] Context :: date=" + nextStates.dateCurrentBudget )
                return true;
        }
        return false;
    }

    /** Appels WS vers pour charger la liste des comptes **/
    refreshDatesFromCompte(idCompte) {

        ClientHTTP.call('GET',
                        AppConstants.BACKEND_ENUM.URL_OPERATIONS, AppConstants.SERVICES_URL.BUDGETS.INTERVALLE,
                [ idCompte ])
                .then((data) => {
                    // console.log(data)
                    this.intervalleLoaded(data.datePremierBudget, data.dateDernierBudget)
                })
                .catch((e) => {
                    console.log("Erreur lors du chargement de l'intervalle des budgets" + e)
                })
    }

    // Chargement de l'intervalle de compte
    intervalleLoaded(jourDepuisInitPremierBudget, jourDepuisInitDernierBudget) {

        var datePremierBudget = new Date(jourDepuisInitPremierBudget * 24 * 60 * 60 * 1000);
        var dateDernierBudget = new Date(jourDepuisInitDernierBudget * 24 * 60 * 60 * 1000);
        console.log("Budgets disponibles entre " + datePremierBudget.toLocaleString() + " et " + dateDernierBudget.toLocaleString());

        this.setState({ datePremierBudget: datePremierBudget, dateDernierBudget : dateDernierBudget });
    }


    // Sélection d'un mois à partir du composant
    handleSelect(event) {
        var newDatePreviousBudget;
        var newDateCurrentBudget;
        var newDateNextBudget;
        var dateChanged = false;
        if(event.target.id === "previous"){
            newDateCurrentBudget = new Date(this.state.datePreviousBudget);
            newDatePreviousBudget = new Date(this.state.datePreviousBudget.setMonth(this.state.datePreviousBudget.getMonth() - 1));
            newDateNextBudget = new Date(this.state.dateCurrentBudget);
            dateChanged = true;
        }
        else if(event.target.id === "next"){
            newDatePreviousBudget = new Date(this.state.dateCurrentBudget);
            newDateCurrentBudget = new Date(this.state.dateNextBudget);
            newDateNextBudget = new Date(this.state.dateNextBudget.setMonth(this.state.dateNextBudget.getMonth() + 1));
            dateChanged = true;
        }
        else if(event.target.id === "firstButton"){
            newDatePreviousBudget = new Date(new Date(this.state.datePremierBudget).setMonth(this.state.datePremierBudget.getMonth() - 1));
            newDateCurrentBudget = new Date(this.state.datePremierBudget);
            newDateNextBudget = new Date(new Date(this.state.datePremierBudget).setMonth(this.state.datePremierBudget.getMonth() + 1));
            dateChanged = true;
        }
        else if(event.target.id === "lastButton"){
            newDateCurrentBudget = new Date(this.state.dateDernierBudget);
            newDateNextBudget = new Date(new Date(this.state.dateDernierBudget).setMonth(this.state.dateDernierBudget.getMonth() + 1));
            newDatePreviousBudget = new Date(new Date(this.state.dateDernierBudget).setMonth(this.state.dateDernierBudget.getMonth() - 1));
            dateChanged = true;
        }
        if(dateChanged){
            this.setState({
                datePreviousBudget : newDatePreviousBudget,
                dateCurrentBudget : newDateCurrentBudget,
                dateNextBudget : newDateNextBudget
            })
            // Date sélectionnée, remonté à budget
            this.props.onDateChange(newDateCurrentBudget);
        }


    }


/**
 *  RENDER
 */


    render() { return (
    <div>
        <style type="text/css">{`
            .pagination {
                justify-content: center;
                display: flex;
            }
        `}</style>
           <Pagination onClick={this.handleSelect}>
             <Pagination.First id="firstButton"/>
             <Pagination.Item id="previous">{ this.state.datePreviousBudget.toLocaleString('default', { month: 'long' })} { this.state.datePreviousBudget.getFullYear()}  </Pagination.Item>
             <Pagination.Item id="current" active>{ this.state.dateCurrentBudget.toLocaleString('default', { month: 'long' })} { this.state.dateCurrentBudget.getFullYear() }</Pagination.Item>
             <Pagination.Item id="next">{ this.state.dateNextBudget.toLocaleString('default', { month: 'long' }) } { this.state.dateNextBudget.getFullYear() }</Pagination.Item>
             <Pagination.Last id="lastButton"/>
           </Pagination>
        </div>
    ); }
}

