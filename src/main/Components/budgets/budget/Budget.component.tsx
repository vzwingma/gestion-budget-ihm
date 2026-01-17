import React, { JSX, useCallback, useContext, useEffect, useState } from "react";

import { Box, CircularProgress, Divider, Grid, useMediaQuery, useTheme } from "@mui/material";
import BudgetMensuelModel from "../../../Models/budgets/BudgetMensuel.model.ts";
import OperationModel, { createNewOperation } from "../../../Models/budgets/Operation.model.ts";
import { getPreferenceUtilisateur, loadCategories, reloadBudget } from "./Budget.extservices.ts";
import { PERIODES_MENSUALITE_ENUM, UTILISATEUR_DROITS } from "../../../Utils/AppBusinessEnums.constants.ts";
import { BudgetActionsButtonGroupComponent } from "./actions/BudgetActionsButtonGroup.component.tsx";
import OperationsListe from "../operations/OperationsListe.component.tsx";
import OperationDetailPage from "../operations/courantes/detail/OperationDetailPage.component.tsx";
import { getLabelFRFromDate } from "../../../Utils/Date.utils.ts";
import { getOperationsGroupedByDateOperation, updateOperationsStatus } from "./Budget.controller.ts";
import { CenterComponent } from "../../CenterComponent.tsx";
import { getLibellesOperationsCompte } from "../operations/courantes/detail/OperationDetailPage.extservices.ts";
import { BudgetPageProps } from "../../Components.props.tsx";
import { BudgetContext } from "../../../Models/contextProvider/BudgetContextProvider.tsx";
import CategorieOperationModel from "../../../Models/budgets/CategorieOperation.model.ts";
import LibelleCategorieOperationModel from "../../../Models/budgets/LibelleCategorieOperation.model.ts";
import BudgetSoldes from "./BudgetSoldes.component.tsx";
import BudgetPageHeader from "../shared/BudgetPageHeader.component.tsx";


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

    const { currentBudget, setCurrentBudget, currentOperation, setCurrentOperation, selectedCompte, selectedDate, categories, setCategories } = useContext(BudgetContext);

    const [operationsGroupedByDateOperation, setOperationsGroupedByDateOperation] = useState<{ [key: string]: OperationModel[] }>({});
    const [filterOperations, setFilterOperations] = useState<string | null>(null);
    const [userDroits, setUserDroits] = useState<UTILISATEUR_DROITS[]>([]);
    const [listeLibellesOperations, setListeLibellesOperations] = useState<LibelleCategorieOperationModel[]>([]);

    const isMobile = useMediaQuery(useTheme().breakpoints.down('lg'));
    const listHeight = isMobile ? window.innerHeight - 95 : window.innerHeight - 140;

    /** Callback de chargement des catégories **/
    const handleLoadCategories = useCallback((categories: CategorieOperationModel[]) => {
        console.log("Chargement de " + categories.length + " catégories");
        setCategories(categories);
    }, [setCategories]);

    /** Chargement des catégories et des préférences utilisateurs au 1er démarrage **/
    useEffect(() => {
        loadCategories(handleLoadCategories);
        getPreferenceUtilisateur(setUserDroits);
    }, [handleLoadCategories]);

    /** Callback de mise à jour du budget **/
    const handleBudgetUpdate = useCallback((budget: BudgetMensuelModel) => {
        console.log("(Re)Chargement du budget", budget.id, ":", budget.listeOperations.length + " opérations");
        setCurrentBudget(budget);

        // Compatibilité des opérations sur le statut en retard
        updateOperationsStatus(budget.listeOperations);

        setOperationsGroupedByDateOperation(getOperationsGroupedByDateOperation(budget.listeOperations));
        console.log("Chargement du budget correctement effectué");
    }, [setCurrentBudget, setOperationsGroupedByDateOperation]);



    /** Mise à jour du budget si changement de compte ou de date **/
    useEffect(() => {
        console.log("[TRIGGER] Context selectedCompte :", selectedCompte?.id, "selectedDate :", getLabelFRFromDate(selectedDate))
        setCurrentBudget(undefined);
        reloadBudget(handleBudgetUpdate, selectedCompte, selectedDate);
        if (selectedCompte != null) {
            getLibellesOperationsCompte(selectedCompte.id, setListeLibellesOperations);
        }
        setCurrentOperation(null);
    }, [selectedCompte, selectedDate, handleBudgetUpdate, setCurrentOperation, setCurrentBudget]);

    /**
     * Sélection d'une opération
     * @param operation opération
     */
    function handleOperationSelect(operation: OperationModel) {
        operation.mensualite ??= { periode: PERIODES_MENSUALITE_ENUM.PONCTUELLE, prochaineEcheance: -1 };
        setCurrentOperation(operation);
    }


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
        <Box className="page-container budget-page-container">
            <BudgetPageHeader
                onOpenMenu={onOpenMenu}
                filterOperations={filterOperations}
                onFilterChange={setFilterOperations}
                selectedCompte={selectedCompte}
                selectedDate={selectedDate}
                filterPlaceholder="Filtrage des opérations"
                additionalHeaderContentLeft={
                    <Grid size={{ md: 1.6, xl: 1.6 }}>
                        {selectedDate != null && selectedCompte != null ?
                            <BudgetSoldes />
                            :
                            <CenterComponent><CircularProgress /></CenterComponent>
                        }
                    </Grid>
                }
                additionalHeaderContentRight={
                    <Grid size={{ md: 1, xl: 1 }}>
                        {currentBudget == null ?
                            <CenterComponent><CircularProgress /></CenterComponent> :
                            <BudgetActionsButtonGroupComponent
                                droits={[...userDroits, UTILISATEUR_DROITS.DROIT_CREATE_OPERATION]}
                                onActionBudgetChange={handleBudgetUpdate}
                                onActionOperationCreate={handleButtonCreateClick} />
                        }
                    </Grid>
                }
            />
            <Divider variant="middle" sx={{ marginTop: isMobile ? 0 : 1 }} />
            <Grid container sx={{ overflow: "hidden" }}>
                <Grid size={{ md: 5, xl: 4 }} direction={"column"} sx={{ overflow: "hidden" }} maxHeight={'true'}>
                    { /** Liste des opérations **/
                        (currentBudget == null ?
                            <CenterComponent><CircularProgress /></CenterComponent>
                            :
                            <OperationsListe
                                operationGroupedByDate={operationsGroupedByDateOperation}
                                filterOperations={filterOperations}
                                onClick={handleOperationSelect} 
                                selectedOperationId={currentOperation?.id}/>
                        )
                    }
                </Grid>
                <Grid size={{ md: 7, xl: 8 }} sx={{ overflow: "hidden", height: listHeight }}>
                    {currentBudget != null && currentOperation != null ?
                        <OperationDetailPage
                            listeCategories={categories}
                            listeLibellesOperations={listeLibellesOperations}
                            onOperationChange={handleBudgetUpdate} />
                    : <></>                      }
                </Grid>
            </Grid>
        </Box>
    )
}
export default BudgetPage;
