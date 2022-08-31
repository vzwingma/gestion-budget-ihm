import * as AppConstants from "../Utils/AppEnums.constants";
import * as ClientHTTP from './../Services/ClientHTTP.service';
import {toast} from "react-toastify";
/**
 * Controller Select Comptes
 */

    /**
     * Appels WS vers pour charger la liste des comptes
     */
    export function loadComptes() {
        ClientHTTP
            .call('GET', AppConstants.BACKEND_ENUM.URL_COMPTES, AppConstants.SERVICES_URL.COMPTES.GET_ALL)
            .then((data) => {
                this.comptesLoaded(data)
            })
            .catch(e => {
                console.log("Erreur lors du chargement des comptes " + e)
                toast.error("Erreur lors du chargement des comptes")
            } )
    }

    /**
     * Chargement des comptes et tri suivant l'ordre
     * @param data data
     */
    export function comptesLoaded(data){
        console.log("Chargement de " + data.length + " comptes");
        // console.log(data);
        data.sort((c1, c2) => (c1.ordre > c2.ordre) ? 1 : -1);
        // Création des comptes pour l'affichage (avec icones)
        let comptesLabelIcons = data.map((compte) => {
            return {
                value: compte.id,
                text: compte.libelle,
                icon: <img src={"/img/banques/" + compte.itemIcon} className="d-inline-block align-top" alt={compte.libelle}/>,
                isDisabled: !compte.actif
            }
        })

        this.setState({ comptes: comptesLabelIcons,
            selectedCompte: comptesLabelIcons[0] });
        this.props.onCompteChange(comptesLabelIcons[0].value);
    }

    /**
     *  Sélection d'un compte
     * @param compte compte sélectionné
     */
    export function handleSelect(compte) {
        console.log("Changement de compte : " + compte.text)
        // Compte sélectionné, remonté à budget
        this.props.onCompteChange(compte.value);
        this.setState({ selectedCompte: compte });
    }

