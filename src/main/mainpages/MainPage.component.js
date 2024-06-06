import React, {Component} from "react";
import {Box, CircularProgress, Divider, Drawer, Stack} from "@mui/material";
import DateRange from "./menuSlideBar/DateRange.component";
import * as Controller from "./MainPage.controller";
import * as Services from "./MainPage.extservices";
import Budget from "../budgets/budget/Budget.component";
import CompteItem from "./menuSlideBar/CompteItem.component";
import {ToastContainer} from "react-toastify";
import AnalyseCategories from "../analyses/categories/AnalyseCategories.component";
import PropTypes from "prop-types";
import AnalyseTemporelle from "../analyses/temporelles/AnalyseTemporelle.component";

/**
 * Page principale de gestion des budgets
 * @param fonction : string fonction à afficher
 */
export default class MainPage extends Component {

    /** Etats pour la page Budget/Analyse **/
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


    /**
     * Render de la page principale, suivant la fonction sélectionnée
     * @returns {JSX.Element}
     */
    renderSubMainPage() {
        const fonction = this.props.fonction;
        if (fonction === "BUDGET") {
            return <Budget selectedCompte={this.state.selectedCompte}
                           selectedDate={this.state.selectedDate}
                           listeComptes={this.state.comptes}
                           onOpenMenu={this.handleOpenMenuBar}/>
        } else if (fonction === "ANALYSE") {
            return <AnalyseCategories selectedCompte={this.state.selectedCompte}
                                      selectedDate={this.state.selectedDate}
                                      onOpenMenu={this.handleOpenMenuBar}/>
        } else if (fonction === "ANALYSETEMP") {
            return <AnalyseTemporelle selectedCompte={this.state.selectedCompte}
                                      onOpenMenu={this.handleOpenMenuBar}/>
        } else {
            return <></>
        }
    }

    render() {
        return (
            <>
                <Drawer variant={"temporary"} anchor="left" open={this.state.budgetMenuOpen}
                        ModalProps={{
                            keepMounted: true,
                        }}>
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
                                                onRefreshMenuBar={this.state.budgetMenuOpen}
                                                onClick={this.handleCompteChange}/>
                                ))}
                        </Stack>

                    </Stack>
                </Drawer>

                {this.state.selectedCompte !== null && this.state.selectedDate !== null ?
                    this.renderSubMainPage()
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
MainPage.propTypes = {
    fonction: PropTypes.string.isRequired
}
