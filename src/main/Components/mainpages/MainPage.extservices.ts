import * as ClientHTTP from "../../Services/ClientHTTP.service.ts";
import {callAndNotify} from "../../Services/CallAndNotify.service.ts";
import {BACKEND_ENUM, METHODE_HTTP, SERVICES_URL} from "../../Utils/AppTechEnums.constants.ts";
import CompteBancaireModel from "../../Models/budgets/CompteBancaire.model.ts";

/**
 * Appels WS vers pour charger la liste des comptes
 */
export function loadComptes(setComptes: (comptes : CompteBancaireModel[]) => void) : void {
    callAndNotify(
        ClientHTTP.call(METHODE_HTTP.GET, BACKEND_ENUM.URL_COMPTES, SERVICES_URL.COMPTES.GET_ALL),
        (listeComptes: CompteBancaireModel[]) => comptesLoaded(listeComptes, setComptes),
        "Erreur lors du chargement des comptes"
    );
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
