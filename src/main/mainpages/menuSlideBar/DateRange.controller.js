/**
 * Click sur la fenêtre modale
 * @param event
 */
export function handleModalClick(event){
        if(event.target.id !== null && event.target.id !== undefined) {
            const action = event.target.id;
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
            let moisEnCours = new Date().setMonth(new Date().getMonth() - 1);
            if (moisEnCours <= this.state.dateCurrentBudget) {
                console.log("Attention cela va initier un nouveau mois et fermer le mois courant");
                this.setState({ showModale: true })
            }
            else{
                this.confirmInitNextMonth();
            }
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
