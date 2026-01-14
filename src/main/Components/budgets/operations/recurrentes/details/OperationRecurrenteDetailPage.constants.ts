import { getLabelFRFromDate } from "../../../../../Utils/Date.utils.ts"

/**
 * Constantes des ID pour le formulaire
 */
export enum OPERATION_RECURRENTE_EDITION_FORM {
    FORM = "OPERATION_FORM",
    DATE_FIN = "OPERATION_DATE_FIN",
    INPUT = "_INPUT",
    FORM_VALIDATION = "FORM_VALIDATION"
}


/**
 * @interface EditFormProps
 * @description Interface représentant les propriétés du formulaire d'édition.
 *
 * @property {boolean} dateFin - Indique si la date de fin est éditée.
 * @property {boolean} mensualite - Indique si la mensualité est éditée.
 * @property {boolean} formValidationEnabled - Indique si la validation du formulaire est éditée.
 */
export interface EditFormProps {
    dateFin: boolean
    mensualite: boolean
    formValidationEnabled: boolean
}

export function createEmptyEditForm(): EditFormProps {
    return {
        mensualite: false,
        dateFin: false,
        formValidationEnabled: false
    }
}

/**
 * Interface représentant les erreurs possibles pour les détails d'une opération.
 *
 * @property {string | null} dateFin - Erreur associée à la date de fin de l'opération.
 */
export interface ErrorsFormProps {
    dateFin: string | null
}

export function createEmptyErrors(): ErrorsFormProps {
    return {
        dateFin: null,
    }
}


/**
 * 
 * @param dateOperation 
 * @param prochaineEcheance 
 * @returns 
 */
export function getProchaineEcheance(dateOperation: Date, prochaineEcheance: number): string {
    if (prochaineEcheance < 0) {
        return "Aucune"
    } else {
        let dateNow = dateOperation ? new Date(dateOperation) : new Date();
        dateNow.setMonth(dateNow.getMonth() + prochaineEcheance);
        return getLabelFRFromDate(dateNow)
    }
}