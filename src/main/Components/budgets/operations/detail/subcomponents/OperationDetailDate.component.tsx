import React from 'react'
import { OPERATION_EDITION_FORM } from "../OperationDetailPage.constants"
import OperationModel from './../../../../../Models/Operation.model'
import { TextField, Typography } from '@mui/material'


/**
 * Propriétés pour le composant OperationDetailValeur.
 *
 * @interface OperationDetailDateProps
 * 
 * @property {OperationModel} operation - Le modèle de l'opération.
 * @property {boolean} budgetActif - Indique si le budget est actif.
 * @property {EditFormProps} formDateInEdition - Les propriétés du formulaire d'édition.
 * @property {string | null} errorValeur - Le message d'erreur pour la valeur, ou null s'il n'y a pas d'erreur.
 * @property {(field: OPERATION_EDITION_FORM_IDS.LIBELLE, value: string) => void} fillOperationForm - Fonction pour remplir le formulaire de l'opération.
 */
export interface OperationDetailDateProps {
    operation: OperationModel
    budgetActif: boolean
    formDateInEdition: boolean
    errorDateOperation: string | null
    fillOperationForm: (field: OPERATION_EDITION_FORM, value: string) => void
}




/**
 * Composant React pour afficher et éditer les détails d'une opération budgétaire.
 *
 * @component
 * @param {OperationDetailDateProps} props - Les propriétés du composant.
 * @returns {JSX.Element} Élément JSX représentant le composant.
 */
export const OperationDetailDate: React.FC<OperationDetailDateProps> = ({ operation, budgetActif,
    formDateInEdition,
    errorDateOperation,
    fillOperationForm
}: OperationDetailDateProps): JSX.Element => {


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
                {operation.autresInfos.dateOperation != null ? operation.autresInfos.dateOperation.toLocaleDateString("fr") : "jj/mm/aaaa"}
            </Typography>
            :
            <TextField
                id={OPERATION_EDITION_FORM.DATE_OPERATION + OPERATION_EDITION_FORM.INPUT}
                defaultValue={operation.autresInfos.dateOperation}
                variant={"standard"} type={"date"} fullWidth
                error={errorDateOperation != null}
                helperText={errorDateOperation}
                onChange={fillDateOperationForm} />

    )
}