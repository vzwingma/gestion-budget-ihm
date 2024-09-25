import React, {useState} from 'react';
import {
    Button,
    ButtonGroup,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    IconButton,
    Stack,
    Tooltip
} from '@mui/material';

import {UTILISATEUR_DROITS} from "../../../../Utils/AppBusinessEnums.constants";
import {AddchartRounded, LockOpenRounded, LockRounded, RestartAltRounded} from "@mui/icons-material";
import BudgetMensuelModel from '@/src/main/Models/BudgetMensuel.model';
import CenterComponent from '../../../CenterComponent';
import { getEventTargetId } from '@/src/main/Utils/DataUtils.utils';
import { callReinitBudget, callReopenCloseBudget } from './BudgetActionsButtonGroup.extservices';


interface BudgetActionsButtonGroupProps{
    budget : BudgetMensuelModel
    droits : UTILISATEUR_DROITS[]
    onActionBudgetChange : Function
    onActionOperationCreate : Function
}

/**
 * Actions sur le budget
 * @param budget : Object budget en cours
 * @param droits : array liste des droits de l'utilsiateur
 * @param onActionBudgetChange : function callback lors d'une mise à jour sur le budget
 * @param onActionOperationCreate : function callback lors du click sur créer
 */

export const BudgetActionsButtonGroupComponent: React.FC<BudgetActionsButtonGroupProps> = ({ budget, droits, onActionBudgetChange, onActionOperationCreate }: BudgetActionsButtonGroupProps): JSX.Element => {


    const [showModale, setShowModale] = useState<boolean>(false);
    const [modaleContent, setModaleContent] = useState<{title: string, question: string}>();
    const [action, setAction] = useState<string>();


/**
 * Action sur le bouton ou sur la modale
 * @param event : Event sur le bouton
 */
function handleButtonsBudgetClick(event: any) {

    if (event.target.className !== "btn-close") {
        let action = getEventTargetId(event.target);
        let titrePopup = "";
        let questionPopup = "";
        let affichagePopup = false;
        if (action === "CREATE") {
            onActionOperationCreate()
            return
        } else if (action === "CLOSE_A_CONFIRMER") {
            titrePopup = "Activité du budget";
            questionPopup = "Voulez vous vraiment " + (budget.actif ? "clôturer" : "réouvrir") + " le budget ?";
            affichagePopup = true;
        } else if (action === "REINIT_A_CONFIRMER") {
            titrePopup = "Action sur le budget";
            questionPopup = "Voulez vous vraiment réinitialiser le budget ? \n Le budget précédent sera clôturé, et les opérations en cours seront reportées";
            affichagePopup = true;
        } else if (action === "ANNULER") {
            affichagePopup = false;
        } else if (action === "CONFIRMER") {
            affichagePopup = false;
            if (action === "CLOSE_A_CONFIRMER") {
                callReopenCloseBudget(budget.id, !budget.actif, onActionBudgetChange)
            } else if (action === "REINIT_A_CONFIRMER") {
                callReinitBudget(budget, onActionBudgetChange);
            }
        }
        setModaleContent({title: titrePopup, question: questionPopup})
        setShowModale(affichagePopup)
        setAction(action)
    } else {
        setShowModale(false);
    }
}

    /**
     *  RENDER
     */
        /** Groupe d'actions sur le budget **/
        return (
            <Stack direction={"row-reverse"} alignItems={"end"} onClick={handleButtonsBudgetClick}>
                {droits?.find(d => d === UTILISATEUR_DROITS.CLOTURE_BUDGET) &&
                    <Tooltip title={(budget.actif ? "Clôturer" : "Réouvrir") + " le budget"}>

                        {(budget.actif ?
                            <IconButton
                                className={"buttonsActionsBudget"} sx={{backgroundColor: '#2e7d32'}}
                                id={"CLOSE_A_CONFIRMER"}>
                                <CenterComponent><LockOpenRounded id={"CLOSE_A_CONFIRMER"}/></CenterComponent>
                            </IconButton> :
                            <IconButton
                                className={"buttonsActionsBudget"} sx={{backgroundColor: '#C70039'}}
                                id={"CLOSE_A_CONFIRMER"}>
                                <CenterComponent><LockRounded id={"CLOSE_A_CONFIRMER"}/></CenterComponent>
                            </IconButton>)}
                    </Tooltip>
                }

                {budget.actif && droits.find(d => d === UTILISATEUR_DROITS.RAZ_BUDGET) &&
                    <Tooltip title="Réinitialiser le budget">
                        <IconButton
                            className={"buttonsActionsBudget"} sx={{backgroundColor: '#EDC109'}}
                            id={"REINIT_A_CONFIRMER"}>
                            <CenterComponent><RestartAltRounded id={"REINIT_A_CONFIRMER"}/></CenterComponent>
                        </IconButton>
                    </Tooltip>
                }

                {budget.actif &&
                    <Tooltip title="Créer une nouvelle opération">
                        <IconButton
                            className={"buttonsActionsBudget"} sx={{backgroundColor: '#209ED8', marginX: '10px'}}
                            id={"CREATE"}>
                            <CenterComponent><AddchartRounded id={"CREATE"}/></CenterComponent>
                        </IconButton>
                    </Tooltip>
                }
                <Dialog open={showModale}>
                    <DialogTitle>{modaleContent?.title}</DialogTitle>
                    <DialogContent>
                        <DialogContentText>{modaleContent?.question}</DialogContentText>
                    </DialogContent>

                    <DialogActions>
                        <ButtonGroup>
                            <Button id="ANNULER" color="error">Annuler</Button>
                            <Button id="CONFIRMER" color="success">Confirmer</Button>
                        </ButtonGroup>
                    </DialogActions>
                </Dialog>

            </Stack>
        )
}