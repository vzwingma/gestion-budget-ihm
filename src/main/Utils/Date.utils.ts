
const LOCALE_FR : Intl.LocalesArgument = 'fr-FR';
/**
 * Retourne le label Fr d'une date
 * @param dateOperation date à afficher
 * @returns {string} label FR de la date
 */
export function getLabelFRFromDate(dateOperation: Date): string {
    return new Date(dateOperation).toLocaleDateString(LOCALE_FR);
}


/**
 * Jour de la semaine abrégé (fuseau local), capitalisé : « Lun. », « Mar. »…
 * @param dateOperation date
 * @returns {string} jour de semaine abrégé FR
 */
export function getLabelJourSemaineFRFromDate(dateOperation: Date): string {
    const jour = new Date(dateOperation).toLocaleDateString(LOCALE_FR, {weekday: "short"});
    return jour.charAt(0).toUpperCase() + jour.slice(1);
}


export function getLabelMonthFRFromDate(dateOperation: Date): string {
    const options : Intl.DateTimeFormatOptions = {
        year: "numeric",
        month: "long"
        };
    return new Date(dateOperation).toLocaleDateString(LOCALE_FR, options);
}

/**
 * Retourne le label Fr d'une date
 * @param dateOperation date à afficher
 * @returns {string} label FR de la date
 */
export function getLabelISOFromDate(dateOperation: Date): string {
    return new Date(dateOperation).toISOString().split('T')[0];
}
/**
 * Convertit un nom de mois en numéro de mois.
 *
 * @param {string} mon - Le nom du mois.
 * @returns {number} - Le numéro du mois (1 pour janvier, 2 pour février, etc.).
 */
export function getMonthFromString(mon: string): number {
    return new Date(Date.parse(mon + " 1, 2012")).getMonth() + 1
}
