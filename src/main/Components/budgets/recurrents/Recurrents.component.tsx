import React, { JSX, useCallback, useState } from "react";

import { Grid } from "@mui/material";
import BudgetMensuelModel from "../../../Models/budgets/BudgetMensuel.model.ts";
import OperationModel from "../../../Models/budgets/Operation.model.ts";

import { getOperationsRecurrentesGroupedByPeriodicity } from "./Recurrents.controller.ts";
import OperationsRecurrentesListe from "../operations/recurrentes/OperationsRecurrentesListe.component.tsx";
import BudgetPageShell from "../shared/BudgetPageShell.component.tsx";
import { useBudgetPageData } from "../shared/useBudgetPageData.ts";
import OperationRecurrenteDetailPage from "../operations/recurrentes/details/OperationRecurrenteDetailPage.component.tsx";
import { BudgetActionsButtonGroupComponent } from "../budget/actions/BudgetActionsButtonGroup.component.tsx";
import { debug } from "../../../Utils/Debug.utils.ts";

/** Regroupement des opérations récurrentes par périodicité (référence stable) */
const groupOperationsByPeriodicity = (budget: BudgetMensuelModel) => getOperationsRecurrentesGroupedByPeriodicity(budget.listeOperations, budget.id);

export interface RecurrentsPageProps {
    onOpenMenu: () => void
}


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
 * Wrapper mince : le chargement du budget, la réinitialisation du contexte (compte / date), le regroupement et les droits
 * utilisateur sont portés par `useBudgetPageData` (commun avec `BudgetPage`) ; il ne reste ici que le filtre texte, la
 * sélection d'une opération et les 2 colonnes (liste des récurrentes / détail).
 */
export const RecurrentsPage: React.FC<RecurrentsPageProps> = ({ onOpenMenu }: RecurrentsPageProps): JSX.Element => {

    /** Etats pour la page Recurrents **/
    const {
        selectedCompte, selectedDate, currentBudget, currentOperation, setCurrentOperation,
        operationsGroupees: operationsRecurrentesGroupedByPeriodicity, userDroits, handleBudgetUpdate
    } = useBudgetPageData({ groupOperations: groupOperationsByPeriodicity });

    const [filterOperations, setFilterOperations] = useState<string | null>(null);

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
