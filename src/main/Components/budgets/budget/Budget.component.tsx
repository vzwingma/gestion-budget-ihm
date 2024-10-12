import React, {useCallback, useContext, useEffect, useState} from "react";

import {Box, CircularProgress, Divider, Grid2, InputBase, Paper} from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import BudgetTitre from "./BudgetTitre.component";
import BudgetMensuelModel from "../../../Models/budgets/BudgetMensuel.model";
import OperationModel, {createNewOperation} from "../../../Models/budgets/Operation.model";
import {getPreferenceUtilisateur, loadCategories, reloadBudget} from "./Budget.extservices";
import {PERIODES_MENSUALITE_ENUM, UTILISATEUR_DROITS} from "../../../Utils/AppBusinessEnums.constants";
import {BudgetActionsButtonGroupComponent} from "./actions/BudgetActionsButtonGroup.component";
import OperationsListe from "../operations/OperationsListe.component";
import OperationDetailPage from "../operations/detail/OperationDetailPage.component";
import {CancelRounded} from "@mui/icons-material";
import {getLabelFromDate} from "../../../Utils/Date.utils";
import {getOperationsGroupedByDateOperation} from "./Budget.controller";
import CenterComponent from "../../CenterComponent";
import {getLibellesOperation} from "../operations/detail/OperationDetailPage.extservices";
import {BudgetPageProps} from "../../Components.props";
import {BudgetContext} from "../../../Models/contextProvider/BudgetContextProvider";
import CategorieOperationModel from "../../../Models/budgets/CategorieOperation.model";


/**
 * Composant principal de la page Budget.
 *
 * @param {BudgetPageProps} props - Les propriétés du composant BudgetPage.
 * @param {Object} props.selectedCompte - Le compte sélectionné.
 * @param {Date} props.selectedDate - La date sélectionnée.
 * @param {Array} props.listeComptes - La liste des comptes disponibles.
 * @param {Function} props.onOpenMenu - Fonction pour ouvrir le menu.
 * @returns {JSX.Element} - Le composant JSX de la page Budget.
 *
 * @component
 *
 * @example
 * <BudgetPage
 *   selectedCompte={selectedCompte}
 *   selectedDate={selectedDate}
 *   listeComptes={listeComptes}
 *   onOpenMenu={onOpenMenu}
 * />
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

    const { currentBudget, setCurrentBudget, currentOperation, setCurrentOperation, selectedCompte, selectedDate, categories, setCategories } = useContext(BudgetContext)!;

    const [operationsGroupedByDateOperation, setOperationsGroupedByDateOperation] = useState<{ [key: string]: OperationModel[] }>({});
    const [filterOperations, setFilterOperations] = useState<string | null>(null);
    const [userDroits, setUserDroits] = useState<UTILISATEUR_DROITS[]>([]);
    const [listeLibellesOperations, setListeLibellesOperations] = useState<string[]>([]);


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
        setOperationsGroupedByDateOperation(getOperationsGroupedByDateOperation(budget.listeOperations));
        console.log("Chargement du budget correctement effectué");
    }, [setCurrentBudget, setOperationsGroupedByDateOperation]);



    /** Mise à jour du budget si changement de compte ou de date **/
    useEffect(() => {
        console.log("[TRIGGER] Context selectedCompte :", selectedCompte?.id, "selectedDate :", getLabelFromDate(selectedDate))
        reloadBudget(handleBudgetUpdate, selectedCompte, selectedDate);
        if (selectedCompte != null) {
            getLibellesOperation(selectedCompte.id, setListeLibellesOperations);
        }
        setCurrentOperation(null);
    }, [selectedCompte, selectedDate, handleBudgetUpdate, setCurrentOperation]);



    /**
     * Callback de filtre d'opération
     * @param event event
     */
    function handleOperationFilter(event: any) {
        setFilterOperations(event.target.value);
    }

    /**
     * Sélection d'une opération
     * @param operation opération
     */
    function handleOperationSelect(operation: OperationModel) {
        if (operation.mensualite == null) {
            operation.mensualite = { periode: PERIODES_MENSUALITE_ENUM.PONCTUELLE };
        }
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
        <Box sx={{ overflow: "hidden" }} maxHeight={'true'}>
            <Grid2 container marginTop={1} sx={{ overflow: "hidden" }}>
                <Grid2 size={{ md: 0.33 }}>
                    <MenuIcon onClick={onOpenMenu}
                        className={"editableField"}
                        fontSize={"large"} />
                </Grid2>
                <Grid2 size={{ md: 3 }} paddingTop={"6px"}>
                    <Paper component="form"
                        sx={{
                            p: '2px 4px',
                            display: 'flex',
                            alignItems: 'center',
                            width: '100%',
                            paddingRight: "10px"
                        }}>
                        <InputBase
                            sx={{ ml: 1, flex: 1, color: "#808080" }}
                            placeholder="Filtrage des opérations"
                            inputProps={{ 'aria-label': 'Filtrage des opérations' }}
                            onChange={handleOperationFilter}
                        />
                        <CancelRounded sx={{ color: "#D0D0D0", cursor: "pointer" }}
                            onClick={() => setFilterOperations(null)} />

                    </Paper>
                </Grid2>
                <Grid2 size={{ md: 1.5 }} />
                <Grid2 size={{ md: 6.1 }}>
                    { /** Titre **/}
                    {currentBudget != null && selectedCompte != null ?
                        <BudgetTitre />
                        :
                        <CenterComponent><CircularProgress /></CenterComponent>
                    }
                </Grid2>
                <Grid2 size={{ md: 1 }}>
                    {/** Actions sur le budget (close / reinit) **/
                        (currentBudget != null) ?
                            <BudgetActionsButtonGroupComponent
                                droits={userDroits}
                                onActionBudgetChange={handleBudgetUpdate}
                                onActionOperationCreate={handleButtonCreateClick} /> :
                            <CenterComponent><CircularProgress /></CenterComponent>
                    }
                </Grid2>
            </Grid2>
            <Divider variant="middle" sx={{ margin: 1 }} />
            <Grid2 container sx={{ overflow: "hidden" }}>
                <Grid2 size={{ md: 4 }} direction={"column"} sx={{ overflow: "hidden" }} maxHeight={'true'}>
                    { /** Liste des opérations **/
                        (currentBudget != null ?
                            <OperationsListe
                                operationGroupedByDate={operationsGroupedByDateOperation}
                                filterOperations={filterOperations}
                                onClick={handleOperationSelect} />
                            :
                            <CenterComponent><CircularProgress /></CenterComponent>
                        )
                    }
                </Grid2>
                <Grid2 size={{ md: 8 }} sx={{ overflow: "hidden", height: window.innerHeight - 175 }}>
                    {currentBudget != null && currentOperation != null ?
                        /** Affichage d'une opération **/
                        <OperationDetailPage
                            listeCategories={categories}
                            listeLibellesOperations={listeLibellesOperations}
                            onOperationChange={handleBudgetUpdate} />
                        : <></>
                    }
                </Grid2>
            </Grid2>
        </Box>
    )
}
export default BudgetPage;
