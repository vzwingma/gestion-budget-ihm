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
                    <Button className="btn-dark" size="sm" disabled={!this.props.budget.actif} onClick={this.showModale}>
                        <img src={"/img/statuts/circle_plus.png"} className="d-inline-block align-top" alt="Création une nouvelle opération"/>
                    </Button>
                </OverlayTrigger>
                { /** Fenêtre modale - Formulaire  **/ }
                { /** la gestion de l'affichage de la modale est délégué au composant supérieur **/ }
                <CreateUpdateOperationForm budget={this.props.budget} showModale={this.state.showModale}  modeEdition={false}
                                           hideModale={this.hideModale}
                                           onOperationChange={this.props.onOperationChange}/> { /** OnOpChange est appelé par le composant. this.props.OnOpChange : appelle la méthode du composant supérieur**/ }
            </>
        )
    }
}