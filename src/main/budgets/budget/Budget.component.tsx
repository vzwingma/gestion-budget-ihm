import React, { useEffect, useState } from "react";

import Grid2 from "@mui/material/Unstable_Grid2";
import BudgetTitre from "./BudgetTitre.component";
import { Box, CircularProgress, Divider, InputBase, Paper } from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import { CancelRounded } from "@mui/icons-material";
import CompteBancaireModel from "../../Models/CompteBancaire.model";
import BudgetMensuelModel from "../../Models/BudgetMensuel.model";
import OperationModel from "../../Models/Operation.model";
import { getPreferenceUtilisateur, loadCategories, reloadBudget } from "./Budget.extservices";
import { createNewOperation, handleBudgetUpdate } from "./Budget.controller";
import { PERIODES_MENSUALITE_ENUM } from "../../Utils/AppBusinessEnums.constants";

interface BudgetPageProps {
    selectedCompte: CompteBancaireModel | null
    selectedDate: Date
    listeComptes: CompteBancaireModel[]
    onOpenMenu: () => void
}

/**
 * Page principale des budgets
 * @param selectedCompte : object compte sélectionné
 * @param selectedDate : object date sélectionnée
 * @param listeComptes : array liste des comptes
 * @param onOpenMenu : function callback d'ouverture du menu
 */
export const BudgetPage: React.FC<BudgetPageProps> = ({ selectedCompte, selectedDate, listeComptes, onOpenMenu }: BudgetPageProps): JSX.Element => {

    /** Etats pour la page Budget **/

    const [currentBudget, setCurrentBudget] = useState<BudgetMensuelModel>();
    const [currentOperation, setCurrentOperation] = useState<OperationModel>();
    const [operationsGroupedByDateOperation, setOperationsGroupedByDateOperation] = useState<Map<string, OperationModel[]>>();
    const [filterOperations, setFilterOperations] = useState<string | null>(null);
    const [categories, setCategories] = useState<string[]>();
    const [userDroits, setUserDroits] = useState<string[]>([]);
    const [userPreferences, setUserPreferences] = useState<string[]>([]);




    /** Chargement des catégories et des préférences utilisateurs au 1er démarrage **/
    useEffect(() => {
        loadCategories(handleCategoriesLoaded);
        getPreferenceUtilisateur(setUserDroits, setUserPreferences);
    }
        , []);

    /** Mise à jour du budget si changement de compte ou de date **/
    useEffect(() => {
        console.log("[TRIGGER] Context selectedCompte=", selectedCompte, " selectedDate=", selectedDate)
        reloadBudget(selectedCompte, selectedDate);
    }, [selectedCompte, selectedDate])

    /** Chargement des catégories **/
    function handleCategoriesLoaded(categories: string[]) {
        console.log("Chargement de " + categories.length + " catégories");
        setCategories(categories);
    }



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
            operation.mensualite = { periode: PERIODES_MENSUALITE_ENUM.at(0) }
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
                <Grid2 md={0.33}>
                    <MenuIcon onClick={onOpenMenu}
                        className={"editableField"}
                        fontSize={"large"} />
                </Grid2>
                <Grid2 md={3} paddingTop={"6px"}>
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
                <Grid2 md={1.5} />
                <Grid2 md={6.1}>
                    { /** Titre **/}
                    {currentBudget != null && selectedCompte != null ?
                        <BudgetTitre currentCompte={selectedCompte}
                            currentDate={selectedDate}
                            currentBudget={currentBudget} /> : <CircularProgress />
                    }
                </Grid2>
                <Grid2 md={1}>
                    {/** Actions sur le budget (close / reinit) **/
                        (currentBudget != null && userDroits != null) ?
                            <BudgetActionsButtonGroupComponent budget={currentBudget}
                                droits={userDroits}
                                onActionBudgetChange={handleBudgetUpdate}
                                onActionOperationCreate={handleButtonCreateClick} /> :
                            <CircularProgress />
                    }
                </Grid2>
            </Grid2>
            <Divider variant="middle" sx={{ margin: 1 }} />
            <Grid2 container sx={{ overflow: "hidden" }}>
                <Grid2 md={4} direction={"column"} sx={{ overflow: "hidden" }} maxHeight={'true'}>
                    { /** Liste des opérations **/
                        (currentBudget != null ?
                            <OperationsListe
                                operationGroupedByDate={operationsGroupedByDateOperation}
                                filterOperations={filterOperations}
                                listeComptes={listeComptes}
                                onClick={handleOperationSelect} />
                            :
                            <CircularProgress />
                        )
                    }
                </Grid2>
                <Grid2 md={8} sx={{ overflow: "hidden", height: window.innerHeight - 175 }}>
                    {currentBudget != null && currentOperation != null ?
                        /** Affichage d'une opération **/
                        <OperationDetailPage operation={currentOperation}
                            budget={currentBudget}
                            listeCategories={categories}
                            listeComptes={listeComptes}
                            onOperationChange={handleBudgetUpdate} />
                        : <></>
                    }
                </Grid2>
            </Grid2>
        </Box>
    )
}
export default BudgetPage;