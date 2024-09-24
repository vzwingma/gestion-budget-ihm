import * as ClientHTTP from "../Services/ClientHTTP.service";
import {toast} from "react-toastify";
import CompteBancaire from "@/src/main/Models/CompteBancaire.model";
import CompteBancaireDTO from "@/src/main/Models/CompteBancaireDTO.datamodel";
import { BACKEND_ENUM, METHODE_HTTP, SERVICES_URL } from "../Utils/AppTechEnums.constants";

/**
 * Appels WS vers pour charger la liste des comptes
 */
export function loadComptes(setComptes: React.Dispatch<React.SetStateAction<CompteBancaire[]>>) {
    ClientHTTP
        .call(METHODE_HTTP.GET, BACKEND_ENUM.URL_COMPTES, SERVICES_URL.COMPTES.GET_ALL)
        .then((data : any[]) => {
            // Création des comptes pour l'affichage (avec icones)
            let listeComptes : CompteBancaire[] = []
            data.forEach((compte : CompteBancaireDTO) => {
                let compteB : CompteBancaire;
                compteB = {
                    id : compte.id,
                    libelle : compte.libelle,
                    icon : compte.itemIcon,
                    isDisabled : !compte.actif,
                    ordre : compte.ordre
                };
                listeComptes.push(compteB);
            })
            comptesLoaded(listeComptes, setComptes)
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
export function comptesLoaded(comptesLabelIcons : CompteBancaire[], setComptes: React.Dispatch<React.SetStateAction<CompteBancaire[]>>) {
    console.log("Chargement de " + comptesLabelIcons.length + " comptes");

    comptesLabelIcons.sort((c1 : CompteBancaire, c2 : CompteBancaire) => (c1.ordre > c2.ordre) ? 1 : -1);
    setComptes(comptesLabelIcons);
}
