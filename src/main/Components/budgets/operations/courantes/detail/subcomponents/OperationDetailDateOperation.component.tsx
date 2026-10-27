import React, {JSX} from 'react'
import {OPERATION_EDITION_FORM} from "../OperationDetailPage.constants.ts"
import {TextField, Typography} from '@mui/material'
import {OperationDetailDateProps} from '../../../../../Components.props.ts'
import { useCurrentBudget } from '../../../../../../hooks/useBudgetContext.ts'
import {getLabelFRFromDate, getLabelISOFromDate} from '../../../../../../Utils/Date.utils.ts'


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
/** Props du champ : `dateEdition` = date du brouillon d'édition (champ contrôlé) ; `undefined` → date de l'opération du contexte */
type OperationDetailDateOperationProps = OperationDetailDateProps & { dateEdition?: Date | null };

export const OperationDetailDate: React.FC<OperationDetailDateOperationProps> = ({   formDateInEdition,
                                                                            errorDateOperation,
                                                                            fillOperationForm,
                                                                            dateEdition
                                                                        }: OperationDetailDateOperationProps): JSX.Element => {

    const { currentBudget, currentOperation } = useCurrentBudget();
    const operation = currentOperation;

    if (!currentBudget || !operation) {
        return <></>;
    }

    const budgetActif = currentBudget.actif;
    const dateSaisie = dateEdition === undefined ? operation.autresInfos.dateOperation : dateEdition;

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
                value={dateSaisie == null ? '' : getLabelISOFromDate(dateSaisie)}
                variant={"standard"} type={"date"} fullWidth size={"small"}
                error={errorDateOperation != null}
                helperText={errorDateOperation}
                onChange={fillDateOperationForm} />
            :
            <Typography id={OPERATION_EDITION_FORM.DATE_OPERATION} variant={"subtitle1"}
                className={budgetActif ? "editableField" : "editableField--disabled"}
                sx={{ color: "var(--color-white)" }}>
                {operation.autresInfos.dateOperation == null || operation.autresInfos.dateOperation === undefined ? "jj/mm/aaaa" : getLabelFRFromDate(operation.autresInfos.dateOperation)}
            </Typography>

    )
}
