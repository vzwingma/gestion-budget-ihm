import React, {JSX, useContext, useEffect, useState} from "react";
import {Box, Container, Divider, Drawer, Stack, useMediaQuery, useTheme} from "@mui/material";
import {ToastContainer} from "react-toastify";
import {BUSINESS_ONGLETS} from "../../Utils/AppBusinessEnums.constants.ts";
import {loadComptes} from "./MainPage.extservices.ts";
import CompteBancaireModel from "../../Models/budgets/CompteBancaire.model.ts";
import CompteItem from "./menuSlideBar/CompteItem.component.tsx";
import DateRange from "./menuSlideBar/DateRange.component.tsx";
import BudgetPage from "../budgets/budget/Budget.component.tsx";
import {MainPageProps} from "../Components.props.tsx";
import {BudgetContext} from "../../Models/contextProvider/BudgetContextProvider.tsx";
import {useAuth} from "react-oidc-context";
import { RecurrentsPage } from "../budgets/recurrents/Recurrents.component.tsx";
import { Analyses } from "../analyses/Analyses.component.tsx";
import { CenterComponent } from "../shared/CenterComponent.tsx";
import { getCompteGroupByOwner } from "../../Utils/UserData.utils.ts";


/**
 * Page principale de gestion des budgets
 */
/**
 * MainPage component - Renders the main application page with budget management functionality
 * 
 * @component
 * @param {MainPageProps} props - Component props
 * @param {BUSINESS_ONGLETS} props.fonction - The selected business tab/function to display
 * @returns {JSX.Element} The main page layout with drawer navigation and sub-page content
 * 
 * @description
 * Manages the main application layout including:
 * - Left drawer with date range selector and account list grouped by owner
 * - Dynamic sub-page rendering based on selected function (BUDGET, RECURRENTS, ANALYSES)
 * - Account selection and date change handling
 * - Responsive design for mobile devices
 * 
 * @requires BudgetContext - Context providing comptes, selectedCompte, selectedDate and their setters
 * @requires useAuth - Hook for authentication and user information
 * 
 * @example
 * ```tsx
 * <MainPage fonction={BUSINESS_ONGLETS.BUDGET} />
 * ```
 */
export const MainPage: React.FC<MainPageProps> = ({ fonction }: MainPageProps): JSX.Element => {
    /** Etats pour la page Budget/Analyse **/
    const { comptes, setListeComptes, selectedCompte, setSelectedCompte, selectedDate, setSelectedDate } = useContext(BudgetContext);
    const auth = useAuth();
    const [budgetMenuOpen, setBudgetMenuOpen] = useState<boolean>(true);
    const isMobile = useMediaQuery(useTheme().breakpoints.down('lg'));
    /** Appels WS vers pour charger la liste des comptes **/
    useEffect(() => {
        loadComptes(setListeComptes);
    }, [selectedDate, setListeComptes])


    /**
     * Notification lorsque le compte change
     * @param selectedCompteFromComponent : compte sélectionnée
     */
    function handleCompteChange(selectedCompteFromComponent: CompteBancaireModel) {
        console.log("[TRIGGER-MENU] Context compte", selectedCompteFromComponent.id)
        setSelectedCompte(selectedCompteFromComponent);
        setBudgetMenuOpen(false);
    }


    /**
     * Affichage de la menubar des comptes
     */
    function handleOpenMenuBar() {
        setSelectedCompte(null);
        setBudgetMenuOpen(true);
    }

    /**
     *   Notification lorsque la date change
     * @param selectedDateFromComponent : date sélectionnée
     */
    function handleDateChange(selectedDateFromComponent: Date) {
        console.log("[TRIGGER-MENU] Context date", selectedDateFromComponent)
        setSelectedDate(selectedDateFromComponent);
    }



    /**
     * Render de la page principale, suivant la fonction sélectionnée
     * @returns {JSX.Element}
     */
    function renderSubMainPage(): JSX.Element | null {
        switch (fonction) {

            case BUSINESS_ONGLETS.BUDGET:
                return  <BudgetPage onOpenMenu={handleOpenMenuBar} />

            case BUSINESS_ONGLETS.RECURRENTS:
                return  <RecurrentsPage onOpenMenu={handleOpenMenuBar} />

            case BUSINESS_ONGLETS.ANALYSES:
                return <Analyses selectedCompte={selectedCompte}
                    onOpenMenu={handleOpenMenuBar} />
            default:
                return null;
        }
    }

    /**
     * Render de la partie gauche de la menubar
     * @returns {JSX.Element} | null
     * @constructor actif
     * @param fonction : fonction sélectionnée
     */
    function renderLeftTabDate(fonction: BUSINESS_ONGLETS): JSX.Element | null {
        if (fonction === BUSINESS_ONGLETS.BUDGET || fonction === BUSINESS_ONGLETS.RECURRENTS) {
            return <DateRange selectedDate={selectedDate} onDateChange={handleDateChange} />
        }
        else {
            return null;
        }
    }


    return (
        <>
            <Drawer variant={"temporary"} anchor="left" open={budgetMenuOpen}
                ModalProps={{
                    keepMounted: true,
                }}>
                <Stack spacing={2} sx={{overflow: 'hidden', height: '100%', display: 'flex', flexDirection: 'column'}}>
                    <Box sx={{height: isMobile ? 40 : 80}}/>

                    {renderLeftTabDate(fonction)}

                    <Stack divider={<Divider orientation="horizontal" flexItem />} sx={{overflow: 'auto', flex: 1}}>
                        {Object.entries(
                            getCompteGroupByOwner(comptes, auth?.user?.profile.email ?? ''))
                            .map(([owner, ownerComptes]) => (
                                <Box key={owner}>
                                    <Container key={"liste_" + owner}
                                            className={"listeItemSeparator"}>
                                        {String(auth?.user?.profile.email).toLocaleLowerCase().startsWith(owner.toLocaleLowerCase()) ? "Mes comptes" : "Les comptes de " + owner}
                                    </Container>
                                {ownerComptes.map((compte) => (
                                    <CompteItem key={compte.id}
                                        compte={compte}
                                        selectedFunction={fonction}
                                        selectedDate={selectedDate}
                                        onRefreshMenuBar={budgetMenuOpen}
                                        onClick={handleCompteChange} />
                                ))}
                            </Box>
                        ))}
                    </Stack>

                </Stack>
            </Drawer>

            { /* Render de la page principale */}
            <Box sx={{overflow: 'hidden' }}>
                {selectedCompte && selectedDate ? renderSubMainPage() : null}
            </Box>

            <ToastContainer
                position="bottom-left"
                autoClose={1000}
                hideProgressBar={false} newestOnTop={false} closeOnClick={false} rtl={false}
                pauseOnFocusLoss draggable pauseOnHover
            />
        </>
    );
}
export default MainPage;
