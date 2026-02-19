import CompteBancaireModel from "../Models/budgets/CompteBancaire.model.ts";
import { UTILISATEUR_DROITS } from "./AppBusinessEnums.constants.ts";


/**
 * Vérifie si l'utilisateur a le droit nécessaire
 * @param droitsUtilisateur droits de l'utilisateur
 * @param droitNecessaire droit nécessaire
 * @returns {boolean} true si l'utilisateur a le droit
 */
export function userHasPermission(droitsUtilisateur: UTILISATEUR_DROITS[], droitNecessaire: UTILISATEUR_DROITS): boolean {
    return droitsUtilisateur.includes(droitNecessaire);
}



export function getCompteGroupByOwner(comptes: CompteBancaireModel[], activeUser: string): Record<string, CompteBancaireModel[]> {
    return comptes
        .filter((compte) => compte.actif)
        .filter(compte => compte.proprietaires.flatMap(p => p.login).includes(activeUser ?? ''))
        .reduce((groups, compte) => {
            const owner = compte.proprietaires[0]?.login.split('.')[0].charAt(0).toUpperCase() + compte.proprietaires[0]?.login.split('.')[0].slice(1) || 'Unknown';

            if (!groups[owner]) groups[owner] = [];
            groups[owner].push(compte);
            return groups;
        }, {} as Record<string, CompteBancaireModel[]>);

};