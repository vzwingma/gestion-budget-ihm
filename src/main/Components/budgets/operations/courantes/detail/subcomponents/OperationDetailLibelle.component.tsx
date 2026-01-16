import React, {JSX, useContext, useEffect, useState} from 'react'
import {OPERATION_EDITION_FORM} from "../OperationDetailPage.constants.ts"
import {Autocomplete, FormControl, FormHelperText, TextField, Typography, useMediaQuery, useTheme} from '@mui/material'
import {getOperationLibelle} from '../../../../../../Utils/renderers/OperationItem.renderer.tsx'
import {OperationDetailLibelleProps} from '../../../../../Components.props.ts'
import {BudgetContext} from '../../../../../../Models/contextProvider/BudgetContextProvider.tsx'
import {EN_RETARD_LIBELLE_REGEX, INTERCOMPTE_LIBELLE_REGEX} from "../../../../../../Utils/OperationData.utils.ts";
import LibelleCategorieOperationModel from "../../../../../../Models/budgets/LibelleCategorieOperation.model.ts";
import {evaluatePendingLibelle, getOperationLibelleInEdition, prioritySort} from "./OperationDetailLibelle.controller.ts";


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


    const { currentBudget, currentOperation, comptes } = useContext(BudgetContext);

    const [listeLibellesOperationsFiltered, setListeLibellesOperationsFiltered] = useState<LibelleCategorieOperationModel[]>([...listeLibellesOperations]);
    const [pendingLibelle, setPendingLibelle] = useState<string>("");

    const operation = currentOperation;
    const budgetActif = currentBudget.actif;
    const rawLibelleIntercompteParts = INTERCOMPTE_LIBELLE_REGEX.exec(operation.libelle);
    const rawLibelleRetardParts = EN_RETARD_LIBELLE_REGEX.exec(operation.libelle);

    const isMobile = useMediaQuery(useTheme().breakpoints.down('lg'));
    /**
     * refresh les libellés d'opérations en fonction de la saisie de l'utilisateur
     */
    useEffect(() => {
        if(pendingLibelle !== "" && pendingLibelle.length > 1){
            listeLibellesOperations.sort((a: LibelleCategorieOperationModel, b: LibelleCategorieOperationModel) => prioritySort(a, b, pendingLibelle))
            setListeLibellesOperationsFiltered(listeLibellesOperations);
        }
    }, [pendingLibelle, listeLibellesOperations]);

    useEffect(() => {
        setPendingLibelle("");
        setListeLibellesOperationsFiltered([...listeLibellesOperations]);
    }, [listeLibellesOperations]);

    /**
     * Remplit le champ "libelle" de l'état à partir de la saisie de l'utilisateur
     * @param event - L'événement de saisie
     */
    function fillLibelleForm(event: any) {
        setPendingLibelle(event.target.value);
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
            [...listeLibellesOperations].reverse().find((libelle: LibelleCategorieOperationModel) => libelle.libelle.toLowerCase() === libelleToFindAutocomplete.toLowerCase());

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
        (formLibelleInEdition) ?
            <FormControl fullWidth required error={errorLibelle != null}>
                <Autocomplete id={OPERATION_EDITION_FORM.LIBELLE + OPERATION_EDITION_FORM.INPUT}
                              value={getOperationLibelleInEdition(operation)}
                    freeSolo={true}
                    autoComplete={true}
                              options={listeLibellesOperationsFiltered}
                              getOptionLabel={(option: string | LibelleCategorieOperationModel) => typeof option === 'string' ? option : option.libelle}
                    renderInput={(params) =>
                        <TextField {...params} label="Description" variant="standard"
                                   size={isMobile ? "small" : "medium"}/>}
                              sx={{width: "100%"}}
                    blurOnSelect={true}
                    onKeyUp={(event) => {
                        setPendingLibelle(evaluatePendingLibelle(event, pendingLibelle));
                    }}
                    onChange={(e) => {
                        fillLibelleForm(e);
                    }}
                    onFocus={() => activateValidationForm(false)}
                    onBlur={(e) => {
                        activateValidationForm(true);
                        fillLibelleForm(e);
                    }}
                />
                <FormHelperText>{errorLibelle}</FormHelperText>
            </FormControl>
            :
            <Typography variant={"button"} sx={{fontSize: isMobile ? "medium" : "large"}} className={budgetActif ? "editableField" : ""} id={OPERATION_EDITION_FORM.LIBELLE}>
                {getOperationLibelle(operation.libelle, comptes, true)}
            </Typography>
    )
}
