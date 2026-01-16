import React, {JSX, useContext} from 'react'
import {InputAdornment, TextField, Typography, useMediaQuery, useTheme} from "@mui/material"
import {EditFormProps, ErrorsFormProps, OPERATION_EDITION_FORM} from "../OperationDetailPage.constants.ts"
import OperationValue from "../../../../../../Utils/renderers/OperationValue.renderer.tsx"
import {AddRounded, EuroRounded, RemoveRounded} from '@mui/icons-material'
import {TYPES_OPERATION_ENUM} from '../../../../../../Utils/AppBusinessEnums.constants.ts'
import {OperationDetailValeurProps} from '../../../../../Components.props.ts'
import {BudgetContext} from '../../../../../../Models/contextProvider/BudgetContextProvider.tsx'
import OperationEditionModel from '../../../../../../Models/budgets/OperationEdition.model.ts'
import OperationModel from '../../../../../../Models/budgets/Operation.model.ts'


/**
 * Composant React pour afficher et éditer les détails d'une opération budgétaire.
 *
 * @component
 * @param {OperationDetailValeurProps} props - Les propriétés du composant.
 */
export const OperationDetailValeur: React.FC<OperationDetailValeurProps> = ({   formValueInEdition,
                                                                                errorValeur,
                                                                                fillOperationForm
                                                                            }: OperationDetailValeurProps): JSX.Element => {

    const { currentBudget, currentOperation } = useContext(BudgetContext);
    const operation = currentOperation;
    const budgetActif = currentBudget;

    const isMobile = useMediaQuery(useTheme().breakpoints.down('lg'));
    /**
 * Remplit le champ "valeur" de l'état à partir de la saisie de l'utilisateur
 * @param {Event} e - L'événement de saisie
 */
    function fillValeurForm(e: any) {
        fillOperationForm(OPERATION_EDITION_FORM.VALUE, e.target.value);
    }

    return (
        <>
            {(formValueInEdition) ?
                <TextField id={OPERATION_EDITION_FORM.VALUE + OPERATION_EDITION_FORM.INPUT}
                    required label="Montant"
                    slotProps={{
                        input: {
                            startAdornment: (
                                <InputAdornment position="start"> {operation.typeOperation === TYPES_OPERATION_ENUM.CREDIT?
                                    <AddRounded /> : <RemoveRounded />}</InputAdornment>
                            ),
                            endAdornment: (
                                <InputAdornment position="end"><EuroRounded /></InputAdornment>
                            )
                        }
                    }}
                    defaultValue={Math.abs(operation.valeur)}
                           variant="standard" sx={{width: isMobile ? "612px" : "100%"}}
                           size={isMobile ? "small" : "medium"}
                           error={errorValeur != null} helperText={errorValeur}
                    onChange={fillValeurForm} />
                :
                <Typography variant={"h4"} className={budgetActif ? "editableField" : "editableField--disabled"}
                            id={OPERATION_EDITION_FORM.VALUE}>
                    <OperationValue operation={operation} valueOperation={operation.valeur} showSign={true} id={OPERATION_EDITION_FORM.VALUE} />
                </Typography>
            }
        </>
    )
}




/**
 *
 * @param editOperation valeur de l'opération en cours d'édition
 * @param operation opération à mettre à jour
 * @param editForm champs en édition
 * @param errors erreurs du formulaire
 * @returns opération mise à jour ou erreurs
 */
export function validateFormMontant(editOperation: OperationEditionModel, operation: OperationModel, editForm: EditFormProps, errors: ErrorsFormProps) {
    if (!editForm.value) return;

    if (!editOperation.valeur) {
        errors.valeur = "Le champ Valeur est obligatoire";
        return;
    }

    const formValeur: string = editOperation.valeur;
    let { valeurCalculee, error } = calculateValeur(formValeur.replace(",", "."));
    if (error) {
        errors.valeur = error;
        return;
    }

    if (!valeurCalculee || !validateValue(valeurCalculee)) {
        errors.valeur = "Le format est incorrect : 0000.00 €";
        return;
    }
    errors.valeur = null;
    operation.valeur = (editOperation.typeOperation === TYPES_OPERATION_ENUM.DEPENSE ? -1 : 1) * Number(valeurCalculee);
}



/**
 * Calcul de la valeur d'une opération (en prenant en compte les opérations
 * @param formValue : string valeur saisie du formulaire
 * @returns {number} total
 */
function calculateValeur(formValue: string): { valeurCalculee: string | null, error: string | null } {

    try {
        // eslint-disable-next-line no-eval
        const calculee = Number(processEquation(formValue)).toFixed(2);
        console.log("Calcul de la valeur saisie [", formValue, "] = [", calculee, "]");
        return { valeurCalculee: calculee, error: null };
    } catch (e) {
        console.error("Erreur dans la valeur saisie ", formValue, e)
        return { valeurCalculee: null, error: "Le champ Montant est incorrect" };
    }
}


/**
 * Validation du format de la valeur saisie
 * @param valeur valeur
 * @returns {boolean} vrai si la valeur est correcte
 */
function validateValue(valeur: string): boolean {
    const valeurATester = valeur.replace(",", ".");
    return /(^\d*(.\d{1,2})?$)/.test(valeurATester);
}



/**
 * Calcul de l'équation mathématique (sans eval) depuis une chaine de caractères
 * @param valueToCalculate : string : chaine de caractères à calculer à saisie
 * @returns {string} résultat
 *
 */
function processEquation(valueToCalculate: string): string {
    if (valueToCalculate.length <= 1000) {
        try {
            // eslint-disable-next-line no-new-func
            const result = new Function(`return ${valueToCalculate}`)();
            return result.toString();
        } catch (error) {
            console.error("Erreur lors du traitement de l'équation : ", valueToCalculate, error);
            return "0";
        }
    }
    return valueToCalculate
}