import React, { JSX, useCallback, useEffect, useMemo, useState } from "react";

import { Grid } from "@mui/material";
import BudgetMensuelModel from "../../../Models/budgets/BudgetMensuel.model.ts";
import OperationModel from "../../../Models/budgets/Operation.model.ts";
import { fetchBudget, fetchPreferenceUtilisateur } from "./../budget/Budget.extservices.ts";

import { getOperationsRecurrentesGroupedByPeriodicity } from "./Recurrents.controller.ts";
import { RecurrentsPageProps } from "../../Components.props.ts";
import { useBudgetContext } from "../../../Models/contextProvider/BudgetContextProvider.tsx";
import OperationsRecurrentesListe from "../operations/recurrentes/OperationsRecurrentesListe.component.tsx";
import BudgetPageShell from "../shared/BudgetPageShell.component.tsx";
import OperationRecurrenteDetailPage from "../operations/recurrentes/details/OperationRecurrenteDetailPage.component.tsx";
import { BudgetActionsButtonGroupComponent } from "../budget/actions/BudgetActionsButtonGroup.component.tsx";
import { UTILISATEUR_DROITS } from "../../../Utils/AppBusinessEnums.constants.ts";
import { debug } from "../../../Utils/Debug.utils.ts";
import { getLabelFRFromDate } from "../../../Utils/Date.utils.ts";
import { useFetch } from "../../../hooks/useFetch.ts";


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

    const { currentBudget, setCurrentBudget, currentOperation, setCurrentOperation, selectedCompte, selectedDate } = useBudgetContext();

    const [filterOperations, setFilterOperations] = useState<string | null>(null);

    /** Préférences utilisateur au 1er démarrage **/
    const { data: userDroitsCharges } = useFetch(() => fetchPreferenceUtilisateur(), []);
    const userDroits: UTILISATEUR_DROITS[] = userDroitsCharges ?? [];



    /** Callback de mise à jour du budget **/
    const handleBudgetUpdate = useCallback((budget: BudgetMensuelModel) => {
        setCurrentBudget(budget);
        debug("Chargement du budget correctement effectué");
    }, [setCurrentBudget]);

    /** Regroupement des opérations récurrentes par périodicité, dérivé du budget courant **/
    const operationsRecurrentesGroupedByPeriodicity = useMemo(
        () => currentBudget == null ? {} : getOperationsRecurrentesGroupedByPeriodicity(currentBudget.listeOperations, currentBudget.id),
        [currentBudget]
    );

    /** Rechargement du budget si changement de compte ou de date **/
    const { data: budgetCharge } = useFetch(() => fetchBudget(selectedCompte, selectedDate), [selectedCompte, selectedDate]);

    /** Réinitialisation du contexte si changement de compte ou de date **/
    useEffect(() => {
        debug("[TRIGGER] Context selectedCompte :", selectedCompte?.id, "selectedDate :", getLabelFRFromDate(selectedDate));
        setCurrentBudget(undefined);
        setCurrentOperation(null);
    }, [selectedCompte, selectedDate, setCurrentOperation, setCurrentBudget]);

    /** Le budget chargé alimente le contexte **/
    useEffect(() => {
        if (budgetCharge !== undefined) {
            handleBudgetUpdate(budgetCharge);
        }
    }, [budgetCharge, handleBudgetUpdate]);

    /**
     * Sélection d'une opération
     * @param operation opération
     */
    const handleOperationSelect = useCallback((operation: OperationModel) => {
        setCurrentOperation(operation);
        debug("Opération sélectionnée :", operation.id, operation);
    }, [setCurrentOperation]);


    /**
     * Render du budget
     */
    return (
        <BudgetPageShell
            className="page-container recurrents-page-container"
            isLoading={currentBudget == null}
            onOpenMenu={onOpenMenu}
            filterOperations={filterOperations}
            onFilterChange={setFilterOperations}
            selectedCompte={selectedCompte}
            selectedDate={selectedDate}
            filterPlaceholder="Filtrage des opérations récurrentes"
            additionalHeaderContentRight={
                <Grid size={{ md: 1, xl: 1 }}>
                    {currentBudget == null ?
                        <></> :
                        <BudgetActionsButtonGroupComponent
                            droits={userDroits}
                            onActionBudgetChange={handleBudgetUpdate}
                            onActionOperationCreate={() => { }} />
                    }
                </Grid>}
            leftColumnSize={{ md: 5, xl: 4 }}
            rightColumnSize={{ md: 7, xl: 8 }}
            leftContent={
                /** Liste des opérations récurrentes **/
                currentBudget == null ?
                    <></>
                    :
                    <OperationsRecurrentesListe
                        operationGroupedByPeriodicity={operationsRecurrentesGroupedByPeriodicity}
                        filterOperations={filterOperations}
                        onClick={handleOperationSelect}
                        selectedOperationId={currentOperation?.id} />
            }
            rightContent={
                currentBudget != null && currentOperation != null ?
                    /** Affichage d'une opération **/
                    <OperationRecurrenteDetailPage onOperationChange={handleBudgetUpdate} />
                    : <></>
            }
        />
    )
}
export default RecurrentsPage;
