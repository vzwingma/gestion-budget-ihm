import * as DataUtils from "../../../Utils/DataUtils.utils";


export function handleValidateOperationForm() {

    let errors = this.state.errors;
    let hasErrors = false;
    // Description
    if (this.state.editOperation.libelle === null || this.state.editOperation.libelle === "") {
        errors.libelle = "Le champ Description est obligatoire";
        hasErrors = true;
    } else {
        this.props.operation.libelle = this.state.editOperation.libelle;
    }

    // Valeur
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

    // DateOperation
    this.props.operation.autresInfos.dateOperation = this.state.editOperation.autresInfos.dateOperation;

    if (hasErrors) {
        this.setState({errors: errors})
    } else {
        this.saveOperation(this.props.operation, this.props.budget);
        this.handleCloseOperationForm();
    }


}

/**
 *    let validationCategorie = this.state.formCategorie === null
 *         let validationSsCategorie = this.state.formSsCategorie === null
 *         let validationPeriode = this.state.formOperationPeriodique === null || this.state.formOperationPeriodique.value === null
 *         let validationEtat = this.state.formEtat === null ||this.state.formEtat === ""

 */


/**
 * Fermeture des items en édition de la page
 */
export function handleCloseOperationForm() {

    let editForm = this.state.editForm;
    editForm.value = false;
    editForm.libelle = false;
    editForm.dateOperation = false;

    this.setState({editForm: editForm, errors: []})

}


/**
 * Click sur un élément à éditer de la page de détail
 * @param event click
 */
export function handleOperationEditionClick(event) {

    if (event.target !== null && event.target !== undefined) {
        const idElement = DataUtils.getEventTargetId(event.target);

        const enterKeyPress = event.type === 'keyup' && (event.code === 'Enter' || event.code === 'NumpadEnter');

        // Validation du formulairea
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
                case OPERATION_EDITION_FORM_IDS.FORM:
                    this.handleValidateOperationForm();
                    break;
                default:
                    break;
            }
            this.setState({editForm: editForm})
        }

    }
}


export const OPERATION_EDITION_FORM_IDS = {
    FORM: "OPERATION_FORM",
    VALUE: "OPERATION_VALUE",
    LIBELLE: "OPERATION_LIBELLE",
    DATE_OPERATION: "OPERATION_DATE_OPERATION",
    INPUT: "_INPUT",
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
            "id": operation.ssCategorie.id,
            "libelle": operation.ssCategorie.libelle
        },
        "typeOperation": operation.typeOperation,
        "etat": operation.etat,
        "valeur": (operation.typeOperation === "DEPENSE" ? -1 : 1) * operation.valeur,
        "mensualite": operation.mensualite,
        "autresInfos": {
            "dateOperation": operation.autresInfos.dateOperation
        }
    }
}



