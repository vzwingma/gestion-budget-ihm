import * as DataUtils from "../../../Utils/DataUtils.utils";
import {sortLibellesCategories} from "../../../Utils/DataUtils.utils";
import {OPERATION_EDITION_FORM_IDS} from "./OperationDetailPage.constants";
import {BUSINESS_GUID, TYPES_OPERATION_ENUM} from "../../../Utils/AppBusinessEnums.constants";


/**
 * Liste de toutes les catégories
 * @returns {*}
 */

export function getListeAllCategories() {
    return this.props.listeCategories
        .flatMap(cat => {
            for (let ssCat in cat.listeSSCategories) {
                cat.listeSSCategories[ssCat].categorieParente = cat
            }
            return cat.listeSSCategories
        })
        .sort(sortLibellesCategories);
}

/**
 * Click sur un élément à éditer de la page de détail
 * @param event click
 */
export function handleOperationEditionClick(event) {


    if (event.target !== null && event.target !== undefined && this.props.budget?.actif) {
        const idElement = DataUtils.getEventTargetId(event.target);
        const enterKeyPress = event.type === 'keyup' && (event.code === 'Enter' || event.code === 'NumpadEnter');

        // Validation du formulaire
        if (enterKeyPress && this.state.editOperation.formValidationEnabled) {
            this.handleValidateOperationForm();
        } else if (!idElement.endsWith(OPERATION_EDITION_FORM_IDS.INPUT)) {
            let editForm = this.state.editForm;

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
            this.setState({editForm: editForm})
        }
    }
}

export function handleDateOperationFromAction(valeurDate) {
    let editOperation = this.state.editOperation
    editOperation.autresInfos.dateOperation = valeurDate;
    this.setState({editOperation: editOperation})
}


    let errors = {};
    let hasErrors = false;

/**
 * validation du formulaire - Description
 */
export function validateDescription() {
    // Description
    if (this.state.editOperation.libelle === null || this.state.editOperation.libelle === "") {
        errors.libelle = "Le champ Description est obligatoire";
        hasErrors = true;
    } else {
        this.props.operation.libelle = this.state.editOperation.libelle;
    }
}

/**
 * validation du formulaire - Montant
 */
export function validateFormMontant() {
    if (this.state.editForm.value) {
        if (this.state.editOperation.valeur === null || this.state.editOperation.valeur === "") {
            errors.valeur = "Le champ Valeur est obligatoire";
            hasErrors = true;
        } else {
            const formValeur = "" + this.state.editOperation.valeur;
            const valeurCalculee = calculateValeur(formValeur.replaceAll(",", "."));
            if (valeurCalculee != null) {
                if (!validateValue(valeurCalculee)) {
                    errors.valeur = "Le format est incorrect : 0000.00 €";
                    hasErrors = true;
                } else {
                    this.props.operation.valeur = (this.state.editOperation.typeOperation === "DEPENSE" ? -1 : 1) * valeurCalculee;
                }
            }
        }
    }
}

/**
 * validation du formulaire - Catégories
 */
export function validateFormCategories() {
    if (this.state.editOperation.categorie.id === null || this.state.editOperation.categorie.libelle === null || this.state.editOperation.ssCategorie.id === null || this.state.editOperation.ssCategorie.libelle === null) {
        errors.categorie = "Le champ Catégorie est obligatoire"
        hasErrors = true
    } else {
        this.props.operation.categorie = this.state.editOperation.categorie
        this.props.operation.ssCategorie = this.state.editOperation.ssCategorie
    }
}

/**
 * validation du formulaire - Transfert intercomptes
 */
export function validateFormTransfertIntercompte() {
    if (this.state.editOperation.ssCategorie.id === BUSINESS_GUID.SOUS_CAT_INTER_COMPTES && this.state.intercompte === null) {
        errors.intercompte = "Le champ Intercompte est obligatoire"
        hasErrors = true
    } else {
        this.props.operation.intercompte = this.state.intercompte
    }
}

/**
 * validation du formulaire
 */
export function validateForm() {
    errors = {};
    hasErrors = false;
    // Description
    this.validateDescription();

    // Valeur
    this.validateFormMontant();
    // DateOperation
    this.props.operation.autresInfos.dateOperation = this.state.editOperation.autresInfos.dateOperation;

    // Catégorie / ssCatégorie
    this.validateFormCategories();
    // Intercompte
    if (this.isInCreateMode()) {
        this.validateFormTransfertIntercompte();
    }
}


/**
 * Calcul de la valeur d'une opération (en prenant en compte les opérations
 * @param formValue : string valeur saisie du formulaire
 * @returns {number} total
 */
function calculateValeur(formValue) {

    try {
        // eslint-disable-next-line no-eval
        return eval(formValue);
    } catch (e) {
        console.error("Erreur dans la valeur saisie " + formValue, e)
        errors.valeur = "Le champ Montant est incorrect";
        hasErrors = true;
        return null;
    }
}


/**
 * Validation du format de la valeur saisie
 * @param valeur valeur
 * @returns {boolean} vrai si la valeur est correcte
 */
function validateValue(valeur) {
    const valeurATester = ("" + valeur).replaceAll(",", ".");
    return /(^\d*(.\d{1,2})?$)/.test(valeurATester);
}

/**
 * Validation du formulaire
 */
export function handleValidateOperationForm() {

    if (this.isInEditMode()) {
        this.validateForm();

        if (hasErrors) {
            console.log("Erreurs présentes dans le formulaire", errors)
            this.setState({errors: errors})
        } else {
            if (this.props.operation.autresInfos.dateOperation === "") {
                this.props.operation.autresInfos.dateOperation = null
            }
            if (this.state.editOperation.ssCategorie.id === BUSINESS_GUID.SOUS_CAT_INTER_COMPTES && this.isInCreateMode()) {
                // Create Update Opération Intercomptes
                this.saveOperationIntercompte(this.props.operation, this.props.budget, this.state.intercompte);
            } else {
                // Create Update Opération
                this.saveOperation(this.props.operation, this.props.budget);
            }

            this.handleCloseOperationForm();
        }

    }
}


/**
 * Test si en mode édition d'au moins un champ
 * @returns {*|boolean}
 */
export function isInEditMode() {
    let editForm = this.state.editForm;
    return editForm.value || editForm.libelle || editForm.dateOperation || editForm.mensualite;
}

/**
 * Test si en mode édition d'au moins un champ
 * @returns {*|boolean}
 */
export function isInCreateMode() {
    let editForm = this.state.editForm;
    return editForm.value && editForm.libelle && editForm.dateOperation && editForm.mensualite;
}


/**
 * Fermeture des items en édition de la page
 */
export function handleCloseOperationForm() {

    let editForm = this.state.editForm;
    editForm.value = false;
    editForm.libelle = false;
    editForm.dateOperation = false;
    editForm.mensualite = false;
    editForm.categories = false;
    this.setState({editForm: editForm, errors: []})

}



/**
 * Création d'un objet Operation à partir du formulaire
 * @param operation : object : Operation à copier
 */
export function cloneOperation(operation) {
    return {
        "id": operation.id,
        "libelle": operation.libelle,
        "categorie": {
            "id": operation.categorie.id,
            "libelle": operation.categorie.libelle
        },
        "ssCategorie": {
            "id": operation.ssCategorie.id != null ? operation.ssCategorie.id : null,
            "libelle": operation.ssCategorie.libelle != null ? operation.ssCategorie.libelle : ""
        },
        "typeOperation": operation.typeOperation,
        "etat": operation.etat,
        "valeur": (operation.typeOperation === TYPES_OPERATION_ENUM.DEPENSE ? -1 : 1) * operation.valeur,
        "mensualite": operation.mensualite,
        "autresInfos": {
            "dateOperation": operation.autresInfos.dateOperation
        }
    }
}



