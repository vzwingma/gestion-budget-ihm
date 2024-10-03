import React, { useContext } from 'react'
import { Autocomplete, FormControl, FormHelperText, TextField, Typography } from "@mui/material"
import { OPERATION_EDITION_FORM } from "../OperationDetailPage.constants"
import { sortLibellesCategories } from './../../../../../Utils/OperationData.utils'
import CategorieOperationModel from '../../../../../Models/budgets/CategorieOperation.model'
import { OperationDetailCategoriesProps } from '../../../../Components.props'
import { BudgetContext } from '../../../../../Models/contextProvider/BudgetContextProvider'



/**
 * Composant React pour afficher et éditer les détails d'une opération budgétaire.
 *
 * @component
 * @param {OperationDetailCategoriesProps} props - Les propriétés du composant.
 * @returns {JSX.Element} Élément JSX représentant le composant.
 */
export const OperationDetailCategories: React.FC<OperationDetailCategoriesProps> = ({  formCatgoriesInEdition,
                                                                                    errorsCategories,
                                                                                    fillOperationForm
                                                                                }: OperationDetailCategoriesProps): JSX.Element => {

    const { currentOperation, categories } = useContext(BudgetContext)!;
    const operation = currentOperation!;

    /**
     * Active ou désactive le formulaire d'édition lors des autocomplétions
     * @param {boolean} activation - Indique si le formulaire doit être activé ou désactivé
     */
    function activateValidationForm(activation: boolean) {
        fillOperationForm(OPERATION_EDITION_FORM.FORM_VALIDATION, String(activation));
    }
    /**
     * Remplit le champ "categorie" de l'état à partir de la saisie de l'utilisateur
     * @param {Event} e - L'événement de saisie
     * @param newValue nouvelle valeur de la catégorie
     */
    function fillCategorieForm(e: any, newValue: CategorieOperationModel | null) {
        fillOperationForm(OPERATION_EDITION_FORM.CATEGORIE, newValue?.id ?? "");
    }


    return (
        !formCatgoriesInEdition ?
            <Typography variant={"overline"}>
                {operation.categorie.libelle} / {operation.ssCategorie.libelle}
            </Typography>
            :
            <FormControl fullWidth required error={errorsCategories != null}>
                <Autocomplete
                    id={OPERATION_EDITION_FORM.CATEGORIE + OPERATION_EDITION_FORM.INPUT}
                    renderInput={(params : any) => <TextField {...params} variant={"standard"} />}
                    sx={{ width: "90%" }}
                    value={operation.ssCategorie ?? { id: null, libelle: "" }}
                    options={getListeAllCategoriesFlatten(categories)}
                    groupBy={(option: CategorieOperationModel) => option?.categorieParente?.libelle ?? ""}
                    getOptionLabel={(option: CategorieOperationModel) => option?.libelle ?? ""}
                    isOptionEqualToValue={(option : any, value : any) => {
                        if (option.id != null) {
                            return (option.id === (value.id ?? null))
                        } else {
                            return false;
                        }
                    }}
                    blurOnSelect={true}
                    onChange={fillCategorieForm}
                    onFocus={() => activateValidationForm(false)}
                    onBlur={() => activateValidationForm(true)}
                />
                <FormHelperText>{errorsCategories}</FormHelperText>
            </FormControl>
    )
}

/**
 * Liste de toutes les catégories
 * @returns tableau de catégories
 */
function getListeAllCategoriesFlatten(listeCategories: CategorieOperationModel[]): (CategorieOperationModel)[]  {
    return listeCategories
        .flatMap((cat: CategorieOperationModel) => cat.listeSSCategories ?? [])
        .sort(sortLibellesCategories);
}
