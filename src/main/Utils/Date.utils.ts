/**
 * Retourne le label Fr d'une date
 * @param dateOperation date à afficher
 * @returns {string} label FR de la date
 */
export function getLabelDate(dateOperation: string): string {
    return new Date(Date.parse(dateOperation)).toLocaleDateString("fr");
}

export function getLabelFromDate(dateOperation: Date): string {
    return dateOperation.toLocaleDateString("fr");
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
