const BANQUES_ICON_DIR = "/img/banques/";
/** Icône par défaut si le nom de fichier fourni par l'API n'est pas sûr */
const DEFAULT_ICON_SRC = "/img/icon.webp";
/** Nom de fichier simple : lettres, chiffres, `_`, `-`, `.` (ni `/`, ni `\`) */
const SAFE_ICON_FILENAME = /^[\w.-]+$/;

/**
 * Retourne la source d'une icône de banque, à partir du nom de fichier fourni par l'API.
 * Seul un nom de fichier sûr est accepté (pas de `/`, ni de `..`) ; sinon icône par défaut.
 * @param itemIcon nom de fichier de l'icône (valeur API)
 * @returns {string} chemin de l'icône
 */
export function getBanqueIconSrc(itemIcon: string | null | undefined): string {
    if (typeof itemIcon === "string" && SAFE_ICON_FILENAME.test(itemIcon) && !itemIcon.includes("..")) {
        return BANQUES_ICON_DIR + itemIcon;
    }
    return DEFAULT_ICON_SRC;
}
