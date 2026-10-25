/** Hauteur (px) de la barre de filtres (puces + résultat) de l'en-tête de la page Budget, à retrancher de la liste */
export const FILTER_BAR_HEIGHT = 48;

/**
 * Get the appropriate height for lists based on device type
 * @param isMobile true si affichage mobile / tablette
 * @param reservedHeight hauteur (px) occupée en plus dans l'en-tête (ex. barre de filtres), 0 par défaut
 * @returns {number} calculated height in pixels
 */
export function getHeightList(isMobile : boolean, reservedHeight : number = 0) {
    return (isMobile ? window.innerHeight - 95 : window.innerHeight - 140) - reservedHeight;
}
