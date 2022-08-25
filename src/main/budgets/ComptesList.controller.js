import * as AppConstants from "../Utils/AppEnums.constants";
import * as ClientHTTP from './../Services/ClientHTTP.service';
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
            .catch(e => console.log("Erreur lors du chargement des comptes " + e))
    }

    /**
     * Chargement des comptes et tri suivant l'ordre
     * @param data data
     */
    export function comptesLoaded(data){
        console.log("Chargement de " + data.length + " comptes");
        // console.log(data);
        data.sort((c1, c2) => (c1.ordre > c2.ordre) ? 1 : -1);
        this.setState({ comptes: data });
        this.props.onCompteChange(data[0].id);
    }

    /**
     *  Sélection d'un compte
     * @param event événement
     */
    export function handleSelect(event) {
        // Select du compte parmi la liste
        const compteLabel =event.target.value;
        console.log("Changement de compte : " + compteLabel)
        let selectedIdCompte = null;
        Array.from(event.target.options)
             .forEach(function (option) {
                if(option.value === compteLabel){
                    selectedIdCompte = option.id;
                }
             })
        // Compte sélectionné, remonté à budget
        this.props.onCompteChange(selectedIdCompte);
    }

