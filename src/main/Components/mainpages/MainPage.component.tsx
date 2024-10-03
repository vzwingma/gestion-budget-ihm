import React, { useContext, useEffect, useState } from "react";
import { Box, Divider, Drawer, Stack } from "@mui/material";
import { ToastContainer } from "react-toastify";
import { BUSINESS_ONGLETS } from "../../Utils/AppBusinessEnums.constants";
import { loadComptes } from "./MainPage.extservices";
import CompteBancaireModel from "../../Models/budgets/CompteBancaire.model";
import CompteItem from "./menuSlideBar/CompteItem.component";
import DateRange from "./menuSlideBar/DateRange.component";
import BudgetPage from "../budgets/budget/Budget.component";
import { AnalyseTemporelle } from "../analyses/temporelles/AnalyseTemporelle.component";
import { AnalyseCategories } from "../analyses/categories/AnalyseCategories.component";
import { MainPageProps } from "../Components.props";
import { BudgetContext } from "../../Models/contextProvider/BudgetContextProvider";



/**
 * Page principale de gestion des budgets
 */
export const MainPage: React.FC<MainPageProps> = ({ fonction }: MainPageProps): JSX.Element => {
    /** Etats pour la page Budget/Analyse **/
    const { comptes, setComptes, selectedCompte, setSelectedCompte, selectedDate, setSelectedDate } = useContext(BudgetContext)!;

    const [budgetMenuOpen, setBudgetMenuOpen] = useState<boolean>(true);

    /** Appels WS vers pour charger la liste des comptes **/
    useEffect(() => {
        loadComptes(setComptes);
    }, [selectedDate, setComptes])


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
    function renderSubMainPage(): JSX.Element {
        switch (fonction) {

            case BUSINESS_ONGLETS.BUDGET:
                return  <BudgetPage onOpenMenu={handleOpenMenuBar} />

            case BUSINESS_ONGLETS.ANALYSE:
                return <AnalyseCategories selectedCompte={selectedCompte}
                    selectedDate={selectedDate}
                    onOpenMenu={handleOpenMenuBar} />

            case BUSINESS_ONGLETS.ANALYSE_TEMP:
                return <AnalyseTemporelle selectedCompte={selectedCompte}
                    onOpenMenu={handleOpenMenuBar} />

            default:
                return <></>
        }
    }

    /**
     * Render de la partie gauche de la menubar
     * @returns {JSX.Element
     * @constructor
     */
    function renderLeftTabCompte(fonction: BUSINESS_ONGLETS): JSX.Element {
        if (fonction === BUSINESS_ONGLETS.BUDGET) {
            return <DateRange selectedDate={selectedDate} onDateChange={handleDateChange} />
        }
        else {
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

                    {renderLeftTabCompte(fonction)}

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
                <></>}

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
