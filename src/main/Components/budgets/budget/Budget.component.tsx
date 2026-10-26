import React, { JSX, useCallback, useEffect, useMemo } from "react";

import { Grid } from "@mui/material";
import BudgetMensuelModel from "../../../Models/budgets/BudgetMensuel.model.ts";
import OperationModel, { createNewOperation } from "../../../Models/budgets/Operation.model.ts";
import { fetchBudget, fetchCategories, fetchPreferenceUtilisateur } from "./Budget.extservices.ts";
import { PERIODES_MENSUALITE_ENUM, UTILISATEUR_DROITS } from "../../../Utils/AppBusinessEnums.constants.ts";
import { BudgetActionsButtonGroupComponent } from "./actions/BudgetActionsButtonGroup.component.tsx";
import OperationsListe from "../operations/OperationsListe.component.tsx";
import OperationDetailPage from "../operations/courantes/detail/OperationDetailPage.component.tsx";
import { getOperationsGroupedByDateOperation, updateOperationsStatus } from "./Budget.controller.ts";
import { fetchLibellesOperationsCompte } from "../operations/courantes/detail/OperationDetailPage.extservices.ts";
import { BudgetPageProps } from "../../Components.props.tsx";
import { useBudgetContext } from "../../../Models/contextProvider/BudgetContextProvider.tsx";
import { useFetch } from "../../../hooks/useFetch.ts";
import BudgetSoldes from "./BudgetSoldes.component.tsx";
import BudgetPageShell from "../shared/BudgetPageShell.component.tsx";
import { debug } from "../../../Utils/Debug.utils.ts";
import { getLabelFRFromDate } from "../../../Utils/Date.utils.ts";
import OperationsFilterBar from "../shared/OperationsFilterBar.component.tsx";
import { filterOperationsList } from "../operations/OperationsListe.shared.tsx";


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
 * Ce composant gère l'affichage et les interactions de la page Budget. Il charge les catégories et les préférences utilisateur au démarrage,
 * et met à jour le budget lorsque le compte ou la date sélectionnée change. Il permet également de filtrer les opérations, de sélectionner
 * une opération et de créer une nouvelle opération.
 *
 * @remarks
 * Ce composant utilise plusieurs hooks React pour gérer l'état et les effets de bord, ainsi que des composants Material-UI pour l'interface utilisateur.
 */
export const BudgetPage: React.FC<BudgetPageProps> = ({ onOpenMenu }: BudgetPageProps): JSX.Element => {

    /** Etats pour la page Budget **/

    const { currentBudget, setCurrentBudget, currentOperation, setCurrentOperation, selectedCompte, selectedDate, categories, setCategories, filtreOperations, setFiltreOperations } = useBudgetContext();


    /** Chargement des catégories et des préférences utilisateurs au 1er démarrage **/
    const { data: categoriesChargees } = useFetch(() => fetchCategories(), []);
    const { data: userDroitsCharges } = useFetch(() => fetchPreferenceUtilisateur(), []);
    const userDroits: UTILISATEUR_DROITS[] = userDroitsCharges ?? [];

    /** Les catégories chargées alimentent le contexte **/
    useEffect(() => {
        if (categoriesChargees !== undefined) {
            setCategories(categoriesChargees);
        }
    }, [categoriesChargees, setCategories]);

    /** Callback de mise à jour du budget **/
    const handleBudgetUpdate = useCallback((budget: BudgetMensuelModel) => {
        // Compatibilité des opérations sur le statut en retard
        updateOperationsStatus(budget.listeOperations);
        setCurrentBudget(budget);
        debug("Chargement du budget correctement effectué");
    }, [setCurrentBudget]);

    /** Regroupement des opérations par date, dérivé du budget courant **/
    const operationsGroupedByDateOperation = useMemo(
        () => currentBudget == null ? {} : getOperationsGroupedByDateOperation(currentBudget.listeOperations),
        [currentBudget]
    );

    /** Opérations de la liste après filtrage texte + puces (compteur et net de la barre de résultat) **/
    const operationsFiltrees = useMemo(
        () => filterOperationsList(Object.values(operationsGroupedByDateOperation).flat(), filtreOperations.texte, filtreOperations),
        [operationsGroupedByDateOperation, filtreOperations]
    );

    /** Mise à jour du filtre texte (le filtre est conservé dans le Context : changement d'onglet) **/
    const handleFilterTexteChange = useCallback((texte: string) => {
        setFiltreOperations((filtre) => ({ ...filtre, texte }));
    }, [setFiltreOperations]);


    /** Rechargement du budget et des libellés si changement de compte ou de date **/
    const { data: budgetCharge } = useFetch(() => fetchBudget(selectedCompte, selectedDate), [selectedCompte, selectedDate]);
    const { data: libellesCharges } = useFetch(
        () => selectedCompte == null ? Promise.resolve([]) : fetchLibellesOperationsCompte(selectedCompte.id),
        [selectedCompte, selectedDate]);
    const listeLibellesOperations = libellesCharges ?? [];

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
