import * as AppConstants from "./../Utils/AppEnums.constants"
import * as ClientHTTP from './../Services/ClientHTTP.service'

/**
 * Click sur la fenêtre modale
 * @param event
 */
export function handleModalClick(event){
        if(event.target.attributes["action"] !== null && event.target.attributes["action"] !== undefined) {
            const action = event.target.attributes["action"].value;
            if(action === "CONFIRMER"){
                this.confirmInitNextMonth()
            }
            this.hideModale()
        }
    }

    export function hideModale(){
        this.setState({showModale: false})
    }


    /**
     * Chargement de l'intervalle de compte
      */

    export function intervalleLoaded(jourDepuisInitPremierBudget, jourDepuisInitDernierBudget) {
        let datePremierBudget = new Date(jourDepuisInitPremierBudget * 24 * 60 * 60 * 1000);
        datePremierBudget.setHours(0,0,0,0);
        let dateDernierBudget = new Date(jourDepuisInitDernierBudget * 24 * 60 * 60 * 1000);
        dateDernierBudget.setHours(0,0,0,0);
        console.log("Budgets disponibles entre " + datePremierBudget.toLocaleString() + " et " + dateDernierBudget.toLocaleString());
        this.setState({ datePremierBudget: datePremierBudget, dateDernierBudget : dateDernierBudget });

    }


    /**
     *  Sélection d'un mois à partir du composant
     * @param event select
     */
    export function handleSelect(event) {
        let newDatePreviousBudget;
        let newDateCurrentBudget;
        let newDateNextBudget;
        let dateChanged = false;
        if(event.target.id === "previous"){
            newDateCurrentBudget = new Date(this.state.datePreviousBudget);
            newDatePreviousBudget = new Date(this.state.datePreviousBudget.setMonth(this.state.datePreviousBudget.getMonth() - 1));
            newDateNextBudget = new Date(this.state.dateCurrentBudget);
            dateChanged = true;
        }
        else if(event.target.id === "next"){
            // Popup de confirmation, car cela va initialiser un nouveau budget et cloturer l'actuel
            if(this.state.dateDernierBudget <= this.state.dateCurrentBudget){
                console.log("Attention cela va initier un nouveau mois et fermer le mois courant");
                this.setState({ showModale: true })
            }
            else{
                this.confirmInitNextMonth();
            }
        }
        else if(event.target.id === "firstButton"){
            newDatePreviousBudget = new Date(new Date(this.state.datePremierBudget).setMonth(this.state.datePremierBudget.getMonth() - 1));
            newDateCurrentBudget = new Date(this.state.datePremierBudget);
            newDateNextBudget = new Date(new Date(this.state.datePremierBudget).setMonth(this.state.datePremierBudget.getMonth() + 1));
            dateChanged = true;
        }
        else if(event.target.id === "lastButton"){
            newDateCurrentBudget = new Date(this.state.dateDernierBudget);
            newDateNextBudget = new Date(new Date(this.state.dateDernierBudget).setMonth(this.state.dateDernierBudget.getMonth() + 1));
            newDatePreviousBudget = new Date(new Date(this.state.dateDernierBudget).setMonth(this.state.dateDernierBudget.getMonth() - 1));
            dateChanged = true;
        }
        if(dateChanged){
            this.updateMonths(newDatePreviousBudget, newDateCurrentBudget, newDateNextBudget);
        }

    }

    /**
     * Calcul du prochain mois
     */
    export function confirmInitNextMonth(){
        let newDatePreviousBudget = new Date(this.state.dateCurrentBudget);
        let newDateCurrentBudget = new Date(this.state.dateNextBudget);
        let newDateNextBudget = new Date(this.state.dateNextBudget.setMonth(this.state.dateNextBudget.getMonth() + 1));
        this.updateMonths(newDatePreviousBudget, newDateCurrentBudget, newDateNextBudget)
    }


    /**
     * Mise à jour des dates
     * @param newDatePreviousBudget date précédente
     * @param newDateCurrentBudget date courante
     * @param newDateNextBudget date suivante
     */
    export function updateMonths(newDatePreviousBudget, newDateCurrentBudget, newDateNextBudget){

        this.setState({
                datePreviousBudget : newDatePreviousBudget,
                dateCurrentBudget : newDateCurrentBudget,
                dateNextBudget : newDateNextBudget
            })
        // Date sélectionnée, remonté à budget
        this.props.onDateChange(newDateCurrentBudget);
    }


    /** Appels WS vers pour charger la liste suite à modif des comptes **/
    export function refreshDatesFromCompte(idCompte) {

        ClientHTTP.call('GET',
            AppConstants.BACKEND_ENUM.URL_OPERATIONS, AppConstants.SERVICES_URL.BUDGETS.INTERVALLE,
            [ idCompte ])
            .then((data) => {
                // console.log(data)
                this.intervalleLoaded(data.datePremierBudget, data.dateDernierBudget)
            })
            .catch((e) => {
                console.log("Erreur lors du chargement de l'intervalle des budgets" + e)
            })
    }
