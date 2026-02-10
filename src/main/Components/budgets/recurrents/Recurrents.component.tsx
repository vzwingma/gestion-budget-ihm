import React, { JSX, useCallback, useContext, useEffect, useState } from "react";

import { Box, CircularProgress, Divider, Grid, useMediaQuery, useTheme } from "@mui/material";
import BudgetMensuelModel from "../../../Models/budgets/BudgetMensuel.model.ts";
import OperationModel from "../../../Models/budgets/Operation.model.ts";
import { getPreferenceUtilisateur, reloadBudget } from "./../budget/Budget.extservices.ts";

import { getLabelFRFromDate } from "../../../Utils/Date.utils.ts";
import { getOperationsRecurrentesGroupedByPeriodicity } from "./Recurrents.controller.ts";
import { CenterComponent } from "../../shared/CenterComponent.tsx";
import { RecurrentsPageProps } from "../../Components.props.ts";
import { BudgetContext } from "../../../Models/contextProvider/BudgetContextProvider.tsx";
import OperationsRecurrentesListe from "../operations/recurrentes/OperationsRecurrentesListe.component.tsx";
import BudgetPageHeader from "../shared/BudgetPageHeader.component.tsx";
import OperationRecurrenteDetailPage from "../operations/recurrentes/details/OperationRecurrenteDetailPage.component.tsx";
import { BudgetActionsButtonGroupComponent } from "../budget/actions/BudgetActionsButtonGroup.component.tsx";
import { UTILISATEUR_DROITS } from "../../../Utils/AppBusinessEnums.constants.ts";
import { getHeightList } from "../../../Utils/ListData.utils.tsx";


/**
 * Composant principal de la page Recurrents.
 *
 * @param {RecurrentsPageProps} props - Les propriétés du composant RecurrentsPage.
 * @param {Function} props.onOpenMenu - Fonction pour ouvrir le menu.
 * @returns {JSX.Element} - Le composant JSX de la page Recurrents.
 *
 * @component
 *
 * @description
 * Ce composant gère l'affichage et les interactions de la page Recurrents. Il charge les catégories et les préférences utilisateur au démarrage,
 * et met à jour le budget lorsque le compte ou la date sélectionnée change. Il permet également de filtrer les opérations, de sélectionner
 * une opération et de créer une nouvelle opération.
 *
 * @remarks
 * Ce composant utilise plusieurs hooks React pour gérer l'état et les effets de bord, ainsi que des composants Material-UI pour l'interface utilisateur.
 */
export const RecurrentsPage: React.FC<RecurrentsPageProps> = ({ onOpenMenu }: RecurrentsPageProps): JSX.Element => {

    /** Etats pour la page Recurrents **/

    const { currentBudget, setCurrentBudget, currentOperation, setCurrentOperation, selectedCompte, selectedDate } = useContext(BudgetContext);

    const [operationsRecurrentesGroupedByPeriodicity, setOperationsRecurrentesGroupedByPeriodicity] = useState<{ [key: string]: OperationModel[] }>({});
    const [filterOperations, setFilterOperations] = useState<string | null>(null);
    const [userDroits, setUserDroits] = useState<UTILISATEUR_DROITS[]>([]);
    const isMobile = useMediaQuery(useTheme().breakpoints.down('lg'));



    /** Callback de mise à jour du budget **/
    const handleBudgetUpdate = useCallback((budget: BudgetMensuelModel) => {
        console.log("(Re)Chargement du budget", budget.id, ":", budget.listeOperations.length + " opérations");
        setCurrentBudget(budget);
        setOperationsRecurrentesGroupedByPeriodicity(getOperationsRecurrentesGroupedByPeriodicity(budget.listeOperations, budget.id));
        console.log("Chargement du budget correctement effectué");
    }, [setCurrentBudget, setOperationsRecurrentesGroupedByPeriodicity]);

    useEffect(() => {
        getPreferenceUtilisateur(setUserDroits);
    }, []);

    /** Mise à jour du budget si changement de compte ou de date **/
    useEffect(() => {
        console.log("[TRIGGER] Context selectedCompte :", selectedCompte?.id, "selectedDate :", getLabelFRFromDate(selectedDate))
        setCurrentBudget(undefined);
        reloadBudget(handleBudgetUpdate, selectedCompte, selectedDate);
        setCurrentOperation(null);
    }, [selectedCompte, selectedDate, handleBudgetUpdate, setCurrentOperation, setCurrentBudget]);

    /**
     * Sélection d'une opération
     * @param operation opération
     */
    function handleOperationSelect(operation: OperationModel) {
        setCurrentOperation(operation);
        console.log("Opération sélectionnée :", operation.id, operation);
    }


    /**
     * Render du budget
     */
    return (
        <Box className="page-container recurrents-page-container">
            <BudgetPageHeader
                onOpenMenu={onOpenMenu}
                filterOperations={filterOperations}
                onFilterChange={setFilterOperations}
                selectedCompte={selectedCompte}
                selectedDate={selectedDate}
                filterPlaceholder="Filtrage des opérations récurrentes"
                additionalHeaderContentRight={
                    <Grid size={{ md: 1, xl: 1 }}>
                        {currentBudget == null ?
                            <CenterComponent><CircularProgress /></CenterComponent> :
                            <BudgetActionsButtonGroupComponent
                                droits={userDroits}
                                onActionBudgetChange={handleBudgetUpdate}
                                onActionOperationCreate={() => { }} />
                        }
                    </Grid>}
            />
            <Divider variant="middle" sx={{ marginTop: isMobile ? 0 : 1 }} />
            <Grid container sx={{ overflow: "hidden" }}>
                <Grid size={{ md: 5, xl: 4 }} direction={"column"} sx={{ overflow: "hidden" }} maxHeight={'true'}>
                    { /** Liste des opérations récurrentes **/
                        (currentBudget == null ?
                            <CenterComponent><CircularProgress /></CenterComponent>
                            :
                            <OperationsRecurrentesListe
                                operationGroupedByPeriodicity={operationsRecurrentesGroupedByPeriodicity}
                                filterOperations={filterOperations}
                                onClick={handleOperationSelect}
                                selectedOperationId={currentOperation?.id} />
                        )
                    }
                </Grid>
                <Grid size={{ md: 7, xl: 8 }} sx={{ overflow: "hidden", height: getHeightList(isMobile) }}>
                    {currentBudget != null && currentOperation != null ?
                        /** Affichage d'une opération **/
                        <OperationRecurrenteDetailPage onOperationChange={handleBudgetUpdate} />
                        : <></>
                    }
                </Grid>
            </Grid>
        </Box>
    )
}
export default RecurrentsPage;
