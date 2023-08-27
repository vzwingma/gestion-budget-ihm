/**
 * Services de la liste des comptes
 */


import * as ClientHTTP from "../Services/ClientHTTP.service";
import * as AppConstants from "../Utils/AppEnums.constants";
import {toast} from "react-toastify";

/**
 * Appels WS vers pour charger la liste des comptes
 */
export function loadComptes(selectedDate) {
    ClientHTTP
        .call('GET', AppConstants.BACKEND_ENUM.URL_COMPTES, AppConstants.SERVICES_URL.COMPTES.GET_ALL)
        .then((data) => {
            this.comptesLoaded(data, selectedDate)
        })
        .catch(e => {
            console.log("Erreur lors du chargement des comptes " + e)
            toast.error("Erreur lors du chargement des comptes")
        })
}

/**
 * Chargement des comptes et tri suivant l'ordre
 * @param data comptes chargés
 */
export function comptesLoaded(data) {
    console.log("Chargement de " + data.length + " comptes");

    data.sort((c1, c2) => (c1.ordre > c2.ordre) ? 1 : -1);
    // Création des comptes pour l'affichage (avec icones)
    let comptesLabelIcons = data
        .filter((compte) => compte.actif)
        .map((compte) => {
            return {
                id: compte.id,
                libelle: compte.libelle,
                icon: compte.itemIcon,
                isDisabled: !compte.actif
            }
        })

    this.setState({
        comptes: comptesLabelIcons,
    });
}
