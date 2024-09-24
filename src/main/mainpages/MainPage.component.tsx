import React, {Component} from "react";
import {Box, CircularProgress, Divider, Drawer, Stack} from "@mui/material";
import {ToastContainer} from "react-toastify";
import {BUSINESS_ONGLETS} from "../Utils/AppBusinessEnums.constants";


interface MainPageProps {
    fonction: string;
}
/**
 * Page principale de gestion des budgets
 */
class MainPage extends Component<MainPageProps> {

    /** Etats pour la page Budget/Analyse **/
    state = {
        comptes: [],
        selectedCompte: null,
        selectedDate: new Date(new Date(Date.now()).getFullYear(), new Date(Date.now()).getMonth(), 1, 0, 0, 0),
        budgetMenuOpen: true
    }


    /** Constructeur **/
    constructor(props : any) {
        super(props);
        this.handleCompteChange = handleCompteChange.bind(this);
        this.handleDateChange = handleDateChange.bind(this);
        this.loadComptes = loadComptes.bind(this);
        this.comptesLoaded = comptesLoaded.bind(this);
        this.handleOpenMenuBar = handleOpenMenuBar.bind(this);
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
        if (fonction === BUSINESS_ONGLETS.BUDGET) {
            return <Budget selectedCompte={this.state.selectedCompte}
                           selectedDate={this.state.selectedDate}
                           listeComptes={this.state.comptes}
                           onOpenMenu={this.handleOpenMenuBar}/>
        } else if (fonction === BUSINESS_ONGLETS.ANALYSE) {
            return <AnalyseCategories selectedCompte={this.state.selectedCompte}
                                      selectedDate={this.state.selectedDate}
                                      onOpenMenu={this.handleOpenMenuBar}/>
        } else if (fonction === BUSINESS_ONGLETS.ANALYSE_TEMP) {
            return <AnalyseTemporelle selectedCompte={this.state.selectedCompte}
                                      onOpenMenu={this.handleOpenMenuBar}/>
        } else {
            return <></>
        }
    }

    renderLeftTabCompte() {
        if (this.props.fonction === BUSINESS_ONGLETS.BUDGET) {
            return <DateRange onDateChange={this.handleDateChange} selectedDate={this.state.selectedDate}/>
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

                        {this.renderLeftTabCompte()}

                        <Stack divider={<Divider orientation="horizontal" flexItem/>}>
                            {this.state.comptes
                                .filter((compte) => !compte.isDisabled)
                                .map((compte) => (
                                    <CompteItem key={compte.id}
                                                compte={compte}
                                                selectedFunction={this.props.fonction}
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
export default MainPage;
