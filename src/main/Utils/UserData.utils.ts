import { UTILISATEUR_DROITS } from "./AppBusinessEnums.constants.js";


/**
 * Vérifie si l'utilisateur a le droit nécessaire
 * @param droitsUtilisateur droits de l'utilisateur
 * @param droitNecessaire droit nécessaire
 * @returns {boolean} true si l'utilisateur a le droit
 */
export function userHasPermission(droitsUtilisateur: UTILISATEUR_DROITS[], droitNecessaire : UTILISATEUR_DROITS) : boolean {
    return droitsUtilisateur.find(droit => droit === droitNecessaire) !== undefined;
}