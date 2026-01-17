import React, { JSX, useContext } from 'react'
import { EditFormProps, ErrorsFormProps, OPERATION_EDITION_FORM } from "../../../courantes/detail/OperationDetailPage.constants.ts"
import { TextField, Typography } from '@mui/material'
import { OperationDetailDateProps } from '../../../../../Components.props.ts'
import { BudgetContext } from '../../../../../../Models/contextProvider/BudgetContextProvider.tsx'
import { getLabelISOFromDate, getLabelMonthFRFromDate } from '../../../../../../Utils/Date.utils.ts'
import { EditRFormProps, ErrorsRFormProps, isDerniereEcheanceRO, OPERATION_RECURRENTE_EDITION_FORM } from '../OperationRecurrenteDetailPage.constants.ts'
import BudgetMensuelModel from '../../../../../../Models/budgets/BudgetMensuel.model.ts'
import OperationEditionModel from '../../../../../../Models/budgets/OperationEdition.model.ts'
import OperationModel from '../../../../../../Models/budgets/Operation.model.ts'
import { OPERATION_STATUS_ENUM } from '../../../../../../Utils/AppBusinessEnums.constants.ts'


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
                className={budgetActif ? "editableField" : "editableField--disabled"}
                sx={{ color:"var(--color-white)" }}>
                {operation.mensualite.dateFin == null ? "Jamais" : getLabelMonthFRFromDate(operation.mensualite.dateFin)}
            </Typography>

    )
}




/**
 * validation du formulaire - DateFin
 * @param budget budget mensuel
 * @param editOperation opération en cours d'édition
 * @param operation opération à mettre à jour
 * @param editForm formulaire d'édition
 * @param errors erreurs du formulaire
 */
export function validateFormDateFinPeriode(budget: BudgetMensuelModel, editOperation: OperationEditionModel, operation: OperationModel, editForm: EditFormProps | EditRFormProps, errors: ErrorsFormProps | ErrorsRFormProps) {
    if (!editForm.dateFin) return;
    const dateFin = editOperation.mensualite.dateFin;

    const [, annee, mois] = budget.id.split('_');
    let dateBudget = new Date(Number.parseInt(annee), Number.parseInt(mois) - 1, 0); // Premier jour du mois du budget
    if (dateFin !== null && dateFin !== undefined && dateFin < dateBudget) {
        errors.dateFin = "La date de fin doit être supérieure ou égale au mois du budget";
    }
    else {
        errors.dateFin = null;
        operation.mensualite.dateFin = dateFin ?? null;
        if (isDerniereEcheanceRO(operation, budget.id)) {
            operation.statuts ??= [];
            if (!operation.statuts.includes(OPERATION_STATUS_ENUM.DERNIERE_ECHEANCE)) {
                operation.statuts.push(OPERATION_STATUS_ENUM.DERNIERE_ECHEANCE);
            }
        }
        else if (operation.statuts?.includes(OPERATION_STATUS_ENUM.DERNIERE_ECHEANCE)) {
                operation.statuts = operation.statuts.filter(statut => statut !== OPERATION_STATUS_ENUM.DERNIERE_ECHEANCE);
            }
    }
}