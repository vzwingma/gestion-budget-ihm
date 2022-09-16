import React, { Component } from "react";
import {ButtonGroup } from 'react-bootstrap';
import OperationButtonAction from "./OperationButtonAction.component";
import * as Controller from './OperationActions.controller';

export default class OperationActions extends Component {



    state = {
        showModale: false
    }


    /** Constructeur **/
    constructor(props){
        super(props);
        this.hideShowModale = Controller.hideShowModale.bind(this);
    }


    render(){
        return (
            <ButtonGroup aria-label="Actions">

                <style type="text/css">{`
                    .btn-light {
                        padding: 0px 1px 0px 1px;
                    }
                `}</style>

                { this.props.operation.etat !== "REALISEE" &&
                    <OperationButtonAction action="REALISEE" iconAction="circle_ok.png" label="Valider l'opération"/>
                }
                { this.props.operation.etat !== "PREVUE" &&
                    <OperationButtonAction action="PREVUE" iconAction="circle_clock.png" label="Prévoir l'opération"/>
                }
                { this.props.operation.etat !== "ANNULEE" &&
                    <OperationButtonAction action="ANNULEE" iconAction="circle_cancel.png" label="Annuler l'opération"/>
                }
                { this.props.operation.etat !== "SUPPRIMEE" &&
                    <OperationButtonAction action="SUPPRIMEE_A_CONFIRMER" iconAction="circle_remove.png" label="Supprimer l'opération"/>
                }
                { this.props.operation.etat !== "REPORTEE" &&
                    <OperationButtonAction action="REPORTEE" iconAction="circle_arrow_right.png" label="Reporter l'opération"/>
                }
            </ButtonGroup>
        )
    }
}