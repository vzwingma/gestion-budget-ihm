import React, {Component} from "react";
import {Box, CircularProgress, Drawer, Stack} from "@mui/material";
import DateRange from "./budgetsMenuBar/DateRange.component";
import * as Controller from "./MainBudgets.controller";
import * as Services from "./MainBudgets.extservices";
import Budget from "./budget/Budget.component";
import CompteItem from "./budgetsMenuBar/CompteItem.component";
import {ToastContainer} from "react-toastify";

/*
Page principale de gestion des budgets
*/
export default class MainBudget extends Component {

    /** Etats pour la page Budget **/
    state = {
        comptes: [],
        selectedCompte: null,
        selectedDate: new Date(new Date(Date.now()).getFullYear(), new Date(Date.now()).getMonth(), 1, 0, 0, 0),
        budgetMenuOpen: true
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
                <Drawer variant={"temporary"} anchor="left" open={this.state.budgetMenuOpen}>
                    <Stack spacing={2}>
                        <Box sx={{height: 80}}/>

                        <DateRange onDateChange={this.handleDateChange}
                                   idCompte={this.state.selectedCompte != null ? this.state.selectedCompte.id : null}/>

                        <Stack spacing={2}>
                            {this.state.comptes.map((compte) => (
                                    <CompteItem compte={compte}
                                                selectedIdCompte={this.state.selectedCompte != null ? this.state.selectedCompte.id : null}
                                                onClick={this.handleCompteChange}/>
                            ))}
                        </Stack>

                    </Stack>
                </Drawer>

                {this.state.selectedCompte !== null && this.state.selectedDate !== null ?
                    <Budget selectedCompte={this.state.selectedCompte} selectedDate={this.state.selectedDate}/> :
                    <CircularProgress/>}

                <ToastContainer
                    position="bottom-left"
                    autoClose={1000}
                    hideProgressBar={false} newestOnTop={false} closeOnClick={false} rtl={false}
                    pauseOnFocusLoss draggable pauseOnHover
                />
            </>
        );
    }
}
