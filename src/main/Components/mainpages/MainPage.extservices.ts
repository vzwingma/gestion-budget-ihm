import * as ClientHTTP from "../../Services/ClientHTTP.service.ts";
import {callWithNotify} from "../../Services/CallAndNotify.service.ts";
import {BACKEND_ENUM, METHODE_HTTP, SERVICES_URL} from "../../Utils/AppTechEnums.constants.ts";
import CompteBancaireModel from "../../Models/budgets/CompteBancaire.model.ts";

/**
 * Appel WS pour charger la liste des comptes, triée (version Promise, pour `useFetch` - AP 006 T11)
 */
export function fetchComptes(): Promise<CompteBancaireModel[]> {
    return callWithNotify(
        ClientHTTP.call(METHODE_HTTP.GET, BACKEND_ENUM.URL_COMPTES, SERVICES_URL.COMPTES.GET_ALL),
        "Erreur lors du chargement des comptes"
    ).then((listeComptes: CompteBancaireModel[]) => {
        let comptesTries: CompteBancaireModel[] = [];
        comptesLoaded(listeComptes, (comptes) => { comptesTries = comptes; });
        return comptesTries;
    });
}

/**
 * Chargement des comptes et tri suivant l'ordre
 * @param comptesLabelIcons liste des comptes
 * @param setComptes setter de la liste des comptes
 */
export function comptesLoaded(comptesLabelIcons : CompteBancaireModel[], setComptes: (comptes : CompteBancaireModel[]) => void) : void {
    comptesLabelIcons.sort((c1 : CompteBancaireModel, c2 : CompteBancaireModel) => (c1.ordre > c2.ordre) ? 1 : -1);
    setComptes(comptesLabelIcons);
}
