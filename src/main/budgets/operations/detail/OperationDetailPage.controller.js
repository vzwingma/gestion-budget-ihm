import * as DataUtils from "../../../Utils/DataUtils.utils";
import {OPERATION_EDITION_FORM_IDS} from "./OperationDetailPage.constants";
import {BUSINESS_GUID, TYPES_OPERATION_ENUM} from "../../../Utils/AppBusinessEnums.constants";


/**
 * Click sur un élément à éditer de la page de détail
 * @param event click
 */
export function handleOperationEditionClick(event) {

    if (event.target !== null && event.target !== undefined) {
        const idElement = DataUtils.getEventTargetId(event.target);

        const enterKeyPress = event.type === 'keyup' && (event.code === 'Enter' || event.code === 'NumpadEnter');

        // Validation du formulaire
        if (enterKeyPress) {
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


/**
 * Validation du formulaire
 */
export function handleValidateOperationForm() {

    if (this.isInEditMode()) {
        let errors = {};
        let hasErrors = false;
        // Description
        if (this.state.editOperation.libelle === null || this.state.editOperation.libelle === "") {
            errors.libelle = "Le champ Description est obligatoire";
            hasErrors = true;
        } else {
            this.props.operation.libelle = this.state.editOperation.libelle;
        }

        // Valeur
        if (this.state.editForm.value) {
            if (this.state.editOperation.valeur === null || this.state.editOperation.valeur === "") {
                errors.valeur = "Le champ Valeur est obligatoire";
                hasErrors = true;
            } else {
                let valeur = ("" + this.state.editOperation.valeur).replaceAll(",", ".");
                if (!/(^\d*.\d{2}$)/.test(valeur)) {
                    errors.valeur = "Le format est incorrect : 0000.00 €";
                    hasErrors = true;
                } else {
                    this.props.operation.valeur = (this.state.editOperation.typeOperation === "DEPENSE" ? -1 : 1) * valeur;
                }
            }
        }
        // DateOperation
        this.props.operation.autresInfos.dateOperation = this.state.editOperation.autresInfos.dateOperation;

        // Catégorie / ssCatégorie
        if (this.state.editOperation.categorie.id === null || this.state.editOperation.categorie.libelle === null || this.state.editOperation.ssCategorie.id === null || this.state.editOperation.ssCategorie.libelle === null) {
            errors.categorie = "Le champ Catégorie est obligatoire"
            hasErrors = true
        } else {
            this.props.operation.categorie = this.state.editOperation.categorie
            this.props.operation.ssCategorie = this.state.editOperation.ssCategorie
        }

        if (this.state.editOperation.ssCategorie.id === BUSINESS_GUID.SOUS_CAT_INTER_COMPTES) {
            if (this.state.intercompte === null) {
                errors.intercompte = "Le compte de transfert est obligatoire"
                hasErrors = true
            }
        }

        if (hasErrors) {
            console.log("Erreurs présentes dans le formulaire")
            console.log(errors)
            this.setState({errors: errors})
        } else {

            if (this.state.editOperation.ssCategorie.id === BUSINESS_GUID.SOUS_CAT_INTER_COMPTES) {
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



