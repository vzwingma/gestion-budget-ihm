import React, {useContext} from 'react'
import {OPERATION_EDITION_FORM} from "../OperationDetailPage.constants"
import {Autocomplete, FormControl, FormHelperText, TextField, Typography} from '@mui/material'
import {getOperationLibelle} from './../../../../../Utils/renderers/OperationItem.renderer'
import {OperationDetailLibelleProps} from '../../../../Components.props'
import {BudgetContext} from '../../../../../Models/contextProvider/BudgetContextProvider'


/**
 * Composant React pour afficher et éditer les détails d'une opération budgétaire.
 *
 * @component
 * @param {OperationDetailLibelleProps} props - Les propriétés du composant.
 * @returns {JSX.Element} Élément JSX représentant le composant.
 */
export const OperationDetailLibelle: React.FC<OperationDetailLibelleProps> = ({ listeLibellesOperations,
    formLibelleInEdition,
    errorLibelle,
    fillOperationForm
}: OperationDetailLibelleProps): JSX.Element => {


    const { currentBudget, currentOperation, comptes } = useContext(BudgetContext)!;
    const operation = currentOperation!;
    const budgetActif = currentBudget!.actif;

    /**
     * Remplit le champ "libelle" de l'état à partir de la saisie de l'utilisateur
     * @param event - L'événement de saisie
     */
    function fillLibelleForm(event: any) {
        fillOperationForm(OPERATION_EDITION_FORM.LIBELLE, event.target.value);
    }


    /**
     * Active ou désactive le formulaire d'édition lors des autocomplétions
     * @param {boolean} activation - Indique si le formulaire doit être activé ou désactivé
     */
    function activateValidationForm(activation: boolean) {
        fillOperationForm(OPERATION_EDITION_FORM.FORM_VALIDATION, String(activation));
    }

    return (
        (!formLibelleInEdition) ?
            <Typography variant={"button"} sx={{ fontSize: "large" }}
                className={budgetActif ? "editableField" : ""}
                id={OPERATION_EDITION_FORM.LIBELLE}>
                {getOperationLibelle(operation.libelle, comptes, true)}
            </Typography>
            :
            <FormControl fullWidth required error={errorLibelle != null}>
                <Autocomplete id={OPERATION_EDITION_FORM.LIBELLE + OPERATION_EDITION_FORM.INPUT}
                    value={operation.libelle}
                    freeSolo={true}
                    autoComplete={true}
                    options={listeLibellesOperations}
                    renderInput={(params) =>
                        <TextField {...params} label="Description" variant="standard" size={"small"} />}
                    sx={{ width: "850px" }}
                    blurOnSelect={true}
                    onChange={fillLibelleForm}
                    onFocus={() => activateValidationForm(false)}
                    onBlur={(e) => {
                        activateValidationForm(true);
                                fillLibelleForm(e);
                            }}
                />
                <FormHelperText>{errorLibelle}</FormHelperText>
            </FormControl>
    )
}
