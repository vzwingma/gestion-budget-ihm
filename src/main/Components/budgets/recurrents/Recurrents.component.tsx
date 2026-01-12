import React, {JSX, useCallback, useContext, useEffect, useState} from "react";

import {Box, CircularProgress, Divider, Grid, InputBase, Paper, useMediaQuery, useTheme} from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import RecurrentsTitre from "./RecurrentsTitre.component.tsx";
import BudgetMensuelModel from "../../../Models/budgets/BudgetMensuel.model.ts";
import OperationModel from "../../../Models/budgets/Operation.model.ts";
import {reloadBudget} from "./../budget/Budget.extservices.ts";
import {PERIODES_MENSUALITE_ENUM} from "../../../Utils/AppBusinessEnums.constants.ts";

import OperationsListe from "../operations/OperationsListe.component.tsx";
import OperationDetailPage from "../operations/detail/OperationDetailPage.component.tsx";
import {CancelRounded} from "@mui/icons-material";
import {getLabelFRFromDate} from "../../../Utils/Date.utils.ts";
import {getOperationsGroupedByPeriodicity} from "./Recurrents.controller.ts";
import { CenterComponent } from "../../CenterComponent.tsx";
import {getLibellesOperationsCompte} from "../operations/detail/OperationDetailPage.extservices.ts";
import {RecurrentsPageProps} from "../../Components.props.ts";
import {BudgetContext} from "../../../Models/contextProvider/BudgetContextProvider.tsx";
import LibelleCategorieOperationModel from "../../../Models/budgets/LibelleCategorieOperation.model.ts";


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

    const { currentBudget, setCurrentBudget, currentOperation, setCurrentOperation, selectedCompte, selectedDate, categories } = useContext(BudgetContext);

    const [operationsGroupedByPeriodicity, setOperationsGroupedByPeriodicity] = useState<{ [key: string]: OperationModel[] }>({});
    const [filterOperations, setFilterOperations] = useState<string | null>(null);
    const [listeLibellesOperations, setListeLibellesOperations] = useState<LibelleCategorieOperationModel[]>([]);

    const isMobile = useMediaQuery(useTheme().breakpoints.down('lg'));
    const listHeight = isMobile ? window.innerHeight - 95 : window.innerHeight - 140;



    /** Callback de mise à jour du budget **/
    const handleBudgetUpdate = useCallback((budget: BudgetMensuelModel) => {
        console.log("(Re)Chargement du budget", budget.id, ":", budget.listeOperations.length + " opérations");
        setCurrentBudget(budget);
        setOperationsGroupedByPeriodicity(getOperationsGroupedByPeriodicity(budget.listeOperations));
        console.log("Chargement du budget correctement effectué");
    }, [setCurrentBudget, setOperationsGroupedByPeriodicity]);



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
        operation.mensualite ??= { periode: PERIODES_MENSUALITE_ENUM.PONCTUELLE };
        setCurrentOperation(operation);
    }


    /**
     * Render du budget
     */
    return (
        <Box className="page-container recurrents-page-container">
            <Grid container marginTop={1} sx={{overflow: "hidden"}}>
                <Grid size={{md: 0.6, xl: 0.4}} sx={{justifyContent: 'center', alignItems: 'center', display: 'flex'}}>
                    <MenuIcon onClick={onOpenMenu}
                        className={"editableField"}
                        fontSize={"large"} />
                </Grid>
                <Grid size={{md: 2.8, xl: 2}} sx={{justifyContent: 'center', alignItems: 'center', display: 'flex'}}>
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
                            value={filterOperations}
                            size={isMobile ? "small" : "medium"}

                        />
                        <CancelRounded sx={{
                            color: "#D0D0D0",
                            cursor: "pointer",
                            width: isMobile ? "16px" : "20px",
                            height: isMobile ? "16px" : "20px"
                        }}
                                       onClick={() => setFilterOperations("")}/>

                    </Paper>
                </Grid>

                <Grid size={{md: 6, xl: 7}} sx={{justifyContent: 'center', alignItems: 'center', display: 'flex'}}>
                    { /** Titre **/}
                    {selectedDate != null && selectedCompte != null ?
                        <RecurrentsTitre />
                        :
                        <CenterComponent><CircularProgress /></CenterComponent>
                    }
                </Grid>
            </Grid>
            <Divider variant="middle" sx={{marginTop: isMobile ? 0 : 1}}/>
            <Grid container sx={{overflow: "hidden"}}>
                <Grid size={{md: 5, xl: 4}} direction={"column"} sx={{overflow: "hidden"}} maxHeight={'true'}>
                    { /** Liste des opérations **/
                        (currentBudget == null ?
                            <CenterComponent><CircularProgress /></CenterComponent>
                            :
                            <OperationsListe
                                operationGroupedByDate={operationsGroupedByPeriodicity}
                                filterOperations={filterOperations}
                                onClick={handleOperationSelect} />
                        )
                    }
                </Grid>
                <Grid size={{md: 7, xl: 8}} sx={{overflow: "hidden", height: listHeight}}>
                    {currentBudget != null && currentOperation != null ?
                        /** Affichage d'une opération **/
                        <OperationDetailPage
                            listeCategories={categories}
                            listeLibellesOperations={listeLibellesOperations}
                            onOperationChange={handleBudgetUpdate} />
                        : <></>
                    }
                </Grid>
            </Grid>
        </Box>
    )
}
export default RecurrentsPage;
