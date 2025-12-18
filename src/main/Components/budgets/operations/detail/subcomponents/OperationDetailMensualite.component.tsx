import React, {JSX, useContext} from 'react'
import {MenuItem, TextField, Typography} from "@mui/material"
import {OPERATION_EDITION_FORM} from "../OperationDetailPage.constants.ts"
import {getPeriodeRenderer} from '../../../../../Utils/renderers/OperationItem.renderer.tsx'
import {PERIODES_MENSUALITE_ENUM} from '../../../../../Utils/AppBusinessEnums.constants.ts'
import {OperationDetailMensualiteProps} from '../../../../Components.props.tsx'
import {BudgetContext} from '../../../../../Models/contextProvider/BudgetContextProvider.tsx'

/**
 * Composant React pour afficher et éditer les détails d'une opération budgétaire.
 *
 * @component
 * @property {OperationModel} operation - Le modèle de l'opération.
 * @property {boolean} budgetActif - Indique si le budget est actif.
 * @property {boolean} formMensualiteInEdition - Les propriétés du formulaire d'édition.
 * @property {(field: OPERATION_EDITION_FORM_IDS.LIBELLE, value: string) => void} fillOperationForm - Fonction pour remplir le formulaire de l'opération.
 * @returns {JSX.Element} Élément JSX représentant le composant.
 */
export const OperationDetailMensualite: React.FC<OperationDetailMensualiteProps> = ({ formMensualiteInEdition,
    fillOperationForm
}: OperationDetailMensualiteProps): JSX.Element => {

    const { currentBudget, currentOperation } = useContext(BudgetContext);
    const operation = currentOperation;
    const budgetActif = currentBudget.actif;
    /**
 * Remplit le champ "valeur" de l'état à partir de la saisie de l'utilisateur
 * @param {Event} e - L'événement de saisie
 */
    function fillPeriodeForm(e: any) {
        fillOperationForm(OPERATION_EDITION_FORM.MENSUALITE, e.target.value);
    }
    /**
     * Active ou désactive le formulaire d'édition lors des autocomplétions
     * @param {boolean} activation - Indique si le formulaire doit être activé ou désactivé
     */
    function activateValidationForm(activation: boolean) {
        fillOperationForm(OPERATION_EDITION_FORM.FORM_VALIDATION, String(activation));
    }

    return (
        (formMensualiteInEdition) ?
            <TextField
                id={OPERATION_EDITION_FORM.MENSUALITE + OPERATION_EDITION_FORM.INPUT}
                required select fullWidth
                value={operation.mensualite.periode}
                placeholder={"Sélectionnez une période"}
                onChange={fillPeriodeForm}
                onFocus={() => activateValidationForm(false)}
                onBlur={() => activateValidationForm(true)}
                variant="standard" size={"small"}>
                {Object.values(PERIODES_MENSUALITE_ENUM).map((option) => (
                    <MenuItem key={option} value={option}
                        color={getPeriodeRenderer(option).color}>
                        {getPeriodeRenderer(option).text}
                    </MenuItem>
                ))}
            </TextField>
            :
            <Typography id={OPERATION_EDITION_FORM.MENSUALITE} variant={"overline"}
                className={budgetActif ? "editableField" : ""}
                color={getPeriodeRenderer(operation.mensualite.periode).color}>
                {getPeriodeRenderer(operation.mensualite.periode).text}
            </Typography>
    )
}
