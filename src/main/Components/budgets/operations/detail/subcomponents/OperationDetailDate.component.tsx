import React, {JSX, useContext} from 'react'
import {OPERATION_EDITION_FORM} from "../OperationDetailPage.constants"
import {TextField, Typography} from '@mui/material'
import {OperationDetailDateProps} from '../../../../Components.props'
import {BudgetContext} from '../../../../../Models/contextProvider/BudgetContextProvider'
import {getLabelFRFromDate, getLabelISOFromDate} from '../../../../../Utils/Date.utils'


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

        (!formDateInEdition) ?
            <Typography id={OPERATION_EDITION_FORM.DATE_OPERATION} variant={"subtitle1"}
                className={budgetActif ? "editableField" : ""}
                sx={{ color: (operation.autresInfos.dateOperation != null ? "#FFFFFF" : "#121212") }}>
                {operation.autresInfos.dateOperation != null ? getLabelFRFromDate(operation.autresInfos.dateOperation) : "jj/mm/aaaa"}
            </Typography>
            :
            <TextField
                id={OPERATION_EDITION_FORM.DATE_OPERATION + OPERATION_EDITION_FORM.INPUT}
                defaultValue={operation.autresInfos.dateOperation != null ? getLabelISOFromDate(operation.autresInfos.dateOperation) : null}
                variant={"standard"} type={"date"} fullWidth size={"small"}
                error={errorDateOperation != null}
                helperText={errorDateOperation}
                onChange={fillDateOperationForm} />

    )
}
