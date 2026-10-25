import CompteBancaireModel from "../../../Models/budgets/CompteBancaire.model.ts";
import {UTILISATEUR_DROITS} from "../../../Utils/AppBusinessEnums.constants.ts";
import {call} from "../../../Services/ClientHTTP.service.ts";
import {callWithNotify} from "../../../Services/CallAndNotify.service.ts";
import {BACKEND_ENUM, METHODE_HTTP, SERVICES_URL} from "../../../Utils/AppTechEnums.constants.ts";
import CategorieOperationModel from "../../../Models/budgets/CategorieOperation.model.ts";
import BudgetMensuelModel from "../../../Models/budgets/BudgetMensuel.model.ts";
import {populateAllCategories} from "./Budget.controller.ts";
import { debug } from "../../../Utils/Debug.utils.ts";

/*
 * Services back-end des budgets
 */

/**
 * Charge les catégories depuis le back-end (version Promise, pour `useFetch` - AP 006 T11).
 */
export function fetchCategories(): Promise<CategorieOperationModel[]> {
    debug("Chargement des catégories");
    return callWithNotify(
        call(METHODE_HTTP.GET, BACKEND_ENUM.URL_PARAMS, SERVICES_URL.PARAMETRES.CATEGORIES),
        "Erreur lors du chargement des catégories"
    ).then((data: CategorieOperationModel[]) => populateAllCategories(data));
}



/**
 * Charge le budget d'un compte/mois depuis le back-end (version Promise, pour `useFetch` - AP 006 T11).
 * Résolue avec `undefined` si compte ou date non renseignés.
 */
export function fetchBudget(selectedCompte: CompteBancaireModel | null, selectedDate?: Date): Promise<BudgetMensuelModel | undefined> {
    if (selectedCompte == null || selectedDate == null) {
        return Promise.resolve(undefined);
    }
    return callWithNotify(
        call(METHODE_HTTP.GET, BACKEND_ENUM.URL_OPERATIONS, SERVICES_URL.BUDGETS.GET_BY_COMPTE_DATES,
            [selectedCompte.id, selectedDate.getFullYear().toString(), (selectedDate.getMonth() + 1).toString()]),
        "Erreur lors du chargement du budget " + selectedCompte.id + " du " + (selectedDate.getMonth() + 1) + "/" + selectedDate.getFullYear(),
        { autoClose: false, closeOnClick: true }
    );
}

/**
 * Mapping des droits utilisateur (objet `droits` du back-end) vers l'enum
 */
function mapDroitsUtilisateur(droits: Record<string, boolean>): UTILISATEUR_DROITS[] {
    const userDroits: UTILISATEUR_DROITS[] = [];
    for (const droit in droits) {
        if (droits[droit]) {
            Object.values(UTILISATEUR_DROITS).forEach((key, index) => {
                if (key === droit) {
                    userDroits.push(index);
                }
            })
        }
    }
    return userDroits;
}

/**
 * Récupère les préférences de l'utilisateur (version Promise, pour `useFetch` - AP 006 T11).
 * Erreur loggée (sans toast) puis relancée.
 */
export function fetchPreferenceUtilisateur(): Promise<UTILISATEUR_DROITS[]> {
    return call(METHODE_HTTP.GET, BACKEND_ENUM.URL_UTILISATEURS, SERVICES_URL.UTILISATEURS.USERS_PREFS)
        .then((data) => mapDroitsUtilisateur(data.droits))
        .catch((e) => {
            console.error("Erreur lors de la recherche des préférences utilisateur", e);
            throw e;
        });
}
