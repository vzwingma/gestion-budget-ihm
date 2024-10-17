import OperationEditionModel from "../../../../Models/budgets/OperationEdition.model";
import BudgetMensuelModel from "../../../../Models/budgets/BudgetMensuel.model";
import OperationModel from "../../../../Models/budgets/Operation.model";
import {BUSINESS_GUID, TYPES_OPERATION_ENUM} from "../../../../Utils/AppBusinessEnums.constants";
import {getEventTargetId} from "../../../../Utils/OperationData.utils";
import {
    createEmptyErrors,
    EditFormProps,
    ErrorsFormProps,
    OPERATION_EDITION_FORM
} from "./OperationDetailPage.constants";
import {saveOperation, saveOperationIntercompte} from "./OperationDetailPage.extservices";


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
export function handleOperationEditionClick(event: any, {operation, budget} : OperationBudgetProps,
    editOperation: OperationEditionModel, editForm: EditFormProps, openEditForm: (editForm: EditFormProps) => void,
    setErrors: React.Dispatch<React.SetStateAction<ErrorsFormProps>>,
    onOperationUpdate: (budget: BudgetMensuelModel) => void) {


    if (event.target !== null && event.target !== undefined && budget?.actif) {

        const idElement = getEventTargetId(event.target);
        const enterKeyPress = event.type === 'keyup' && (event.code === 'Enter' || event.code === 'NumpadEnter');
        // Validation du formulaire
        if (enterKeyPress && editForm.formValidationEnabled) {
            handleValidateOperationForm(operation, budget, editOperation, editForm, setErrors, onOperationUpdate);
        } else if (idElement !== null && !idElement.endsWith(OPERATION_EDITION_FORM.INPUT)) {
            switch (idElement) {
                case OPERATION_EDITION_FORM.VALUE:
                    editForm.value = true;
                    break;
                case OPERATION_EDITION_FORM.LIBELLE:
                    editForm.libelle = true;
                    break;
                case OPERATION_EDITION_FORM.DATE_OPERATION:
                    editForm.dateOperation = true;
                    break;
                case OPERATION_EDITION_FORM.MENSUALITE:
                    editForm.mensualite = true;
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
 * @param valeurDate - La nouvelle date de l'opération.
 * @param editOperation - Le modèle d'opération à mettre à jour.
 * @param setEditOperation - La fonction de mise à jour de l'état pour le modèle d'opération.
 */
export function handleDateOperationFromAction(valeurDate: Date, editOperation: OperationEditionModel, setEditOperation: React.Dispatch<React.SetStateAction<OperationEditionModel>>) {
    editOperation.autresInfos.dateOperation = valeurDate;
    setEditOperation(editOperation);
}


/**
 * validation du formulaire - Description
 */
/**
 * Valide la description d'une opération et met à jour les erreurs si nécessaire.
 *
 * @param {OperationModel} editOperation - L'opération en cours d'édition.
 * @param {OperationModel} operation - L'opération à mettre à jour.
 * @param {ErrorsFormProps} errors - Les erreurs de formulaire à mettre à jour.
 */
function validateDescription(editOperation: OperationEditionModel, operation: OperationModel, errors: ErrorsFormProps) {
    // Description
    if (editOperation.libelle === null || editOperation.libelle === "") {
        errors.libelle = "Le champ Description est obligatoire";
    } else {
        operation.libelle = editOperation.libelle;
        errors.libelle = null;
    }
}



/**
 *
 * @param editOperation valeur de l'opération en cours d'édition
 * @param operation opération à mettre à jour
 * @param editForm champs en édition
 * @param errors erreurs du formulaire
 * @returns opération mise à jour ou erreurs
 */
function validateFormMontant(editOperation: OperationEditionModel, operation: OperationModel, editForm: EditFormProps, errors: ErrorsFormProps) {
    if (!editForm.value) return;

    if (!editOperation.valeur) {
        errors.valeur = "Le champ Valeur est obligatoire";
        return;
    }

    const formValeur = "" + editOperation.valeur;
    const { valeurCalculee, error } = calculateValeur(formValeur.replace(",", "."));
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
    console.log("Valeur calculée : ", operation.valeur);
}

/**
 * validation du formulaire - Catégories
 */
function validateFormCategories(editOperation: OperationEditionModel, operation: OperationModel, errors: ErrorsFormProps) {
    if (editOperation.categorie.id === null || editOperation.categorie.libelle === null || editOperation.ssCategorie.id === null || editOperation.ssCategorie.libelle === null) {
        errors.categorie = "Le champ Catégorie est obligatoire"
    } else {
        operation.categorie = editOperation.categorie
        operation.ssCategorie = editOperation.ssCategorie
        errors.categorie = null
    }
}

/**
 * validation du formulaire - Transfert intercomptes
 */
function validateFormTransfertIntercompte(editOperation: OperationEditionModel, intercompte: string | null, operation: OperationModel, errors: ErrorsFormProps) {
    if (editOperation.ssCategorie.id === BUSINESS_GUID.SOUS_CAT_INTER_COMPTES && intercompte === null) {
        errors.intercompte = "Le champ Intercompte est obligatoire"
    } else {
        operation.intercompte = intercompte
        errors.intercompte = null
    }
}


/**
* Validation du formulaire d'opération.
*
* @param {OperationEditionModel} editOperation - Le modèle d'opération en cours d'édition.
* @param {OperationModel} operation - Le modèle de l'opération à valider.
* @param {EditFormProps} editForm - Les propriétés du formulaire d'édition.
* @param {ErrorsFormProps} errors - Les erreurs du formulaire.
*/
export function validateForm(editOperation: OperationEditionModel, operation: OperationModel, editForm: EditFormProps, errors: ErrorsFormProps) {
    // Description
    validateDescription(editOperation, operation, errors);

    // Valeur
    validateFormMontant(editOperation, operation, editForm, errors);
    // DateOperation
    operation.autresInfos.dateOperation = editOperation.autresInfos.dateOperation;

    // Catégorie / ssCatégorie
    validateFormCategories(editOperation, operation, errors);
    // Intercompte
    if (isInCreateMode(editForm)) {
        validateFormTransfertIntercompte(editOperation, editOperation.intercompte, operation, errors);
    }
}


/**
 * Calcul de l'équation mathématique (sans eval) depuis une chaine de caractères
 * @param valueToCalculate : string : chaine de caractères à calculer à saisie
 * @returns {string} résultat
 *
 */
function processEquation(valueToCalculate: string): string {
    if (valueToCalculate.length <= 1000) {
        let match = valueToCalculate.match(/[*/+\-^]/gmsi) || [];
        while (match.length > 0) {
            valueToCalculate = valueToCalculate.replace(/\((.*?)\)/gmsi, (_, s) => {
                return processEquation(s)
            }).replace(/([0-9.-]+)\^([0-9.-]+)/gmsi, (_, n1, n2) => {
                return Math.pow(n1, n2).toString()
            }).replace(/([0-9.-]+)([*/])([0-9.-]+)/gmsi, (_, n1, o, n2) => {
                return (o === '*' ? Number(n1) * Number(n2) : Number(n1) / Number(n2)).toString();
            }).replace(/([0-9.-]+)([-+])([0-9.-]+)/gmsi, (_, n1, o, n2) => {
                return (o === '+' ? Number(n1) + Number(n2) : Number(n1) - Number(n2)).toString();
            });
            match = valueToCalculate.match(/[*/+-]/gmsi) || [];
        }
    }
    return valueToCalculate
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
    editForm: EditFormProps, setErrors: React.Dispatch<React.SetStateAction<ErrorsFormProps>>,
    onOperationUpdate: (budget: BudgetMensuelModel) => void) {

    if (isInEditMode(editForm)) {
        let errors = createEmptyErrors();
        validateForm(editOperation, operation, editForm, errors);

        let hasErrors = false;
        for (let error in errors) {
            if (errors[error as keyof ErrorsFormProps] !== null) {
                hasErrors = true;
            }
        }

        if (hasErrors) {
            console.log("Erreurs présentes dans le formulaire", errors)
            setErrors(errors);
        } else if (editOperation.ssCategorie.id === BUSINESS_GUID.SOUS_CAT_INTER_COMPTES && isInCreateMode(editForm)) {
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
    return editForm.value || editForm.libelle || editForm.dateOperation || editForm.mensualite;
}

/**
 * Test si en mode édition d'au moins un champ
 * @returns {boolean}
 */
export function isInCreateMode(editForm: EditFormProps): boolean {
    return editForm.value && editForm.libelle && editForm.dateOperation && editForm.mensualite;
}
