import React, {JSX, useContext} from 'react'
import {OPERATION_EDITION_FORM} from "../OperationDetailPage.constants.ts"
import {TextField, Typography} from '@mui/material'
import {OperationDetailDateProps} from '../../../../Components.props.tsx'
import {BudgetContext} from '../../../../../Models/contextProvider/BudgetContextProvider.tsx'
import {getLabelFRFromDate, getLabelISOFromDate} from '../../../../../Utils/Date.utils.ts'


/**
 * Composant React pour afficher et éditer les détails d'une opération budgétaire.
 *
 * @component
 *
 * @property {OperationModel} operation - Le modèle de l'opération.
 * @property {EditFormProps} formDateInEdition - Les propriétés du formulaire d'édition.
 * @property {string | null} errorValeur - Le message d'erreur pour la valeur, ou null s'il n'y a pas d'erreur.
 * @property {(field: OPERATION_EDITION_FORM_IDS.LIBELLE, value: string) => void} fillOperationForm - Fonction pour remplir le formulaire de l'opération.
 */
export const OperationDetailDate: React.FC<OperationDetailDateProps> = ({   formDateInEdition,
                                                                            errorDateOperation,
                                                                            fillOperationForm
                                                                        }: OperationDetailDateProps): JSX.Element => {

    const { currentBudget, currentOperation } = useContext(BudgetContext)!;
    const operation = currentOperation!;
    const budgetActif = currentBudget!.actif;

    /**
 * Remplit le champ "dateOperation" de l'état à partir de la saisie de l'utilisateur
 * @param {Event} e - L'événement de saisie
 */
    function fillDateOperationForm(e: any) {
        let value = e.target.value;
        if (value === "") {
            value = null;
        }
        fillOperationForm(OPERATION_EDITION_FORM.DATE_OPERATION, value);
    }
    return (

        (formDateInEdition) ?
            <TextField
                id={OPERATION_EDITION_FORM.DATE_OPERATION + OPERATION_EDITION_FORM.INPUT}
                defaultValue={operation.autresInfos.dateOperation == null ? null : getLabelISOFromDate(operation.autresInfos.dateOperation)}
                variant={"standard"} type={"date"} fullWidth size={"small"}
                error={errorDateOperation != null}
                helperText={errorDateOperation}
                onChange={fillDateOperationForm} />
            :
            <Typography id={OPERATION_EDITION_FORM.DATE_OPERATION} variant={"subtitle1"}
                className={budgetActif ? "editableField" : ""}
                sx={{ color: (operation.autresInfos.dateOperation == null ? "#121212" : "#FFFFFF") }}>
                {operation.autresInfos.dateOperation == null ? "jj/mm/aaaa" : getLabelFRFromDate(operation.autresInfos.dateOperation)}
            </Typography>

    )
}
