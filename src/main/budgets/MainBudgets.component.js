import React, {Component} from "react";
import {Box, Drawer, Stack} from "@mui/material";
import DateRange from "./budgetsMenuBar/DateRange.component";
import * as Controller from "./MainBudgets.controller";
import * as Services from "./MainBudgets.extservices";
import Budgets from "./budgets/Budgets.component";
import CompteItem from "./budgetsMenuBar/CompteItem.component";

/*
Page principale de gestion des budgets
*/
export default class MainBudget extends Component {

    /** Etats pour la page Budget **/
    state = {
        comptes: [],
        selectedCompte: null,
        selectedDate: new Date(new Date(Date.now()).getFullYear(), new Date(Date.now()).getMonth(), 1, 0, 0, 0),
    }


    /** Constructeur **/
    constructor(props) {
        super(props);
        this.handleCompteChange = Controller.handleCompteChange.bind(this);
        this.handleDateChange = Controller.handleDateChange.bind(this);
        this.loadComptes = Services.loadComptes.bind(this);
        this.comptesLoaded = Services.comptesLoaded.bind(this);
    }

    /** Appels WS vers pour charger la liste des comptes **/
    componentDidMount() {
        this.loadComptes();
    }

    render() {
        return (
            <>
                <Drawer variant={"temporary"} anchor="left" open={true}>
                    <Stack spacing={2}>
                        <Box sx={{height: 80}}/>

                        <DateRange onDateChange={this.handleDateChange}
                                   idCompte={this.state.selectedCompte != null ? this.state.selectedCompte.id : null}/>

                        <Stack spacing={2}>
                            {this.state.comptes.map((compte) => (
                                <div onClick={() => this.handleCompteChange(compte)}>
                                    <CompteItem compte={compte} selectedCompte={this.state.selectedCompte}/>
                                </div>
                            ))}
                        </Stack>

                    </Stack>
                </Drawer>

                {this.state.selectedCompte != null && this.state.selectedDate != null && false ?
                    <Budgets selectedCompte={this.state.selectedCompte}
                             selectedDate={this.state.selectedDate}/> : "Chargement..."}
            </>
        );
    }
}
