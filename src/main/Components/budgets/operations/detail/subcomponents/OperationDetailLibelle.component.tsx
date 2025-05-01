import React, {JSX, useContext} from 'react'
import {OPERATION_EDITION_FORM} from "../OperationDetailPage.constants"
import {Autocomplete, FormControl, FormHelperText, TextField, Typography} from '@mui/material'
import {getOperationLibelle} from '../../../../../Utils/renderers/OperationItem.renderer'
import {OperationDetailLibelleProps} from '../../../../Components.props'
import {BudgetContext} from '../../../../../Models/contextProvider/BudgetContextProvider'
import {EN_RETARD_LIBELLE_REGEX, INTERCOMPTE_LIBELLE_REGEX} from "../../../../../Utils/OperationData.utils";
import LibelleCategorieOperationModel from "../../../../../Models/budgets/LibelleCategorieOperation.model";
import {evaluatePendingLibelle, getOperationLibelleInEdition, prioritySort} from "./OperationDetailLibelle.controller";


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
    const rawLibelleIntercompteParts = INTERCOMPTE_LIBELLE_REGEX.exec(operation.libelle);
    const rawLibelleRetardParts = EN_RETARD_LIBELLE_REGEX.exec(operation.libelle);

    let pendingLibelle: string = "";
    let listeLibellesOperationsFiltered: LibelleCategorieOperationModel[] = listeLibellesOperations;

    /**
     * refresh les libellés d'opérations en fonction de la saisie de l'utilisateur
     */
    function refreshLibellesOperations() {
        listeLibellesOperationsFiltered = listeLibellesOperations.toSorted((a, b) => prioritySort(a, b, pendingLibelle));
    }

    /**
     * Remplit le champ "libelle" de l'état à partir de la saisie de l'utilisateur
     * @param event - L'événement de saisie
     */
    function fillLibelleForm(event: any) {
        // Récupération du libellé de l'opération
        let newLibelle: string = event.target.value;
        if (rawLibelleIntercompteParts !== null) {
            // Rajout des tags en amont
            newLibelle = rawLibelleIntercompteParts[0].replace(rawLibelleIntercompteParts[3], newLibelle);
        }
        if (rawLibelleRetardParts !== null) {
            // Rajout des tags en amont
            newLibelle = rawLibelleRetardParts[0].replace(rawLibelleRetardParts[1], newLibelle);
        }

        // On supprime les tags de la catégorie
        const libelleToFindAutocomplete = newLibelle?.split("-")[0]?.trim();

        const libelleFromHistory: LibelleCategorieOperationModel | undefined =
            listeLibellesOperations.findLast((libelle: LibelleCategorieOperationModel) => libelle.libelle.toLowerCase() === libelleToFindAutocomplete.toLowerCase());

        if (libelleFromHistory !== undefined && operation.id === "-1") {
            fillOperationForm(OPERATION_EDITION_FORM.CATEGORIE, libelleFromHistory?.ssCategorieId);
        }
        fillOperationForm(OPERATION_EDITION_FORM.LIBELLE, newLibelle);
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
                              value={getOperationLibelleInEdition(operation)}
                    freeSolo={true}
                    autoComplete={true}
                              options={listeLibellesOperationsFiltered}
                              getOptionLabel={(option: string | LibelleCategorieOperationModel) => typeof option === 'string' ? option : option.libelle}
                    renderInput={(params) =>
                        <TextField {...params} label="Description" variant="standard" size={"small"} />}
                    sx={{ width: "850px" }}
                    blurOnSelect={true}
                              onKeyUp={(event) => {
                                  pendingLibelle = evaluatePendingLibelle(event, pendingLibelle);
                                  refreshLibellesOperations();
                              }}
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
