import React, {Component} from 'react';
import {Button, ButtonGroup, Modal, OverlayTrigger, Tooltip} from "react-bootstrap";


export default class BudgetActionsButtonGroup extends Component {

    state = {
        showModale: false,
        etatBudget: true,
        title: null,
        question: null,
        // Etat pour l'affichage
        libelleActionCloture : null,
        imageActionCloture : null

    }


    /** Constructeur **/
    constructor(props){
        super(props);
        this.handleButtonsBudgetClick= this.handleButtonsBudgetClick.bind(this);
        this.hideModale=this.hideModale.bind(this);
    }



    // Mise à jour du contexte de budget
    shouldComponentUpdate(nextProps, nextStates){

        if( nextProps.budget != null && nextProps.budget.actif !== nextStates.etatBudget ) {
            const etatBudget = nextProps.budget.actif;
            this.setState({
                etatBudget: etatBudget,
                libelleActionCloture: (etatBudget ? "Clôturer" : "Réouvrir") + " le budget",
                imageActionCloture: (etatBudget ? "unlocked" : "locked")
            });
            console.log("[TRIGGER] Context etat budget : " + etatBudget)
        }
        return true;
    }



    /**
     * Action sur le bouton ou sur la modale
     * @param event
     */
    handleButtonsBudgetClick(event){

        if(event.target.attributes["action"] !== null){
            const action = event.target.attributes["action"].value;
            console.log("[SELECT]" + action)

            let titrePopup = "";
            let questionPopup = "";
            let affichagePopup = true;

            if(action === "CLOSE_A_CONFIRMER"){

                titrePopup = "Activité du budget";
                questionPopup = "Voulez vous vraiment " + (this.state.etatBudget ? "clôturer" : "réouvrir") + " le budget ?";
                affichagePopup = true;
            }
            else if(action === "REINIT_A_CONFIRMER"){
                titrePopup = "Action sur le budget";
                questionPopup = "Voulez vous vraiment réinitialiser le budget ?";
                affichagePopup = true;
            }
            else if(action === "ANNULER"  || action === "CONFIRMER"){
                affichagePopup = false;
            }

            this.setState({
                title : titrePopup,
                question : questionPopup,
                showModale : affichagePopup
            })
        }
    }

    // Mise à jour de la popup
    hideModale() {
        this.setState( { showModale : false });
    }


    /**
     *  RENDER
     */
    render() {
        return (
            <>
            { /** Groupe d'actions sur le budget **/ }
                <ButtonGroup aria-label="ActionsBudget" onClick={this.handleButtonsBudgetClick}>
                    <OverlayTrigger overlay={  <Tooltip>{this.state.libelleActionCloture}</Tooltip>  }>
                        <Button className="btn-light" action="CLOSE_A_CONFIRMER" variant="light">
                            <img action="CLOSE_A_CONFIRMER" src={"/img/statuts/" + this.state.imageActionCloture+".png"} className="d-inline-block align-top" alt={this.state.libelleActionCloture}/>
                        </Button>
                    </OverlayTrigger>
                    <OverlayTrigger overlay={  <Tooltip>Réinitialiser le budget</Tooltip>  }>
                        <Button className="btn-light" action="REINIT_A_CONFIRMER" variant="light">
                            <img action="REINIT_A_CONFIRMER" src={"/img/statuts/circle_reinit.png"} className="d-inline-block align-top" alt="Réinitialiser le budget"/>
                        </Button>
                    </OverlayTrigger>


                <Modal show={this.state.showModale} onHide={this.hideModal} className="modal" centered >
                    <Modal.Header closeButton>
                        <Modal.Title>{this.state.title}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {this.state.question}
                    </Modal.Body>

                    <Modal.Footer>
                        <ButtonGroup>
                            <Button action="ANNULER" variant="secondary">Annuler</Button>
                            <Button action="CONFIRMER" variant="success">Confirmer</Button>
                        </ButtonGroup>
                    </Modal.Footer>
                </Modal>

                </ButtonGroup>
            </>
        )
    }
}