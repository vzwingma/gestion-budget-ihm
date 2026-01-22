import React, {JSX, useContext} from 'react'
import {MenuItem, TextField, Typography} from "@mui/material"
import {OPERATION_EDITION_FORM} from "../OperationDetailPage.constants.ts"
import {getTypeCategorieRenderer} from '../../../../../../Utils/renderers/OperationItem.renderer.tsx'
import {TYPES_CATEGORIES_OPERATION_ENUM} from '../../../../../../Utils/AppBusinessEnums.constants.ts'
import {OperationDetailCategorieTypeProps} from '../../../../../Components.props.ts'
import {BudgetContext} from '../../../../../../Models/contextProvider/BudgetContextProvider.tsx'

/**
 * Composant React pour afficher et éditer les détails d'une opération budgétaire.
 *
 * @component
 * @property {OperationModel} operation - Le modèle de l'opération.
 * @property {boolean} budgetActif - Indique si le budget est actif.
 * @property {boolean} formCategorieTypeInEdition - Les propriétés du formulaire d'édition.
 * @property {(field: OPERATION_EDITION_FORM_IDS.LIBELLE, value: string) => void} fillOperationForm - Fonction pour remplir le formulaire de l'opération.
 * @returns {JSX.Element} Élément JSX représentant le composant.
 */
export const OperationDetailCategorieType: React.FC<OperationDetailCategorieTypeProps> = ({ formCategorieTypeInEdition,
    fillOperationForm
}: OperationDetailCategorieTypeProps): JSX.Element => {

    const { currentBudget, currentOperation } = useContext(BudgetContext);
    const operation = currentOperation;
    const budgetActif = currentBudget.actif;
    /**
 * Remplit le champ "valeur" de l'état à partir de la saisie de l'utilisateur
 * @param {Event} e - L'événement de saisie
 */
    function fillCategorieTypeForm(e: any) {
        fillOperationForm(OPERATION_EDITION_FORM.CATEGORIE_TYPE, e.target.value);
    }
    /**
     * Active ou désactive le formulaire d'édition lors des autocomplétions
     * @param {boolean} activation - Indique si le formulaire doit être activé ou désactivé
     */
    function activateValidationForm(activation: boolean) {
        fillOperationForm(OPERATION_EDITION_FORM.FORM_VALIDATION, String(activation));
    }

    return (
        (formCategorieTypeInEdition) ?
            <TextField
                id={OPERATION_EDITION_FORM.CATEGORIE_TYPE + OPERATION_EDITION_FORM.INPUT}
                required select fullWidth
                value={operation.ssCategorie.type}
                disabled={operation.ssCategorie.type === TYPES_CATEGORIES_OPERATION_ENUM.REVENUS}
                placeholder={"Sélectionnez un type de catégorie"}
                onChange={fillCategorieTypeForm}
                onFocus={() => activateValidationForm(false)}
                onBlur={() => activateValidationForm(true)}
                variant="standard" size={"small"}>
                {Object.values(TYPES_CATEGORIES_OPERATION_ENUM).map((option) => (
                    <MenuItem key={option} value={option}
                        color={getTypeCategorieRenderer(option).color}>
                        {getTypeCategorieRenderer(option).text}
                    </MenuItem>
                ))}
            </TextField>
            :
            
            <Typography id={OPERATION_EDITION_FORM.CATEGORIE_TYPE} variant={"overline"}
                className={budgetActif ? "editableField" : "editableField--disabled"}
                style={{border: '1px solid ' + getTypeCategorieRenderer(operation.ssCategorie.type).color, padding: '8px', paddingRight: '10px', borderRadius: '4px'}}
                color={getTypeCategorieRenderer(operation.ssCategorie.type).color}>
                {getTypeCategorieRenderer(operation.ssCategorie.type).text}
            </Typography>
    )
}
