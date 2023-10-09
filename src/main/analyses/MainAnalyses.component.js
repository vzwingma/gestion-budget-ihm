import React, {Component} from "react";
import {Box, CircularProgress, Divider, Drawer, Stack} from "@mui/material";
import DateRange from "../mainpages/menuBar/DateRange.component";
import * as Controller from "../mainpages/MainPages.controller";
import * as Services from "../mainpages/MainPages.extservices";
import CompteItem from "../mainpages/menuBar/CompteItem.component";
import {ToastContainer} from "react-toastify";
import Analyse from "./analyse/Analyse.component";

/**
 *    Page principale de gestion des budgets
 */
export default class MainAnalyses extends Component {

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
        this.handleOpenMenuBar = Controller.handleOpenMenuBar.bind(this);
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

                        <DateRange onDateChange={this.handleDateChange} selectedDate={this.state.selectedDate}/>

                        <Stack divider={<Divider orientation="horizontal" flexItem/>}>
                            {this.state.comptes
                                .filter((compte) => !compte.isDisabled)
                                .map((compte) => (
                                <CompteItem key={compte.id}
                                            compte={compte}
                                            selectedDate={this.state.selectedDate}
                                            onClick={this.handleCompteChange}/>
                            ))}
                        </Stack>

                    </Stack>
                </Drawer>

                {this.state.selectedCompte !== null && this.state.selectedDate !== null ?
                    <Analyse selectedCompte={this.state.selectedCompte}
                             selectedDate={this.state.selectedDate}
                             onOpenMenu={this.handleOpenMenuBar}/>
                    :
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
