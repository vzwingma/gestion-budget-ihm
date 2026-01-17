import OperationEditionModel from "../../../../../Models/budgets/OperationEdition.model.ts";
import BudgetMensuelModel from "../../../../../Models/budgets/BudgetMensuel.model.ts";
import OperationModel from "../../../../../Models/budgets/Operation.model.ts";
import {getEventTargetId} from "../../../../../Utils/OperationData.utils.ts";
import {Dispatch, SetStateAction} from "react";
import { createEmptyErrors, EditRFormProps, ErrorsRFormProps, OPERATION_RECURRENTE_EDITION_FORM } from "./OperationRecurrenteDetailPage.constants.ts";
import { saveOperation } from "../../courantes/detail/OperationDetailPage.extservices.ts";
import { validateFormDateFinPeriode } from "./subcomponents/OperationRecurrenteDetailDateFin.component.tsx";


interface OperationBudgetProps {
    operation: OperationModel;
    budget: BudgetMensuelModel;
}
/**
 * Event sur le clic d'une édition d'opération
 * @param event événement sur le clic d'une opération
 * @param operation  opération en cours
 * @param budget budget associé
 * @param editOperation opération en cours d'édition
 * @param editForm formulaire d'édition
 * @param openEditForm fonction pour ouvrir le formulaire d'édition
 * @param errors erreurs du formulaire
 * @param setErrors fonction pour mettre à jour les erreurs du formulaire
 * @param onOperationUpdate mise à jour de l'opération
 */
export function handleOperationRecurrenteEditionClick(event: any, {operation, budget} : OperationBudgetProps,
    editOperation: OperationEditionModel, editForm: EditRFormProps, openEditForm: (editForm: EditRFormProps) => void,
    setErrors: Dispatch<SetStateAction<ErrorsRFormProps>>, onOperationUpdate: (budget: BudgetMensuelModel) => void) {


    if (event.target !== null && event.target !== undefined && budget?.actif) {

        const idElement = getEventTargetId(event.target);
        const enterKeyPress = event.type === 'keyup' && (event.code === 'Enter' || event.code === 'NumpadEnter');
        // Validation du formulaire
        if (enterKeyPress && editForm.formValidationEnabled) {
            handleValidateOperationForm(operation, budget, editOperation, editForm, setErrors, onOperationUpdate);
        } else if (idElement !== null && idElement !== undefined && !idElement.endsWith(OPERATION_RECURRENTE_EDITION_FORM.INPUT)) {
            if (idElement === OPERATION_RECURRENTE_EDITION_FORM.DATE_FIN) {
                editForm.dateFin = true;
            }
            openEditForm(editForm);
        }
    }
}

/**
 * Met à jour la date de l'opération dans le modèle d'opération et déclenche la mise à jour de l'état.
 *
 * @param editOperation - Le modèle d'opération à mettre à jour.
 * @param setEditOperation - La fonction de mise à jour de l'état pour le modèle d'opération.
 */
export function handleDateOperationFromAction(editOperation: OperationEditionModel, setEditOperation: Dispatch<SetStateAction<OperationEditionModel>>) {
    setEditOperation(editOperation);
}




/**
* Validation du formulaire d'opération.
*
* @param {OperationEditionModel} editOperation - Le modèle d'opération en cours d'édition.
* @param {OperationModel} operation - Le modèle de l'opération à valider.
* @param {EditFormProps} editForm - Les propriétés du formulaire d'édition.
* @param {ErrorsFormProps} errors - Les erreurs du formulaire.
*/
export function validateForm(budget: BudgetMensuelModel, editOperation: OperationEditionModel, operation: OperationModel, editForm: EditRFormProps, errors: ErrorsRFormProps) {
    validateFormDateFinPeriode(budget, editOperation, operation, editForm, errors);
}



/**
 * Gère la validation du formulaire d'opération.
 *
 * @param {OperationModel} operation - Le modèle de l'opération à valider.
 * @param {BudgetMensuelModel} budget - Le modèle du budget mensuel associé.
 * @param {OperationModel} editOperation - Le modèle de l'opération en cours d'édition.
 * @param {EditFormProps} editForm - Les propriétés du formulaire d'édition.
 * @param {React.Dispatch<React.SetStateAction<ErrorsFormProps>>} setErrors - Fonction pour mettre à jour l'état des erreurs du formulaire.
 * @param onOperationUpdate - Fonction pour mettre à jour l'opération.
 */
export function handleValidateOperationForm(operation: OperationModel, budget: BudgetMensuelModel, editOperation: OperationEditionModel,
                                            editForm: EditRFormProps, setErrors: Dispatch<SetStateAction<ErrorsRFormProps>>,
    onOperationUpdate: (budget: BudgetMensuelModel) => void) {

    if (isInEditMode(editForm)) {
        let errors = createEmptyErrors();
        validateForm(budget, editOperation, operation, editForm, errors);

        let hasErrors = false;
        for (let error in errors) {
            if (errors[error as keyof ErrorsRFormProps] !== null) {
                hasErrors = true;
            }
        }

        if (hasErrors) {
            console.log("Erreurs présentes dans le formulaire", errors)
            setErrors(errors);
        } else {
        // Create Update Opération
        saveOperation(operation, budget, onOperationUpdate);
        console.log("Opération sauvegardée", operation);
        }
    }
}


/**
 * Test si en mode édition d'au moins un champ
 * @returns {boolean}
 */
export function isInEditMode(editForm: EditRFormProps): boolean {
    return editForm.dateFin;
}

