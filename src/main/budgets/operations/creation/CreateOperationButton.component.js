import React, {Component} from 'react';
import {Button, OverlayTrigger, Tooltip} from 'react-bootstrap'
import CreateUpdateOperationForm from "./CreateUpdateOperationForm.component";
/**
 * Formulaire sur le Bouton création
 */
export default class CreateOperationButton extends Component {


    state = {
        budget: null,
        etatBudget: null,
        showModale: false
    }

    /**
     * Ouverture du formulaire
     * @param event evenement
     */
     handleOpenForm(event) {
        // Ouverture du formulaire
        this.setState({ showModale: true });
    }

    /**
     * Constructeur du formulaire
     * @param props
     */
    constructor(props) {
        super(props);

        this.handleOpenForm = this.handleOpenForm.bind(this);
    }


    // Mise à jour du contexte de budget
    shouldComponentUpdate(nextProps, nextStates){
        if( nextProps.budget != null && (nextProps.budget !== nextStates.budget) ) {
            this.setState({
                budget: nextProps.budget,
                etatBudget: nextProps.budget.actif,
                showModale: false
            });
            console.log("[TRIGGER] Context budget : " + nextProps.budget.id + "::" + nextProps.budget.actif)
        }
        return true;
    }
    /**
     *  RENDER
     */
    render() {
        return (
            <>
                { /** Bouton de création **/ }
                <OverlayTrigger overlay={  <Tooltip>Ajouter une opération</Tooltip>  }>
                    <Button variant="outline-primary" size="sm" disabled={!this.state.etatBudget} onClick={this.handleOpenForm}>Création</Button>
                </OverlayTrigger>
                { /** Fenêtre modale - Formulaire  **/ }
                <CreateUpdateOperationForm idCompte={this.props.selectedCompte} budget={this.props.budget} showModale={this.state.showModale}
                                           onOperationChange={this.props.onOperationChange}/> { /** OnOpChange est appelé par le compose. this.props.OnOpChange : appelle la méthode du composant supérieur**/ }
            </>
        )
    }
}