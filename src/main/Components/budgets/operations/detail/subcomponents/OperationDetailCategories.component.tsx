import React from 'react'
import { Autocomplete, FormControl, FormHelperText, TextField, Typography } from "@mui/material"
import { OPERATION_EDITION_FORM } from "../OperationDetailPage.constants"
import OperationModel from './../../../../../Models/Operation.model'
import { sortLibellesCategories } from './../../../../../Utils/OperationData.utils'
import CategorieOperationModel from './../../../../../Models/CategorieOperation.model'

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
export interface OperationDetailCategoriesProps {
    operation: OperationModel
    listeCategories: CategorieOperationModel[]
    formCatgoriesInEdition: boolean
    errorsCategories: string | null
    fillOperationForm: (field: OPERATION_EDITION_FORM, value: string) => void
}


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
                    renderInput={(params) => <TextField {...params} variant={"standard"} />}
                    sx={{ width: "90%" }}
                    value={operation.ssCategorie != null ? operation.ssCategorie : { id: null, libelle: "" }}
                    options={getListeAllCategoriesFlatten(listeCategories)}
                    groupBy={(option: CategorieOperationModel) => option.categorieParente ? option.categorieParente.libelle : ""}
                    getOptionLabel={(option: CategorieOperationModel) => option.libelle != null ? option.libelle : ""}
                    isOptionEqualToValue={(option, value) => {
                        if (option.id != null) {
                            return (option.id === (value != null ? value.id : null))
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
 * @returns {*}
 */

function getListeAllCategoriesFlatten(listeCategories: CategorieOperationModel[]): (CategorieOperationModel)[]  {
    return listeCategories
        .flatMap((cat: CategorieOperationModel) => (cat.listeSSCategories !== undefined && cat.listeSSCategories !== null) ? cat.listeSSCategories : [])
        .sort(sortLibellesCategories);
}