import React, {Component} from "react";
import {Box, Drawer, Stack} from "@mui/material";
import ComptesList from "./budgetsMenuBar/ComptesList.component";
import DateRange from "./budgetsMenuBar/DateRange.component";


/*
Page principale de gestion des budgets
*/
export default class MainBudget extends Component {

    /** Etats pour la page Budget **/
    state = {
        selectedCompte: null,
        selectedDate: new Date(new Date(Date.now()).getFullYear(), new Date(Date.now()).getMonth(), 1, 0, 0, 0),
    }

    render() {
        return (

            <Drawer variant={"temporary"}
                    anchor="left"
                    open="true"
            >
                <Stack spacing={2}>
                    <Box sx={{height: 80}}/>


                    <DateRange onDateChange={this.handleDateChange}
                               idCompte={this.state.selectedCompte != null ? this.state.selectedCompte.value : null}/>

                    <ComptesList onCompteChange={this.handleCompteChange}/>

                </Stack>
            </Drawer>

        );
    }
}
