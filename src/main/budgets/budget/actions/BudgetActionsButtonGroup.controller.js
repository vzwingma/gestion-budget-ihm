/**
 * Action sur le bouton ou sur la modale
 * @param event
 */
export function handleButtonsBudgetClick(event) {

    if (event.target.id !== null && event.target.id !== undefined) {
        let action = event.target.id;
        if (action === "") {
            action = event.target.parentNode.id
        }
        let titrePopup = "";
        let questionPopup = "";
        let affichagePopup;
        if (action === "CREATE") {
            this.props.onActionOperationCreate()
            return
        } else if (action === "CLOSE_A_CONFIRMER") {
            titrePopup = "Activité du budget";
            questionPopup = "Voulez vous vraiment " + (this.props.budget.actif ? "clôturer" : "réouvrir") + " le budget ?";
            affichagePopup = true;
        } else if (action === "REINIT_A_CONFIRMER") {
            titrePopup = "Action sur le budget";
            questionPopup = "Voulez vous vraiment réinitialiser le budget ? \n Le budget précédent sera clôturé, et les opérations en cours seront reportées";
            affichagePopup = true;
        } else if (action === "ANNULER") {
            affichagePopup = false;
        } else if (action === "CONFIRMER") {
            affichagePopup = false;
            if (this.state.action === "CLOSE_A_CONFIRMER") {
                this.callReopenCloseBudget(this.props.budget.id, !this.props.budget.actif)
            } else if (this.state.action === "REINIT_A_CONFIRMER") {
                this.callReinitBudget(this.props.budget.id);
            }
        }
            this.setState({
                title: titrePopup,
                question: questionPopup,
                showModale: affichagePopup,
                action: action
            })
    } else if (event.target.className === "btn-close") {
        this.setState({showModale: false})
    }
}

