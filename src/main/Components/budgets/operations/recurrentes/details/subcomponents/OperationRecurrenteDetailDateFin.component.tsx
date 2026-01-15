import React, { JSX, useContext } from 'react'
import { OPERATION_EDITION_FORM } from "../../../courantes/detail/OperationDetailPage.constants.ts"
import { TextField, Typography } from '@mui/material'
import { OperationDetailDateProps } from '../../../../../Components.props.ts'
import { BudgetContext } from '../../../../../../Models/contextProvider/BudgetContextProvider.tsx'
import { getLabelISOFromDate, getLabelMonthFRFromDate } from '../../../../../../Utils/Date.utils.ts'
import { OPERATION_RECURRENTE_EDITION_FORM } from '../OperationRecurrenteDetailPage.constants.ts'


/**
 * Composant React pour afficher et éditer les détails d'une opération budgétaire.
 *
 * @component
 *
 * @property {OperationModel} operation - Le modèle de l'opération.
 * @property {EditFormProps} formDateInEdition - Les propriétés du formulaire d'édition.
 * @property {string | null} errorDateOperation - Le message d'erreur pour la date de l'opération, ou null s'il n'y a pas d'erreur.
 * @property {(field: OPERATION_RECURRENTE_EDITION_FORM, value: string) => void} fillOperationForm - Fonction pour remplir le formulaire de l'opération.
 */
export const OperationDetailDateFin: React.FC<OperationDetailDateProps> = ({ formDateInEdition,
    errorDateOperation,
    fillOperationForm: fillOperationRecurrenteForm
}: OperationDetailDateProps): JSX.Element => {

    const { currentBudget, currentOperation } = useContext(BudgetContext);
    const operation = currentOperation;
    const budgetActif = currentBudget.actif;

    /**
 * Remplit le champ "dateFin" de l'état à partir de la saisie de l'utilisateur
 * @param {Event} e - L'événement de saisie
 */
    function fillDateFinOperationRecurrenteForm(e: any) {
        let value = e.target.value;
        if (value === "") {
            value = null;
        }
        fillOperationRecurrenteForm(OPERATION_RECURRENTE_EDITION_FORM.DATE_FIN, value);
    }
    return (

        (formDateInEdition) ?
            <TextField
                id={OPERATION_RECURRENTE_EDITION_FORM + OPERATION_EDITION_FORM.INPUT}
                defaultValue={operation.mensualite.dateFin == null ? null : getLabelISOFromDate(operation.mensualite.dateFin)}
                variant={"standard"} type={"month"} fullWidth size={"small"}
                error={errorDateOperation != null}
                helperText={errorDateOperation}
                onChange={fillDateFinOperationRecurrenteForm} />
            :
            <Typography id={OPERATION_RECURRENTE_EDITION_FORM.DATE_FIN} variant={"subtitle1"}
                className={budgetActif ? "editableField" : ""}
                sx={{ color:"#FFFFFF" }}>
                {operation.mensualite.dateFin == null ? "Jamais" : getLabelMonthFRFromDate(operation.mensualite.dateFin)}
            </Typography>

    )
}
