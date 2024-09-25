import { UTILISATEUR_DROITS } from "./AppBusinessEnums.constants";


/**
 * Vérifie si l'utilisateur a le droit nécessaire
 * @param droits droits de l'utilisateur
 * @param droitNecessaire droit nécessaire
 * @returns {boolean} true si l'utilisateur a le droit
 */
export function userHasPermission(droits: UTILISATEUR_DROITS[], droitNecessaire : UTILISATEUR_DROITS) : boolean {
    for (let droit of droits) {
        if (droit === droitNecessaire) {
            return true;
        }
    }
    return false;
}