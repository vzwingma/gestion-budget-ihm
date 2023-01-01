import React, { Component } from "react";
import { Routes, Route, NavLink, HashRouter} from "react-router-dom";
import { AuthProvider } from 'oidc-react';
import * as AppConstants from "./Utils/AppEnums.constants"
import Budgets from "./budgets/budgets/Budgets.component";
import Infos from "./infos/Infos.component";

import {AppBar, Stack, Toolbar, Tooltip, Typography} from "@mui/material";


/** Page principale avec le routeur **/
export default class Main extends Component {

    state = {
        connectedUser: null
    }


    oidcConfig = {
        onSignIn: async (user: any) => {
            console.log("Connexion de l'utilisateur : " + user.profile.name)
            this.setState({connectedUser: user })
        },
        authority: AppConstants.OIDC_ENUM.AUTHORITY,
        clientId: AppConstants.OIDC_ENUM.CLIENT_ID,
        clientSecret: AppConstants.OIDC_ENUM.CLIENT_SECRET,
        responseType: 'code',
        scope: 'openid profile email',
        acr_values: "Level3",
        ui_locales: "nb",
        redirectUri: AppConstants.OIDC_ENUM.URL+ '/login/response',
        post_logout_redirect_uri:AppConstants.OIDC_ENUM.URL+ '/logout/response'
    };


  render() {
    return (
        <HashRouter>
            <AuthProvider {...this.oidcConfig}>
                <AppBar position={"fixed"} variant={"outlined"}>
                    <Toolbar>
                        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                            <Stack direction="row" spacing={2}>
                                <img src="/img/favicon64.png" width="60" height="60" alt="Gestion de budgets"/>
                                <NavLink className="nav-link" to="/infos">Infos</NavLink>
                                <NavLink className="nav-link" to="/budgets">Budgets</NavLink>
                            </Stack>
                        </Typography>
                        <Typography variant={"subtitle1"} component="div" sx={{ flexGrow: 10 }} align={"right"}>
                            <Tooltip title={this.state.connectedUser != null ? this.state.connectedUser.profile.name : "Non connecté"}>
                                <img src={this.state.connectedUser != null ? this.state.connectedUser.profile.picture : "/img/avatar.png"} width="60" height="60" alt="User loggé"/>
                            </Tooltip>
                        </Typography>
                    </Toolbar>
                </AppBar>

                <div className="App">
                    <Routes>
                        <Route path="/"    element={<Infos/>}/>
                        { this.state.connectedUser != null ? <Route path="/budgets"  element={<Budgets/>} /> : "" }
                        <Route path="/infos"    element={<Infos/>}/>
                    </Routes>
                </div>
            </AuthProvider>
        </HashRouter>
    );
  }
}