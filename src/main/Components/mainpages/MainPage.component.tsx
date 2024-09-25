import React, { useEffect, useState } from "react";
import { Box, CircularProgress, Divider, Drawer, Stack } from "@mui/material";
import { ToastContainer } from "react-toastify";
import { BUSINESS_ONGLETS } from "../../Utils/AppBusinessEnums.constants";
import { loadComptes } from "./MainPage.extservices";
import CompteBancaireModel from "../../Models/CompteBancaire.model";
import CompteItem from "./menuSlideBar/CompteItem.component";
import DateRange from "./menuSlideBar/DateRange.component";
import BudgetPage from "../budgets/budget/Budget.component";


interface MainPageProps {
    fonction: BUSINESS_ONGLETS;
}
/**
 * Page principale de gestion des budgets
 */
export const MainPage: React.FC<MainPageProps> = ({ fonction }: MainPageProps): JSX.Element => {
    /** Etats pour la page Budget/Analyse **/
    const [comptes, setComptes] = useState<CompteBancaireModel[]>([]);
    const [selectedCompte, setSelectedCompte] = useState<CompteBancaireModel | null>(null);
    const [selectedDate, setSelectedDate] = useState<Date>(new Date(new Date(Date.now()).getFullYear(), new Date(Date.now()).getMonth(), 1, 0, 0, 0));
    const [budgetMenuOpen, setBudgetMenuOpen] = useState<boolean>(true);

    /** Appels WS vers pour charger la liste des comptes **/
    useEffect(() => {
        loadComptes(setComptes);
    }, [selectedDate])


    /**
     * Notification lorsque le compte change
     * @param selectedCompteFromComponent : compte sélectionnée
     */
    function handleCompteChange(selectedCompteFromComponent: CompteBancaireModel) {
        console.log("[TRIGGER-MENU] NewContext compte=" + selectedCompteFromComponent.id)
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
    function handleDateChange(selectedDateFromComponent : Date) {
        console.log("[TRIGGER-MENU] NewContext date=" + selectedDateFromComponent)
        setSelectedDate(selectedDateFromComponent);
    }



    /**
     * Render de la page principale, suivant la fonction sélectionnée
     * @returns {JSX.Element}
     */
    function renderSubMainPage(): JSX.Element {
        switch (fonction) {

            case BUSINESS_ONGLETS.BUDGET:
                return <BudgetPage selectedCompte={selectedCompte}
                                    selectedDate={selectedDate}
                                    listeComptes={comptes}
                                    onOpenMenu={handleOpenMenuBar} />
            /*
            case BUSINESS_ONGLETS.ANALYSE:
                return <AnalyseCategories   selectedCompte={selectedCompte}
                                            selectedDate={selectedDate}
                                            onOpenMenu={handleOpenMenuBar} />
            case BUSINESS_ONGLETS.ANALYSE_TEMP:
                return <AnalyseTemporelle selectedCompte={selectedCompte}
                                          onOpenMenu={handleOpenMenuBar} />
                                          */
            default:
                return <></>
        }
    }

    /**
     * Render de la partie gauche de la menubar
     * @returns {JSX.Element
     * @constructor
     */
    function renderLeftTabCompte(): JSX.Element {
        switch (fonction) {
            case BUSINESS_ONGLETS.BUDGET:
                return <DateRange selectedDate={selectedDate} onDateChange={handleDateChange} />
            default:
                return <></>
        }
    }


    return (
        <>
            <Drawer variant={"temporary"} anchor="left" open={budgetMenuOpen}
                ModalProps={{
                    keepMounted: true,
                }}>
                <Stack spacing={2}>
                    <Box sx={{ height: 80 }} />

                    {renderLeftTabCompte()}

                    <Stack divider={<Divider orientation="horizontal" flexItem />}>
                        {comptes
                            .filter((compte) => !compte.isDisabled)
                            .map((compte) => (
                                <CompteItem key={compte.id}
                                    compte={compte}
                                    selectedFunction={fonction}
                                    selectedDate={selectedDate}
                                    onRefreshMenuBar={budgetMenuOpen}
                                    onClick={handleCompteChange} />
                            ))}
                    </Stack>

                </Stack>
            </Drawer>

            {selectedCompte !== null && selectedDate !== null ?
                renderSubMainPage()
                :
                <CircularProgress />}

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