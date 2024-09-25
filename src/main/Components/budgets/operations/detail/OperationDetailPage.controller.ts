import CategorieOperationModel from "@/src/main/Models/CategorieOperation.model";
import OperationModel from "@/src/main/Models/Operation.model";
import {OPERATION_EDITION_FORM_IDS} from "./OperationDetailPage.constants";
import {BUSINESS_GUID} from "@/src/main/Utils/AppBusinessEnums.constants";
import {saveOperation, saveOperationIntercompte} from "./OperationDetailPage.extservices";
import BudgetMensuelModel from "@/src/main/Models/BudgetMensuel.model";
import {getEventTargetId, sortLibellesCategories} from "@/src/main/Utils/DataUtils.utils";
import {EditFormProps, ErrorsFormProps} from "./OperationDetailPage.component";


/**
 * Liste de toutes les catégories
 * @returns {*}
 */

export function getListeAllCategories(listeCategories: CategorieOperationModel[]): any {
    return listeCategories
        /*
            .flatMap((cat : CategorieOperationModel) => {
                for (let (ssCat : CategorieOperationModel) in cat.listeSSCategories) {
                    cat.listeSSCategories[ssCat].categorieParente = cat
                }
                return cat.listeSSCategories
            }) */
        .sort(sortLibellesCategories);
}

/**
 * Click sur un élément à éditer de la page de détail
 * @param event click
 */
export function handleOperationEditionClick(event: any, operation: OperationModel, budget: BudgetMensuelModel, editOperation: OperationModel, editForm: EditFormProps, setEditForm: React.Dispatch<React.SetStateAction<EditFormProps>>, errors: ErrorsFormProps, setErrors: React.Dispatch<React.SetStateAction<ErrorsFormProps>>, onOperationChange: (budget: BudgetMensuelModel) => void) {


    if (event.target !== null && event.target !== undefined && budget?.actif) {
        const idElement = getEventTargetId(event.target);
        const enterKeyPress = event.type === 'keyup' && (event.code === 'Enter' || event.code === 'NumpadEnter');

        // Validation du formulaire
        if (enterKeyPress && editForm.formValidationEnabled) {
            handleValidateOperationForm(operation, budget, editOperation, editForm, setEditForm, errors, setErrors, onOperationChange);
        } else if (!idElement.endsWith(OPERATION_EDITION_FORM_IDS.INPUT)) {
            switch (idElement) {
                case OPERATION_EDITION_FORM_IDS.VALUE:
                    editForm.value = true;
                    break;
                case OPERATION_EDITION_FORM_IDS.LIBELLE:
                    editForm.libelle = true;
                    break;
                case OPERATION_EDITION_FORM_IDS.DATE_OPERATION:
                    editForm.dateOperation = true;
                    break;
                case OPERATION_EDITION_FORM_IDS.MENSUALITE:
                    editForm.mensualite = true;
                    break;
                default:
                    break;
            }
            setEditForm(editForm)
        }
    }
}

export function handleDateOperationFromAction(valeurDate: Date, editOperation: OperationModel, setEditOperation: React.Dispatch<React.SetStateAction<OperationModel>>) {
    editOperation.autresInfos.dateOperation = valeurDate;
    setEditOperation(editOperation);
}


/**
 * validation du formulaire - Description
 */
function validateDescription(editOperation: OperationModel, operation: OperationModel, errors: ErrorsFormProps) {
    // Description
    if (editOperation.libelle === null || editOperation.libelle === "") {
        errors.libelle = "Le champ Description est obligatoire";
    } else {
        operation.libelle = editOperation.libelle;
    }
}

/**
 * validation du formulaire - Montant
 */
function validateFormMontant(editOperation: OperationModel, operation: OperationModel, editForm: EditFormProps, errors: ErrorsFormProps) {
    if (!editForm.value) return;

    if (!editOperation.valeur) {
        errors.valeur = "Le champ Valeur est obligatoire";
        return;
    }

    const formValeur = "" + editOperation.valeur;
    const {valeurCalculee, error} = calculateValeur(formValeur.replace(",", "."));
    if (error) {
        errors.valeur = error;
        return;
    }
    if (!valeurCalculee || !validateValue(valeurCalculee)) {
        errors.valeur = "Le format est incorrect : 0000.00 €";
        return;
    }

    operation.valeur = (editOperation.typeOperation === "DEPENSE" ? -1 : 1) * Number(valeurCalculee);
}

/**
 * validation du formulaire - Catégories
 */
export function validateFormCategories(editOperation: OperationModel, operation: OperationModel, errors: ErrorsFormProps) {
    if (editOperation.categorie.id === null || editOperation.categorie.libelle === null || editOperation.ssCategorie.id === null || editOperation.ssCategorie.libelle === null) {
        errors.categorie = "Le champ Catégorie est obligatoire"
    } else {
        operation.categorie = editOperation.categorie
        operation.ssCategorie = editOperation.ssCategorie
    }
}

/**
 * validation du formulaire - Transfert intercomptes
 */
export function validateFormTransfertIntercompte(editOperation: OperationModel, intercompte: string | null, operation: OperationModel, errors: ErrorsFormProps) {
    if (editOperation.ssCategorie.id === BUSINESS_GUID.SOUS_CAT_INTER_COMPTES && intercompte === null) {
        errors.intercompte = "Le champ Intercompte est obligatoire"
    } else {
        operation.intercompte = intercompte
    }
}

/**
 * validation du formulaire
 */
export function validateForm(editOperation: OperationModel, operation: OperationModel, editForm: EditFormProps, errors: ErrorsFormProps) {
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
        return {valeurCalculee: calculee, error: null};
    } catch (e) {
        console.error("Erreur dans la valeur saisie ", formValue, e)
        return {valeurCalculee: null, error: "Le champ Montant est incorrect"};
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
 * @param {CompteBancaireModel} intercompte - Le modèle du compte bancaire intercompte.
 * @param {EditFormProps} editForm - Les propriétés du formulaire d'édition.
 * @param {React.Dispatch<React.SetStateAction<EditFormProps>>} setEditForm - Fonction pour mettre à jour l'état du formulaire d'édition.
 * @param {ErrorsFormProps} errors - Les erreurs du formulaire.
 * @param {React.Dispatch<React.SetStateAction<ErrorsFormProps>>} setErrors - Fonction pour mettre à jour l'état des erreurs du formulaire.
 */
export function handleValidateOperationForm(operation: OperationModel, budget: BudgetMensuelModel, editOperation: OperationModel,
                                            editForm: EditFormProps, setEditForm: React.Dispatch<React.SetStateAction<EditFormProps>>, 
                                            errors: ErrorsFormProps, setErrors: React.Dispatch<React.SetStateAction<ErrorsFormProps>>, 
                                            onOperationChange: (budget: BudgetMensuelModel) => void) {

    if (isInEditMode(editForm)) {
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
        } else {
            if (editOperation.ssCategorie.id === BUSINESS_GUID.SOUS_CAT_INTER_COMPTES && isInCreateMode(editForm)) {
                // Create Update Opération Intercomptes
                saveOperationIntercompte(operation, budget, editOperation.intercompte, onOperationChange);
            } else {
                // Create Update Opération
                saveOperation(operation, budget, onOperationChange);
            }

            handleCloseOperationForm(setEditForm, setErrors);
        }

    }
}


/**
 * Test si en mode édition d'au moins un champ
 * @returns {*|boolean}
 */
export function isInEditMode(editForm: EditFormProps): boolean {
    return editForm.value || editForm.libelle || editForm.dateOperation || editForm.mensualite;
}

/**
 * Test si en mode édition d'au moins un champ
 * @returns {*|boolean}
 */
export function isInCreateMode(editForm: EditFormProps): boolean {
    return editForm.value && editForm.libelle && editForm.dateOperation && editForm.mensualite;
}


/**
 * Fermeture des items en édition de la page
 */
export function handleCloseOperationForm(setEditForm: React.Dispatch<React.SetStateAction<EditFormProps>>, setErrors: React.Dispatch<React.SetStateAction<ErrorsFormProps>>) {

    const editForm: EditFormProps = {
        value: false,
        libelle: false,
        dateOperation: false,
        mensualite: false,
        categories: false,
        formValidationEnabled: false
    };
    setEditForm(editForm);
    const errors: ErrorsFormProps = {
        libelle: null,
        valeur: null,
        categorie: null,
        intercompte: null,
        dateOperation: null,
        compte: null
    };
    setErrors(errors);

}

