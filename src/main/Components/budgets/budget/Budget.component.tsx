import React, { JSX, useCallback, useEffect, useMemo } from "react";

import { Grid } from "@mui/material";
import BudgetMensuelModel from "../../../Models/budgets/BudgetMensuel.model.ts";
import OperationModel, { createNewOperation } from "../../../Models/budgets/Operation.model.ts";
import { fetchCategories } from "./Budget.extservices.ts";
import { PERIODES_MENSUALITE_ENUM, UTILISATEUR_DROITS } from "../../../Utils/AppBusinessEnums.constants.ts";
import { BudgetActionsButtonGroupComponent } from "./actions/BudgetActionsButtonGroup.component.tsx";
import OperationsListe from "../operations/OperationsListe.component.tsx";
import OperationDetailPage from "../operations/courantes/detail/OperationDetailPage.component.tsx";
import { getOperationsGroupedByDateOperation, updateOperationsStatus } from "./Budget.controller.ts";
import { fetchLibellesOperationsCompte } from "../operations/courantes/detail/OperationDetailPage.extservices.ts";
import { useBudgetSelection, useCurrentBudget } from "../../../hooks/useBudgetContext.ts";
import { useBudgetPageData } from "../shared/useBudgetPageData.ts";
import { useFetch } from "../../../hooks/useFetch.ts";
import BudgetSoldes from "./BudgetSoldes.component.tsx";
import BudgetPageShell from "../shared/BudgetPageShell.component.tsx";
import OperationsFilterBar from "../shared/OperationsFilterBar.component.tsx";
import { filterOperationsList } from "../operations/OperationsListe.shared.tsx";

/** Regroupement des opérations du budget par date d'opération (référence stable) */
const groupOperationsByDate = (budget: BudgetMensuelModel) => getOperationsGroupedByDateOperation(budget.listeOperations);
/** Compatibilité des opérations sur le statut en retard (référence stable) */
const prepareBudgetOperations = (budget: BudgetMensuelModel) => updateOperationsStatus(budget.listeOperations);

export interface BudgetPageProps {
    onOpenMenu: () => void
}


/**
 * Composant principal de la page Budget.
 *
 * @param {BudgetPageProps} props - Les propriétés du composant BudgetPage.
 * @param {Function} props.onOpenMenu - Fonction pour ouvrir le menu.
 * @returns {JSX.Element} - Le composant JSX de la page Budget.
 *
 * @component
 *
 * @description
 * Ce composant gère l'affichage et les interactions de la page Budget. Le chargement du budget, la réinitialisation du contexte (compte / date),
 * le regroupement et les droits utilisateur sont portés par `useBudgetPageData` (commun avec `RecurrentsPage`) ; il charge ici les catégories
 * et les libellés. Il permet également de filtrer les opérations, de sélectionner
 * une opération et de créer une nouvelle opération.
 *
 * @remarks
 * Ce composant utilise plusieurs hooks React pour gérer l'état et les effets de bord, ainsi que des composants Material-UI pour l'interface utilisateur.
 */
export const BudgetPage: React.FC<BudgetPageProps> = ({ onOpenMenu }: BudgetPageProps): JSX.Element => {

    /** Etats pour la page Budget **/

    const { categories, setCategories } = useBudgetSelection();
    const { filtreOperations, setFiltreOperations } = useCurrentBudget();
    const {
        selectedCompte, selectedDate, currentBudget, currentOperation, setCurrentOperation,
        operationsGroupees: operationsGroupedByDateOperation, userDroits, handleBudgetUpdate
    } = useBudgetPageData({ groupOperations: groupOperationsByDate, prepareBudget: prepareBudgetOperations });


    /** Chargement des catégories au 1er démarrage **/
    const { data: categoriesChargees } = useFetch(() => fetchCategories(), []);

    /** Les catégories chargées alimentent le contexte **/
    useEffect(() => {
        if (categoriesChargees !== undefined) {
            setCategories(categoriesChargees);
        }
    }, [categoriesChargees, setCategories]);

    /** Opérations de la liste après filtrage texte + puces (compteur et net de la barre de résultat) **/
    const operationsFiltrees = useMemo(
        () => filterOperationsList(Object.values(operationsGroupedByDateOperation).flat(), filtreOperations.texte, filtreOperations),
        [operationsGroupedByDateOperation, filtreOperations]
    );

    /** Mise à jour du filtre texte (le filtre est conservé dans le Context : changement d'onglet) **/
    const handleFilterTexteChange = useCallback((texte: string) => {
        setFiltreOperations((filtre) => ({ ...filtre, texte }));
    }, [setFiltreOperations]);


    /** Rechargement des libellés si changement de compte ou de date **/
    const { data: libellesCharges } = useFetch(
        () => selectedCompte == null ? Promise.resolve([]) : fetchLibellesOperationsCompte(selectedCompte.id),
        [selectedCompte, selectedDate]);
    const listeLibellesOperations = libellesCharges ?? [];

    /**
     * Sélection d'une opération
     * @param operation opération
     */
    const handleOperationSelect = useCallback((operation: OperationModel) => {
        operation.mensualite ??= { periode: PERIODES_MENSUALITE_ENUM.PONCTUELLE, prochaineEcheance: -1 };
        setCurrentOperation(operation);
    }, [setCurrentOperation]);


    /**
     * Création d'une nouvelle opération
     */
    function handleButtonCreateClick() {
        setCurrentOperation(createNewOperation()); // Création d'une nouvelle opération}
    }

    /**
     * Render du budget
     */
    return (
        <BudgetPageShell
            className="page-container budget-page-container"
            isLoading={currentBudget == null}
            onOpenMenu={onOpenMenu}
            filterOperations={filtreOperations.texte}
            onFilterChange={handleFilterTexteChange}
            selectedCompte={selectedCompte}
            selectedDate={selectedDate}
            filterPlaceholder="Filtrage des opérations"
            filterBar={
                <OperationsFilterBar
                    filtre={filtreOperations}
                    onFiltreChange={setFiltreOperations}
                    operationsFiltrees={operationsFiltrees} />
            }
            additionalHeaderContentLeft={
                <Grid size={{ md: 2, xl: 1.6 }} sx={{ paddingLeft: 2, paddingRight: { xl: "24px" }, boxSizing: "border-box" }}>
                    {selectedDate != null && selectedCompte != null ?
                        <BudgetSoldes /> : <></>
                    }
                </Grid>
            }
            additionalHeaderContentRight={
                <Grid size={{ md: 1, xl: 1 }}>
                    {currentBudget == null ? <></> :
                        <BudgetActionsButtonGroupComponent
                            droits={[...userDroits, UTILISATEUR_DROITS.DROIT_CREATE_OPERATION]}
                            onActionBudgetChange={handleBudgetUpdate}
                            onActionOperationCreate={handleButtonCreateClick} />
                    }
                </Grid>
            }
            leftColumnSize={{ md: 4, xl: 4 }}
            rightColumnSize={{ md: 8, xl: 8 }}
            leftContent={
                /** Liste des opérations **/
                currentBudget == null ? <></>
                    :
                    <OperationsListe
                        operationGroupedByDate={operationsGroupedByDateOperation}
                        filterOperations={filtreOperations.texte}
                        filterPuces={filtreOperations}
                        onClick={handleOperationSelect}
                        selectedOperationId={currentOperation?.id} />
            }
            rightContent={
                currentBudget != null && currentOperation != null ?
                    <OperationDetailPage
                        listeCategories={categories}
                        listeLibellesOperations={listeLibellesOperations}
                        onOperationChange={handleBudgetUpdate} />
                    : <></>
            }
        />
    )
}
export default BudgetPage;
