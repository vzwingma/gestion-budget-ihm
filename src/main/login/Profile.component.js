import React, { Component } from "react";
import {Stack, Tooltip, Typography} from "@mui/material";
import * as AuthService from "../Services/Auth.service";
import * as Service from './Profile.extservices';

/**
 *   Page de logout
 **/
export default class Profile extends Component {


    /** Etats pour Budget et opérations **/
    state = {
        lastConnectedDate: "null"
    }

    constructor(props) {
        super(props);
        this.getLastAccessDateUtilisateur = Service.getLastAccessDateUtilisateur.bind(this);
        this.updateLastAccessDateUtilisateur = Service.updateLastAccessDateUtilisateur.bind(this);
    }

    /** Chargement des catégories **/
    componentDidMount(){
        this.getLastAccessDateUtilisateur();
    }

    /**
     *  RENDER
     */

    render() {
        return (
            <>
                <Stack>
                    <div>Dernière connexion :</div>
                    <div>{ this.state.lastConnectedDate != null ? this.state.lastConnectedDate : "." }</div>
                </Stack>

                <Typography variant={"subtitle1"} component="div" sx={{ flexGrow: 10 }} align={"right"}>
                    <Tooltip title={ AuthService.isAuthenticated() ? AuthService.getOAuthItem(AuthService.OAUTH2_PROFILE_NAME) : "Non connecté"}>
                        <img src={ AuthService.isAuthenticated() ? AuthService.getOAuthItem(AuthService.OAUTH2_PROFILE_PIC) : "/img/avatar.png" } width="60" height="60" alt="User loggé"/>
                    </Tooltip>
                </Typography>
            </>
        );
    }
}
