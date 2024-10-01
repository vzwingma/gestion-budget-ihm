import React from 'react'
import { MenuItem, TextField, Typography } from "@mui/material"
import { OPERATION_EDITION_FORM } from "../OperationDetailPage.constants"
import OperationModel from './../../../../../Models/Operation.model'
import { addEndingZeros } from './../../../../../Utils/OperationData.utils'
import { getPeriodeRenderer } from './../../../../../Utils/renderers/OperationItem.renderer'
import { PERIODES_MENSUALITE_ENUM } from './../../../../../Utils/AppBusinessEnums.constants'

/**
 * Propriétés pour le composant OperationDetailMensualiteProps.
 *
 * @interface OperationDetailMensualiteProps
 * 
 * @property {OperationModel} operation - Le modèle de l'opération.
 * @property {boolean} budgetActif - Indique si le budget est actif.
 * @property {boolean} formMensualiteInEdition - Les propriétés du formulaire d'édition.
 * @property {(field: OPERATION_EDITION_FORM_IDS.LIBELLE, value: string) => void} fillOperationForm - Fonction pour remplir le formulaire de l'opération.
 */
export interface OperationDetailMensualiteProps {
    operation: OperationModel
    budgetActif: boolean
    formMensualiteInEdition: boolean
    fillOperationForm: (field: OPERATION_EDITION_FORM.VALUE, value: string) => void
}


/**
 * Composant React pour afficher et éditer les détails d'une opération budgétaire.
 *
 * @component
 * @param {OperationDetailMensualiteProps} props - Les propriétés du composant.
 * @returns {JSX.Element} Élément JSX représentant le composant.
 */
export const OperationDetailMensualite: React.FC<OperationDetailMensualiteProps> = ({ operation, budgetActif,
    formMensualiteInEdition,
    fillOperationForm
}: OperationDetailMensualiteProps): JSX.Element => {


    /**
 * Remplit le champ "valeur" de l'état à partir de la saisie de l'utilisateur
 * @param {Event} e - L'événement de saisie
 */
    function fillPeriodeForm(e: any) {
        const value: string = addEndingZeros(e.target.value)
        fillOperationForm(OPERATION_EDITION_FORM.VALUE, value);
    }



    return (
        (!formMensualiteInEdition) ?
            <Typography id={OPERATION_EDITION_FORM.MENSUALITE} variant={"overline"}
                className={budgetActif ? "editableField" : ""}
                color={getPeriodeRenderer(operation.mensualite.periode).color}>
                {getPeriodeRenderer(operation.mensualite.periode).text}
            </Typography>
            :
            <TextField
                id={OPERATION_EDITION_FORM.MENSUALITE + OPERATION_EDITION_FORM.INPUT}
                required select fullWidth
                value={operation.mensualite.periode}
                placeholder={"Sélectionnez une période"}
                onChange={fillPeriodeForm}
                variant="standard">
                {Object.values(PERIODES_MENSUALITE_ENUM).map((option) => (
                    <MenuItem key={option} value={option}
                        color={getPeriodeRenderer(option).color}>
                        {getPeriodeRenderer(option).text}
                    </MenuItem>
                ))}
            </TextField>
    )
}