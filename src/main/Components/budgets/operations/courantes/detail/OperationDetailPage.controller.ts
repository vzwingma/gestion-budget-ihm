import OperationEditionModel from "../../../../../Models/budgets/OperationEdition.model.ts";
import BudgetMensuelModel from "../../../../../Models/budgets/BudgetMensuel.model.ts";
import OperationModel from "../../../../../Models/budgets/Operation.model.ts";
import { BUSINESS_GUID} from "../../../../../Utils/AppBusinessEnums.constants.ts";
import { getEventTargetId } from "../../../../../Utils/OperationData.utils.ts";
import {
    createEmptyErrors,
    EditFormProps,
    ErrorsFormProps,
    OPERATION_EDITION_FORM
} from "./OperationDetailPage.constants.ts";
import { saveOperation, saveOperationIntercompte } from "./OperationDetailPage.extservices.ts";
import { Dispatch, SetStateAction } from "react";
import { validateFormDateFinPeriode } from "../../recurrentes/details/subcomponents/OperationRecurrenteDetailDateFin.component.tsx";
import { validateDescription } from "./subcomponents/OperationDetailLibelle.controller.ts";
import { validateFormCategories } from "./subcomponents/OperationDetailCategories.component.tsx";
import { validateFormTransfertIntercompte } from "./subcomponents/OperationDetailIntercompte.component.tsx";
import { validateFormMontant } from "./subcomponents/OperationDetailValeur.component.tsx";


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
export function handleOperationEditionClick(event: any, { operation, budget }: OperationBudgetProps,
    editOperation: OperationEditionModel, editForm: EditFormProps, openEditForm: (editForm: EditFormProps) => void,
    setErrors: Dispatch<SetStateAction<ErrorsFormProps>>,
    onOperationUpdate: (budget: BudgetMensuelModel) => void) {


    if (event.target !== null && event.target !== undefined && budget?.actif) {

        const idElement = getEventTargetId(event.target);
        const enterKeyPress = event.type === 'keyup' && (event.code === 'Enter' || event.code === 'NumpadEnter');
        // Validation du formulaire
        if (enterKeyPress && editForm.formValidationEnabled) {
            handleValidateOperationForm(operation, budget, editOperation, editForm, setErrors, onOperationUpdate);
        } else if (idElement !== null && idElement !== undefined && !idElement.endsWith(OPERATION_EDITION_FORM.INPUT)) {
            switch (idElement) {
                case OPERATION_EDITION_FORM.VALUE:
                    editForm.value = true;
                    break;
                case OPERATION_EDITION_FORM.LIBELLE:
                    editForm.libelle = true;
                    break;
                case OPERATION_EDITION_FORM.CATEGORIE_TYPE:
                    editForm.categorieType = true;
                    break;
                case OPERATION_EDITION_FORM.DATE_OPERATION:
                    editForm.dateOperation = true;
                    break;
                case OPERATION_EDITION_FORM.MENSUALITE:
                    editForm.mensualite = true;
                    break;
                case OPERATION_EDITION_FORM.DATE_FIN:
                    editForm.dateFin = true;
                    break;
                default:
                    break;
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
export function validateForm(budget: BudgetMensuelModel, editOperation: OperationEditionModel, operation: OperationModel, editForm: EditFormProps, errors: ErrorsFormProps) {
    // Description
    validateDescription(editOperation, operation, errors);

    // Valeur
    validateFormMontant(editOperation, operation, editForm, errors);
    // DateOperation
    operation.autresInfos.dateOperation = editOperation.autresInfos.dateOperation;
    // DateFin
    validateFormDateFinPeriode(budget, editOperation, operation, editForm, errors);

    // Catégorie / ssCatégorie
    validateFormCategories(editOperation, operation, errors);
    // Intercompte
    if (isInCreateMode(editForm)) {
        validateFormTransfertIntercompte(editOperation, editOperation.intercompte, operation, errors);
    }
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
    editForm: EditFormProps, setErrors: Dispatch<SetStateAction<ErrorsFormProps>>,
    onOperationUpdate: (budget: BudgetMensuelModel) => void) {

    if (isInEditMode(editForm)) {
        let errors = createEmptyErrors();
        validateForm(budget, editOperation, operation, editForm, errors);

        let hasErrors = false;
        for (let error in errors) {
            if (errors[error as keyof ErrorsFormProps] !== null) {
                hasErrors = true;
            }
        }

        if (hasErrors) {
            console.log("Erreurs présentes dans le formulaire", errors)
            setErrors(errors);
        } else if (editOperation.ssCategorie.id === BUSINESS_GUID.SS_CAT_VIREMENT_INTERNE && isInCreateMode(editForm)) {
            // Create Update Opération Intercomptes
            saveOperationIntercompte(operation, budget, editOperation.intercompte, onOperationUpdate);
        } else {
            // Create Update Opération
            saveOperation(operation, budget, onOperationUpdate);
        }
    }
}


/**
 * Test si en mode édition d'au moins un champ
 * @returns {boolean}
 */
export function isInEditMode(editForm: EditFormProps): boolean {
    return editForm.value || editForm.libelle || editForm.dateOperation || editForm.mensualite || editForm.dateFin || editForm.categorieType;
}

/**
 * Test si en mode édition d'au moins un champ
 * @returns {boolean}
 */
export function isInCreateMode(editForm: EditFormProps): boolean {
    return editForm.value && editForm.libelle && editForm.dateOperation && editForm.mensualite && editForm.categorieType;
}
