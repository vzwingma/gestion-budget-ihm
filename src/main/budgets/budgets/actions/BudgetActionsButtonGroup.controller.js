
    /**
     * Action sur le bouton ou sur la modale
     * @param event
     */
    export function handleButtonsBudgetClick(event){

        if(event.target.attributes["action"] !== null && event.target.attributes["action"] !== undefined) {
            const action = event.target.attributes["action"].value;
            // console.log("[SELECT]" + action)

            let titrePopup = "";
            let questionPopup = "";
            let affichagePopup = true;

            if(action === "CLOSE_A_CONFIRMER"){

                titrePopup = "Activité du budget";
                questionPopup = "Voulez vous vraiment " + (this.props.budget.actif ? "clôturer" : "réouvrir") + " le budget ?";
                affichagePopup = true;
            }
            else if(action === "REINIT_A_CONFIRMER"){
                titrePopup = "Action sur le budget";
                questionPopup = "Voulez vous vraiment réinitialiser le budget ?";
                affichagePopup = true;
            }
            else if(action === "ANNULER"){
                affichagePopup = false;
            }
            else if(action === "CONFIRMER"){
                affichagePopup = false;
                if(this.state.action === "CLOSE_A_CONFIRMER"){
                    this.callReopenCloseBudget(this.props.budget.id, !this.props.budget.actif)
                }
                else if(this.state.action === "REINIT_A_CONFIRMER"){
                    this.callReinitBudget(this.props.budget.id);
                }
            }

            this.setState({
                title : titrePopup,
                question : questionPopup,
                showModale : affichagePopup,
                action : action
            })
        }
        else if(event.target.className === "btn-close"){
            this.setState({
                showModale : false
            })
        }
    }

    // Mise à jour du statut la popup
    export function hideModale() {
        this.setState( { showModale : false });
    }

