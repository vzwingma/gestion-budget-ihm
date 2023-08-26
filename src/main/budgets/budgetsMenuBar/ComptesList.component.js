import React, {Component} from "react";
import * as Controller from './ComptesList.controller';
import {Table, TableBody} from "@mui/material";
import CompteItem from "./CompteItem.component";
/*
 * Composant Select Comptes
 */
export default class ComptesList extends Component {


      /** Etats pour la sélection du compte **/
      state = {
            comptes: [],
            selectedCompte: null
      }

    constructor(props) {
        super(props);
        this.handleSelect   = Controller.handleSelect.bind(this);
        this.loadComptes    = Controller.loadComptes.bind(this);
        this.comptesLoaded  = Controller.comptesLoaded.bind(this);
    }

    /** Appels WS vers pour charger la liste des comptes **/
    componentDidMount() {
        this.loadComptes();
    }

    /**
     * Render Options
     * @param e option
     * @returns {JSX.Element} render de l'option
     */
    randerOptionLabel(e){
        return (
            <div style={{ display: 'flex', alignItems: 'center' }}>
                {e.icon} <span style={{ marginLeft: 5, fontSize:12 }}>{e.text}</span>
            </div>
        )
    }

/**
 *  RENDER
 */

    render() {
        return (

            <Table size={"small"}>
                <TableBody v>
                    {this.state.comptes.map((compte) => (
                        <CompteItem
                            compte={compte}/>
                    ))}
                </TableBody>
            </Table>
        );
    }
}
