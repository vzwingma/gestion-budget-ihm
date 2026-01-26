import React, {JSX, useContext} from 'react'
import {
    Autocomplete,
    Box,
    FormControl,
    FormHelperText,
    TextField,
    Typography,
    useMediaQuery,
    useTheme
} from "@mui/material"
import {ErrorsFormProps, OPERATION_EDITION_FORM} from "../OperationDetailPage.constants.ts"
import {sortLibellesCategories} from '../../../../../../Utils/OperationData.utils.ts'
import CategorieOperationModel from '../../../../../../Models/budgets/CategorieOperation.model.ts'
import {OperationDetailCategoriesProps} from '../../../../../Components.props.ts'
import {BudgetContext} from '../../../../../../Models/contextProvider/BudgetContextProvider.tsx'
import OperationEditionModel from '../../../../../../Models/budgets/OperationEdition.model.ts'
import OperationModel from '../../../../../../Models/budgets/Operation.model.ts'
import SsCategorieOperationModel from '../../../../../../Models/budgets/SSCategorieOperation.model.ts'


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

    const { currentOperation, categories } = useContext(BudgetContext);
    const operation = currentOperation;

    const isMobile = useMediaQuery(useTheme().breakpoints.down('lg'));
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
        formCatgoriesInEdition ?
            <FormControl fullWidth required error={errorsCategories != null}>
                <Autocomplete
                    id={OPERATION_EDITION_FORM.CATEGORIE + OPERATION_EDITION_FORM.INPUT}
                    renderInput={(params: any) => <TextField {...params} variant={"standard"} size={"small"}/>}
                    renderOption={(props, option, state, ownerState) => {
                        const {key, ...optionProps} = props;
                        return (<Box key={key}
                                     sx={{fontSize: isMobile ? 'small' : 'medium'}}
                                     component="li"  {...optionProps} >
                                {ownerState.getOptionLabel(option)}
                            </Box>
                        )
                    }}
                    sx={{ width: "100%" }}
                    value={operation.ssCategorie ?? { id: null, libelle: "" }}
                    options={getListeAllSsCategoriesFlatten(categories)}
                    groupBy={(option: SsCategorieOperationModel) => option?.categorieParente?.libelle ?? ""}
                    getOptionLabel={(option: SsCategorieOperationModel) => option?.libelle ?? ""}
                    isOptionEqualToValue={(option : any, value : any) => {
                        if (option.id == null) {
                            return false;
                        } else {
                            return (option.id === (value.id ?? null))
                        }
                    }}
                    blurOnSelect={true}
                    onChange={fillCategorieForm}
                    onFocus={() => activateValidationForm(false)}
                    onBlur={() => activateValidationForm(true)}
                />
                <FormHelperText>{errorsCategories}</FormHelperText>
            </FormControl>
            :
            <Typography variant={"overline"}>
                {operation.categorie.libelle} / {operation.ssCategorie.libelle}
            </Typography>
    )
}

/**
 * Liste de toutes les catégories
 * @returns tableau de catégories
 */
function getListeAllSsCategoriesFlatten(listeCategories: CategorieOperationModel[]): (CategorieOperationModel)[]  {
    return listeCategories
        .flatMap((cat: CategorieOperationModel) => cat.listeSSCategories ?? [])
        .sort(sortLibellesCategories);
}


/**
 * validation du formulaire - Catégories
 */
export function validateFormCategories(editOperation: OperationEditionModel, operation: OperationModel, errors: ErrorsFormProps) {
    if (editOperation.categorie.id === null || editOperation.categorie.libelle === null || editOperation.ssCategorie.id === null || editOperation.ssCategorie.libelle === null) {
        errors.categorie = "Le champ Catégorie est obligatoire"
    } else {
        operation.categorie = editOperation.categorie
        operation.ssCategorie = editOperation.ssCategorie
        operation.ssCategorie.type = editOperation.ssCategorie.type
        errors.categorie = null
    }
}
