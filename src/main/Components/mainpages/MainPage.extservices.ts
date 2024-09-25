import * as ClientHTTP from "../../Services/ClientHTTP.service";
import {toast} from "react-toastify";
import CompteBancaireModel from "@/src/main/Models/CompteBancaire.model";
import {BACKEND_ENUM, METHODE_HTTP, SERVICES_URL} from "../../Utils/AppTechEnums.constants";

/**
 * Appels WS vers pour charger la liste des comptes
 */
export function loadComptes(setComptes: React.Dispatch<React.SetStateAction<CompteBancaireModel[]>>) {
    ClientHTTP
        .call(METHODE_HTTP.GET, BACKEND_ENUM.URL_COMPTES, SERVICES_URL.COMPTES.GET_ALL)
        .then((data : any[]) => {
            // Création des comptes pour l'affichage (avec icones)
            let listeComptes : CompteBancaireModel[] = []
            data.forEach((compte: CompteBancaireModel) => {
                listeComptes.push(compte);
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
 * @param comptesLabelIcons liste des comptes
 * @param setComptes setter de la liste des comptes
 */
export function comptesLoaded(comptesLabelIcons : CompteBancaireModel[], setComptes: React.Dispatch<React.SetStateAction<CompteBancaireModel[]>>) {
    console.log("Chargement de " + comptesLabelIcons.length + " comptes");

    comptesLabelIcons.sort((c1 : CompteBancaireModel, c2 : CompteBancaireModel) => (c1.ordre > c2.ordre) ? 1 : -1);
    setComptes(comptesLabelIcons);
}
