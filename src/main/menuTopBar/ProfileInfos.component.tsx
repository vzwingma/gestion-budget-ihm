import React, {Component} from "react";
import {Stack} from "@mui/material";
import {getLastAccessDateUtilisateur} from "@/src/main/menuTopBar/ProfileInfos.extservices";
/**
 *   Page de Gestion du profile
 **/
export default class ProfileInfos extends Component {
    /** Etats pour la page Infos **/
    state = {
        lastConnectedDate: []
    }

    constructor(props : any) {
        super(props);
        this.getLastAccessDateUtilisateur = getLastAccessDateUtilisateur.bind(this);
    }

    componentDidMount() {
        this.getLastAccessDateUtilisateur();
    }

    render() {
        return (
            <Stack>
                <div>Dernière connexion :</div>
                <div>{this.state.lastConnectedDate}</div>
            </Stack>
        );
    }

}
