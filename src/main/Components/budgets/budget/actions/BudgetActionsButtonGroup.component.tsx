import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    IconButton,
    Stack,
    Tooltip
} from '@mui/material';
import React, { JSX, useContext, useState } from 'react';

import { AddchartRounded, LockOpenRounded, LockRounded, RestartAltRounded } from "@mui/icons-material";
import { BudgetContext } from '../../../../Models/contextProvider/BudgetContextProvider';
import { ACTIONS_BUDGET_ENUM, UTILISATEUR_DROITS } from "../../../../Utils/AppBusinessEnums.constants";
import { getEventTargetId } from '../../../../Utils/OperationData.utils';
import { userHasPermission } from '../../../../Utils/UserData.utils';
import CenterComponent from '../../../CenterComponent';
import { BudgetActionsButtonGroupProps } from '../../../Components.props';
import { callReinitBudget, callReopenCloseBudget } from './BudgetActionsButtonGroup.extservices';


/**
 * Actions sur le budget
 * @param budget : Object budget en cours
 * @param droits : array liste des droits de l'utilsiateur
 * @param onActionBudgetChange : function callback lors d'une mise à jour sur le budget
 * @param onActionOperationCreate : function callback lors du click sur créer
 */

export const BudgetActionsButtonGroupComponent: React.FC<BudgetActionsButtonGroupProps> = ({ droits, onActionBudgetChange, onActionOperationCreate }: BudgetActionsButtonGroupProps): JSX.Element => {

    const { currentBudget } = useContext(BudgetContext)!;
    const budget = currentBudget!;
    const [showModale, setShowModale] = useState<boolean>(false);
    const [modaleContent, setModaleContent] = useState<{ title: string, question: string }>();
    const [actionEnCours, setActionEnCours] = useState<string>();



    /**
     * Action sur le bouton ou sur la modale
     * @param event : Event sur le bouton
     */
    function handleButtonsBudgetClick(event: any) {
        if (event.target.className !== "btn-close") {
            const action = getEventTargetId(event.target);
            if (action === ACTIONS_BUDGET_ENUM.CREATE) {
                onActionOperationCreate();
                return;
            }
            handleAction(action);
        } else {
            setShowModale(false);
        }
    }

    function handleAction(action: string) {
        let titrePopup = "";
        let questionPopup = "";
        let affichagePopup;

        switch (action) {
            case ACTIONS_BUDGET_ENUM.CLOSE_A_CONFIRMER:
                titrePopup = "Activité du budget";
                questionPopup = "Voulez vous vraiment " + (budget.actif ? "clôturer" : "réouvrir") + " le budget ?";
                affichagePopup = true;
                break;
            case ACTIONS_BUDGET_ENUM.REINIT_A_CONFIRMER:
                titrePopup = "Action sur le budget";
                questionPopup = "Voulez vous vraiment réinitialiser le budget ? \n Le budget précédent sera clôturé, et les opérations en cours seront reportées";
                affichagePopup = true;
                break;
            case ACTIONS_BUDGET_ENUM.ANNULER:
                affichagePopup = false;
                break;
            case ACTIONS_BUDGET_ENUM.CONFIRMER:
                affichagePopup = false;
                confirmAction();
                break;
        }

        setModaleContent({ title: titrePopup, question: questionPopup });
        setShowModale(affichagePopup ?? false);
        if (action !== null) {
            setActionEnCours(action);
        }
    }

    function confirmAction() {
        if (actionEnCours === ACTIONS_BUDGET_ENUM.CLOSE_A_CONFIRMER) {
            callReopenCloseBudget(budget.id, !budget.actif, onActionBudgetChange);
        } else if (actionEnCours === ACTIONS_BUDGET_ENUM.REINIT_A_CONFIRMER) {
            callReinitBudget(budget, onActionBudgetChange);
        }
    }




    /**
     *  RENDER
     */
    /** Groupe d'actions sur le budget **/
    return (
        <Stack direction={"row-reverse"} alignItems={"end"} onClick={handleButtonsBudgetClick}>
            {userHasPermission(droits, UTILISATEUR_DROITS.DROIT_CLOTURE_BUDGET) &&
                <Tooltip title={(budget.actif ? "Clôturer" : "Réouvrir") + " le budget"}>

                    {(budget.actif ?
                        <IconButton
                            className={"buttonsActionsBudget"} sx={{ backgroundColor: '#2e7d32' }}
                            id={ACTIONS_BUDGET_ENUM.CLOSE_A_CONFIRMER}>
                            <CenterComponent><LockOpenRounded id={ACTIONS_BUDGET_ENUM.CLOSE_A_CONFIRMER} /></CenterComponent>
                        </IconButton> :
                        <IconButton
                            className={"buttonsActionsBudget"} sx={{ backgroundColor: '#C70039' }}
                            id={ACTIONS_BUDGET_ENUM.CLOSE_A_CONFIRMER}>
                            <CenterComponent><LockRounded id={ACTIONS_BUDGET_ENUM.CLOSE_A_CONFIRMER} /></CenterComponent>
                        </IconButton>)}
                </Tooltip>
            }

            {budget.actif && userHasPermission(droits, UTILISATEUR_DROITS.DROIT_RAZ_BUDGET) &&
                <Tooltip title="Réinitialiser le budget">
                    <IconButton
                        className={"buttonsActionsBudget"} sx={{ backgroundColor: '#EDC109' }}
                        id={ACTIONS_BUDGET_ENUM.REINIT_A_CONFIRMER}>
                        <CenterComponent><RestartAltRounded id={ACTIONS_BUDGET_ENUM.REINIT_A_CONFIRMER} /></CenterComponent>
                    </IconButton>
                </Tooltip>
            }

            {budget.actif &&
                <Tooltip title="Créer une nouvelle opération">
                    <IconButton
                        className={"buttonsActionsBudget"} sx={{ backgroundColor: '#209ED8', marginX: '10px' }}
                        id={ACTIONS_BUDGET_ENUM.CREATE}>
                        <CenterComponent><AddchartRounded id={ACTIONS_BUDGET_ENUM.CREATE} /></CenterComponent>
                    </IconButton>
                </Tooltip>
            }
            <Dialog open={showModale}>
                <DialogTitle>{modaleContent?.title}</DialogTitle>
                <DialogContent>
                    <DialogContentText>{modaleContent?.question}</DialogContentText>
                </DialogContent>

                <DialogActions>
                    <Button variant={"outlined"} id={ACTIONS_BUDGET_ENUM.ANNULER} color="error">Annuler</Button>
                    <Button variant={"outlined"} id={ACTIONS_BUDGET_ENUM.CONFIRMER} color="success">Confirmer</Button>
                </DialogActions>
            </Dialog>

        </Stack>
    )
}
