import React, {JSX, useContext} from 'react'
import {InputAdornment, TextField, Typography, useMediaQuery, useTheme} from "@mui/material"
import {OPERATION_EDITION_FORM} from "../OperationDetailPage.constants.ts"
import OperationValue from "./../../../../../Utils/renderers/OperationValue.renderer.tsx"
import {AddRounded, EuroRounded, RemoveRounded} from '@mui/icons-material'
import {TYPES_OPERATION_ENUM} from '../../../../../Utils/AppBusinessEnums.constants.ts'
import {OperationDetailValeurProps} from '../../../../Components.props.tsx'
import {BudgetContext} from '../../../../../Models/contextProvider/BudgetContextProvider.tsx'


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

    const { currentBudget, currentOperation } = useContext(BudgetContext)!;
    const operation = currentOperation!;
    const budgetActif = currentBudget!;

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
            {(!formValueInEdition) ?
                <Typography variant={"h4"} className={budgetActif ? "editableField" : ""}
                            id={OPERATION_EDITION_FORM.VALUE}>
                <OperationValue operation={operation} valueOperation={operation.valeur} showSign={true}
                    id={OPERATION_EDITION_FORM.VALUE} />
                </Typography>
                :
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
            }
        </>
    )
}
