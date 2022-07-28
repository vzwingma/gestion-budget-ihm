import React, {Component} from 'react';
import {Button, OverlayTrigger, Tooltip} from 'react-bootstrap'
import CreateUpdateOperationForm from "../createupdate/CreateUpdateOperationForm.component";
/**
 * Formulaire sur le Bouton création
 */
export default class CreateOperationButton extends Component {


    state = {
        showModale: false
    }

    /**
     * Ouverture du formulaire
     * @param event evenement
     */
     showModale(event) {
        this.setState({ showModale: true });
    }

    /**
     * Fermeture du formulaire
     * @param event
     */
    hideModale(event) {
        this.setState({ showModale: false });
    }
    /**
     * Constructeur du formulaire
     * @param props
     */
    constructor(props) {
        super(props);

        this.showModale = this.showModale.bind(this);
        this.hideModale = this.hideModale.bind(this);
    }


    /**
     *  RENDER
     */
    render() {
        return (
            <>
                { /** Bouton de création **/ }
                <OverlayTrigger overlay={  <Tooltip>Ajouter une opération</Tooltip>  }>
                    <Button variant="outline-primary" size="sm" disabled={!this.props.budget.actif} onClick={this.showModale}>Création</Button>
                </OverlayTrigger>
                { /** Fenêtre modale - Formulaire  **/ }
                { /** la gestion de l'affichage de la modale est délégué au composant supérieur **/ }
                <CreateUpdateOperationForm idCompte={this.props.selectedCompte} budget={this.props.budget} showModale={this.state.showModale}  modeEdition={false}
                                           hideModale={this.hideModale}
                                           onOperationChange={this.props.onOperationChange}/> { /** OnOpChange est appelé par le composant. this.props.OnOpChange : appelle la méthode du composant supérieur**/ }
            </>
        )
    }
}