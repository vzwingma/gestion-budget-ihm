import React, {useEffect, useState} from "react";

import {Box, CircularProgress, Divider, Grid2, InputBase, Paper} from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import BudgetTitre from "./BudgetTitre.component";
import CompteBancaireModel from "../../../Models/CompteBancaire.model";
import BudgetMensuelModel from "../../../Models/BudgetMensuel.model";
import OperationModel, {createNewOperation} from "../../../Models/Operation.model";
import {getPreferenceUtilisateur, loadCategories, reloadBudget} from "./Budget.extservices";
import {PERIODES_MENSUALITE_ENUM, UTILISATEUR_DROITS} from "../../../Utils/AppBusinessEnums.constants";
import {BudgetActionsButtonGroupComponent} from "./actions/BudgetActionsButtonGroup.component";
import OperationsListe from "../operations/OperationsListe.component";
import OperationDetailPage from "../operations/detail/OperationDetailPage.component";
import {CancelRounded} from "@mui/icons-material";
import CategorieOperationModel from "@/Models/CategorieOperation.model";
import {getLabelFromDate} from "../../../Utils/Date.utils";
import {getOperationsGroupedByDateOperation} from "./Budget.controller";
import CenterComponent from "../../CenterComponent";
import { getLibellesOperation } from "../operations/detail/OperationDetailPage.extservices";

interface BudgetPageProps {
    selectedCompte: CompteBancaireModel | null
    selectedDate: Date
    listeComptes: CompteBancaireModel[]
    onOpenMenu: () => void
}

export const BudgetPage: React.FC<BudgetPageProps> = ({ selectedCompte, selectedDate, listeComptes, onOpenMenu }: BudgetPageProps): JSX.Element => {

    /** Etats pour la page Budget **/

    const [currentBudget, setCurrentBudget] = useState<BudgetMensuelModel>();
    const [currentOperation, setCurrentOperation] = useState<OperationModel | null>(null);
    const [operationsGroupedByDateOperation, setOperationsGroupedByDateOperation] = useState<{ [key: string]: OperationModel[] }>({});
    const [filterOperations, setFilterOperations] = useState<string | null>(null);
    const [categories, setCategories] = useState<CategorieOperationModel[]>([]);
    const [userDroits, setUserDroits] = useState<UTILISATEUR_DROITS[]>([]);
    const [, setUserPreferences] = useState<string[]>([]);
    const [listeLibellesOperations, setListeLibellesOperation] = useState<string[]>([]);

        
    /** Chargement des catégories et des préférences utilisateurs au 1er démarrage **/
    useEffect(() => {
        loadCategories(handleCategoriesLoaded);
        getPreferenceUtilisateur(setUserDroits, setUserPreferences);
    } , []);

    /** Mise à jour du budget si changement de compte ou de date **/
    useEffect(() => {
        console.log("[TRIGGER] Context selectedCompte :", selectedCompte?.id, "selectedDate :", getLabelFromDate(selectedDate))
        reloadBudget(handleBudgetUpdate, selectedCompte, selectedDate);
        if(selectedCompte != null){
            getLibellesOperation(selectedCompte.id, setListeLibellesOperation);
        }
    }, [selectedCompte, selectedDate])


    /**
     *  Fonction appelée lorsque le budget est mis à jour.
     *
     * @param {BudgetMensuelModel} budget - Le modèle de budget mensuel à jour
     */
    function handleBudgetUpdate(budget: BudgetMensuelModel) {
        console.log("(Re)Chargement du budget", budget.id, budget.listeOperations.length + " opérations");
        setCurrentBudget(budget);
        setOperationsGroupedByDateOperation(getOperationsGroupedByDateOperation(budget.listeOperations));
        console.log("Chargement du budget correctement effectué");
    }


    /**
     * Gère le chargement des catégories.
     *
     * @param {CategorieOperationModel[]} categories - La liste des catégories chargées.
     */
    function handleCategoriesLoaded(categories: CategorieOperationModel[]) {
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
            operation.mensualite = { periode: PERIODES_MENSUALITE_ENUM[0] };
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
                <Grid2 size={{md: 0.33}}>
                    <MenuIcon onClick={onOpenMenu}
                        className={"editableField"}
                        fontSize={"large"} />
                </Grid2>
                <Grid2 size={{md: 3}} paddingTop={"6px"}>
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
                <Grid2 size={{md: 1.5}}/>
                <Grid2 size={{md: 6.1}}>
                    { /** Titre **/}
                    {currentBudget != null && selectedCompte != null ?
                        <BudgetTitre currentCompte={selectedCompte}
                            currentDate={selectedDate}
                            currentBudget={currentBudget} /> : <CenterComponent><CircularProgress /></CenterComponent>
                    }
                </Grid2>
                <Grid2 size={{md: 1}}>
                    {/** Actions sur le budget (close / reinit) **/
                        (currentBudget != null) ?
                            <BudgetActionsButtonGroupComponent
                                budget={currentBudget}
                                droits={userDroits}
                                onActionBudgetChange={handleBudgetUpdate}
                                onActionOperationCreate={handleButtonCreateClick} /> :
                            <CenterComponent><CircularProgress /></CenterComponent>
                    }
                </Grid2>
            </Grid2>
            <Divider variant="middle" sx={{ margin: 1 }} />
            <Grid2 container sx={{ overflow: "hidden" }}>
                <Grid2 size={{md: 4}} direction={"column"} sx={{overflow: "hidden"}} maxHeight={'true'}>
                    { /** Liste des opérations **/
                        (currentBudget != null ?
                            <OperationsListe
                                operationGroupedByDate={operationsGroupedByDateOperation}
                                filterOperations={filterOperations}
                                listeComptes={listeComptes}
                                onClick={handleOperationSelect} />
                            :
                            <CenterComponent><CircularProgress /></CenterComponent>
                        )
                    }
                </Grid2>
                <Grid2 size={{md: 8}} sx={{overflow: "hidden", height: window.innerHeight - 175}}>
                    {currentBudget != null && currentOperation != null ?
                        /** Affichage d'une opération **/
                        <OperationDetailPage operation={currentOperation}
                                            budget={currentBudget}
                                            listeCategories={categories}
                                            listeComptes={listeComptes}
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
