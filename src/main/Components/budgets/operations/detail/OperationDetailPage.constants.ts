/**
 * Constantes des ID pour le formulaire
 * @type {{INTERCOMPTES: string, INPUT: string, FORM: string, DATE_OPERATION: string, LIBELLE: string, MENSUALITE: string, VALUE: string, CATEGORIE: string}}
 */
export enum OPERATION_EDITION_FORM {
    FORM = "OPERATION_FORM",
    VALUE = "OPERATION_VALUE",
    LIBELLE = "OPERATION_LIBELLE",
    DATE_OPERATION = "OPERATION_DATE_OPERATION",
    MENSUALITE = "OPERATION_MENSUALITE",
    CATEGORIE = "OPERATION_CATEGORIE",
    INTERCOMPTES = "OPERATION_INTERCOMPTES",
    INPUT = "_INPUT",
    FORM_VALIDATION = "FORM_VALIDATION"
}


/**
 * @interface EditFormProps
 * @description Interface représentant les propriétés du formulaire d'édition.
 *
 * @property {boolean} value - Indique si la valeur est éditée.
 * @property {boolean} libelle - Indique si le libellé est éditée.
 * @property {boolean} dateOperation - Indique si la date de l'opération est éditée.
 * @property {boolean} mensualite - Indique si la mensualité est éditée.
 * @property {boolean} categories - Indique si les catégories sont éditée.
 * @property {boolean} formValidationEnabled - Indique si la validation du formulaire est éditée.
 */
export interface EditFormProps {
    value: boolean
    libelle: boolean
    dateOperation: boolean
    mensualite: boolean
    categories: boolean
    formValidationEnabled: boolean
}

export function createEmptyEditForm(operationInCreation: boolean): EditFormProps {
    return {
        value: operationInCreation,
        libelle: operationInCreation,
        dateOperation: operationInCreation,
        mensualite: operationInCreation,
        categories: operationInCreation,
        formValidationEnabled: false
    }
}

/**
 * Interface représentant les erreurs possibles pour les détails d'une opération.
 *
 * @property {string | null} valeur - Erreur associée à la valeur de l'opération.
 * @property {string | null} libelle - Erreur associée au libellé de l'opération.
 * @property {string | null} categorie - Erreur associée à la catégorie de l'opération.
 * @property {string | null} compte - Erreur associée au compte de l'opération.
 */
export interface ErrorsFormProps {
    valeur: string | null
    dateOperation: string | null
    libelle: string | null
    categorie: string | null
    compte: string | null
    intercompte: string | null
}

export function createEmptyErrors(): ErrorsFormProps {
    return {
        valeur: null,
        dateOperation: null,
        libelle: null,
        categorie: null,
        compte: null,
        intercompte: null
    }
}