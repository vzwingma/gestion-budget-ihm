import React, {JSX, useContext} from 'react'
import {InputAdornment, TextField, Typography} from "@mui/material"
import {OPERATION_EDITION_FORM} from "../OperationDetailPage.constants"
import OperationValue from "./../../../../../Utils/renderers/OperationValue.renderer"
import {AddRounded, EuroRounded, RemoveRounded} from '@mui/icons-material'
import {addEndingZeros} from '../../../../../Utils/OperationData.utils'
import {TYPES_OPERATION_ENUM} from '../../../../../Utils/AppBusinessEnums.constants'
import {OperationDetailValeurProps} from '../../../../Components.props'
import {BudgetContext} from '../../../../../Models/contextProvider/BudgetContextProvider'


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
    /**
 * Remplit le champ "valeur" de l'état à partir de la saisie de l'utilisateur
 * @param {Event} e - L'événement de saisie
 */
    function fillValeurForm(e: any) {
        const value: string = addEndingZeros(e.target.value)
        fillOperationForm(OPERATION_EDITION_FORM.VALUE, value);
    }

    return (
        <Typography variant={"h4"} className={budgetActif ? "editableField" : ""}
            id={OPERATION_EDITION_FORM.VALUE}>
            {(!formValueInEdition) ?
                <OperationValue operation={operation} valueOperation={operation.valeur} showSign={true}
                    id={OPERATION_EDITION_FORM.VALUE} />
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
                    variant="standard" sx={{ width: "850px" }}
                    error={errorValeur != null} helperText={errorValeur}
                    onChange={fillValeurForm} />
            }
        </Typography>
    )
}
