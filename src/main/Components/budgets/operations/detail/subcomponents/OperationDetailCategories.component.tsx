import React from 'react'
import { Autocomplete, FormControl, FormHelperText, TextField, Typography } from "@mui/material"
import { OPERATION_EDITION_FORM } from "../OperationDetailPage.constants"
import { sortLibellesCategories } from './../../../../../Utils/OperationData.utils'
import CategorieOperationModel from './../../../../../Models/CategorieOperation.model'
import { OperationDetailCategoriesProps } from '../../../../Components.props'



/**
 * Composant React pour afficher et éditer les détails d'une opération budgétaire.
 *
 * @component
 * @param {OperationDetailCategoriesProps} props - Les propriétés du composant.
 * @returns {JSX.Element} Élément JSX représentant le composant.
 */
export const OperationDetailCategories: React.FC<OperationDetailCategoriesProps> = ({ operation, listeCategories,
                                                                                    formCatgoriesInEdition,
                                                                                    errorsCategories,
                                                                                    fillOperationForm
                                                                                }: OperationDetailCategoriesProps): JSX.Element => {


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
     */
    function fillCategorieForm(e: any, newValue: CategorieOperationModel | null) {
        const ssCat = newValue;
        if (ssCat !== null && ssCat !== undefined) {
            fillOperationForm(OPERATION_EDITION_FORM.CATEGORIE, ssCat.id != null ? ssCat.id : "");
        }
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
                    options={getListeAllCategoriesFlatten(listeCategories)}
                    groupBy={(option: CategorieOperationModel) => option.categorieParente ? option.categorieParente.libelle : ""}
                    getOptionLabel={(option: CategorieOperationModel) => option.libelle != null ? option.libelle : ""}
                    isOptionEqualToValue={(option : any, value : any) => {
                        if (option.id != null) {
                            return (option.id === value.id ?? null)
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