/**
 * Constantes des ID pour le formulaire
 * @type {{INPUT: string, FORM: string, DATE_OPERATION: string, LIBELLE: string, VALUE: string}}
 */
export const OPERATION_EDITION_FORM_IDS = {
    FORM: "OPERATION_FORM",
    VALUE: "OPERATION_VALUE",
    LIBELLE: "OPERATION_LIBELLE",
    DATE_OPERATION: "OPERATION_DATE_OPERATION",
    MENSUALITE: "OPERATION_MENSUALITE",
    INPUT: "_INPUT",
}


/**
 * Constantes des périodes pour la liste SELECT
 * @type {[{text: string, value: string},{text: string, value: string},{text: string, value: string},{text: string, value: string},{text: string, value: string}]}
 */
export const LISTE_PERIODES_MENSUALITE = [
    {value: "PONCTUELLE", text: "Ponctuelle"},
    {value: "MENSUELLE", text: "Mensuelle"},
    {value: "TRIMESTRIELLE", text: "Trimestrielle"},
    {value: "SEMESTRIELLE", text: "Semestrielle"},
    {value: "ANNUELLE", text: "Annuelle"}
]

