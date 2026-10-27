import React, { JSX } from 'react'
import { Button, Grid, Stack, Typography } from "@mui/material";
import { OperationDetailActions } from '../actions/OperationDetailActions.component.tsx';
import { OPERATION_ETATS_ENUM } from '../../../../../../Utils/AppBusinessEnums.constants.ts';
import { useBudgetContext } from '../../../../../../Models/contextProvider/BudgetContextProvider.tsx';
import { isInCreateMode, isInEditMode } from '../OperationDetailPage.controller.ts';
import OperationModel from "../../../../../../Models/budgets/Operation.model.ts";
import OperationEditionModel from "../../../../../../Models/budgets/OperationEdition.model.ts";
import BudgetMensuelModel from "../../../../../../Models/budgets/BudgetMensuel.model.ts";
import { EditFormProps } from "../OperationDetailPage.constants.ts";

export interface OperationDetailActionsSectionProps {
    editForm: EditFormProps
    editOperation: OperationEditionModel
    onClickRealiseInCreateMode: (valeurDate: Date | null, etat: OPERATION_ETATS_ENUM) => void
    onOperationChange: (budget: BudgetMensuelModel) => void
    onOperationCommit: (operation: OperationModel) => void
    onValidate: () => void
}

/**
 * Section « Actions » de la page de détail : boutons d'action sur l'état + bouton de validation du formulaire
 * (uniquement sur un budget actif)
 */
export const OperationDetailActionsSection: React.FC<OperationDetailActionsSectionProps> = ({
    editForm, editOperation, onClickRealiseInCreateMode, onOperationChange, onOperationCommit, onValidate
}: OperationDetailActionsSectionProps): JSX.Element => {

    const { currentBudget, currentOperation } = useBudgetContext();

    return (
        <Grid container sx={{ width: "90%", alignItems: "center", justifyContent: "center" }}>
            {currentBudget?.actif &&
                <>
                    <Grid size={{ md: 2, xl: 2 }}>
                        <Typography variant={"caption"} sx={{ color: "var(--color-heading-text)" }}>Actions</Typography>
                    </Grid>
                    <Grid size={{ md: 8, xl: 8 }} sx={{ paddingBottom: 2 }}>
                        <Stack direction={"column"} sx={{ alignItems: "center", justifyContent: "center", width: "100%" }}>
                            { /** ACTIONS **/}
                            {currentOperation?.etat === OPERATION_ETATS_ENUM.SUPPRIMEE ?
                                <></>
                                : <OperationDetailActions
                                    isInCreateMode={isInCreateMode(editForm)}
                                    editOperation={editOperation}
                                    onClickRealiseInCreateMode={onClickRealiseInCreateMode}
                                    onOperationChange={onOperationChange}
                                    onOperationCommit={onOperationCommit}
                                />
                            }
                        </Stack>
                    </Grid>
                    <Grid size={{ md: 2, xl: 2 }}></Grid>
                </>
            }
            {currentBudget?.actif && isInEditMode(editForm) &&
                <Button fullWidth variant="outlined" color="success" onClick={onValidate}>Valider</Button>
            }
        </Grid>
    )
}
