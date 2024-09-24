import * as ClientHTTP from "../Services/ClientHTTP.service";
import * as AppConstants from "../Utils/AppTechEnums.constants";
import {toast} from "react-toastify";
import CompteBancaire from "@/src/main/Models/CompteBancaire.model";
import CompteBancaireDTO from "@/src/main/Models/CompteBancaireDTO.datamodel";

/**
 * Appels WS vers pour charger la liste des comptes
 */
export function loadComptes(selectedDate) {
    ClientHTTP
        .call(AppConstants.METHODE_HTTP.GET, AppConstants.BACKEND_ENUM.URL_COMPTES, AppConstants.SERVICES_URL.COMPTES.GET_ALL, null, null)
        .then((data) => {
            this.comptesLoaded(data, selectedDate)
        })
        .catch(e => {
            console.log("Erreur lors du chargement des comptes ", e)
            toast.error("Erreur lors du chargement des comptes")
        })
}

/**
 * Chargement des comptes et tri suivant l'ordre
 * @param data comptes chargés
 */
export function comptesLoaded(data : CompteBancaireDTO[]) {
    console.log("Chargement de " + data.length + " comptes");

    data.sort((c1 : CompteBancaireDTO, c2 : CompteBancaireDTO) => (c1.ordre > c2.ordre) ? 1 : -1);
    // Création des comptes pour l'affichage (avec icones)
    let comptesLabelIcons = data
        .map((compte : CompteBancaireDTO) => {
            let compteB : CompteBancaire;
            compteB = {
                id : compte.id,
                libelle : compte.libelle,
                icon : compte.itemIcon,
                isDisabled : !compte.actif
            };
            return compteB;
        })
    this.setState({
        comptes: comptesLabelIcons,
    });

}
