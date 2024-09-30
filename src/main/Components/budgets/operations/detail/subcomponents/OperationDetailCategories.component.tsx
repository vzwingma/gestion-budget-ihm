import React from 'react'
import { Autocomplete, FormControl, FormHelperText, TextField, Typography } from "@mui/material"
import { EMPTY_CATEGORIE, OPERATION_EDITION_FORM } from "../OperationDetailPage.constants"
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
    function fillCategorieForm(e: any) {
        const ssCat = getListeAllCategories(listeCategories)
            .filter((ssCat: CategorieOperationModel) => {
                return ssCat.libelle === e.target.textContent || ssCat.libelle === e.target.value
            })[0]
        if (ssCat !== null && ssCat !== undefined) {
            /*
            TODO 
            let editedOperation = editOperation;
            if (editedOperation === null) {
                editedOperation = createNewOperation();
            }
            if (ssCat.categorieParente) {
                editedOperation.categorie.id = ssCat.categorieParente.id;
                editedOperation.categorie.libelle = ssCat.categorieParente.libelle;
            }
            editedOperation.ssCategorie.id = ssCat.id
            editedOperation.ssCategorie.libelle = ssCat.libelle
            setEditOperation(editedOperation);
*/

            /** Si type Virement **/
          //  editedOperation.typeOperation = (BUSINESS_GUID.CAT_VIREMENT === editedOperation.categorie.id && BUSINESS_GUID.SOUS_CAT_INTER_COMPTES !== editedOperation.ssCategorie.id) ? TYPES_OPERATION_ENUM.CREDIT : TYPES_OPERATION_ENUM.DEPENSE;

            /** Adaptation sur la sélection de catégorie **/
            if (ssCat.categorieParente) {
                operation.categorie.id = ssCat.categorieParente.id
                operation.categorie.libelle = ssCat.categorieParente.libelle
            }

            operation.ssCategorie.id = ssCat.id
            operation.ssCategorie.libelle = ssCat.libelle
          //  operation.typeOperation = editedOperation.typeOperation 
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
                    defaultValue={operation.ssCategorie != null ? operation.ssCategorie : EMPTY_CATEGORIE}
                    options={getListeAllCategories(listeCategories)}
                    groupBy={(option: CategorieOperationModel) => option.categorieParente ? option.categorieParente.libelle : ""}
                    getOptionLabel={(option: CategorieOperationModel) => option.libelle != null ? option.libelle : ""}
                    isOptionEqualToValue={(option, value) => {
                        if (option.id != null) {
                            return (option.id === (value != null ? value.id : null))
                        } else {
                            return false;
                        }
                    }}
                    onChange={fillCategorieForm}
                    onFocus={() => activateValidationForm(false)}
                    onBlur={e => {
                        activateValidationForm(true);
                        fillCategorieForm(e);
                    }}
                />
                <FormHelperText>{errorsCategories}</FormHelperText>
            </FormControl>
    )
}

/**
 * Liste de toutes les catégories
 * @returns {*}
 */

export function getListeAllCategories(listeCategories: CategorieOperationModel[]): any {
    return listeCategories
        /*
        TODO : à revoir
            .flatMap((cat : CategorieOperationModel) => {
                for (let (ssCat : CategorieOperationModel) in cat.listeSSCategories) {
                    cat.listeSSCategories[ssCat].categorieParente = cat
                }
                return cat.listeSSCategories
            }) */
        .sort(sortLibellesCategories);
}