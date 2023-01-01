import React, { Component } from "react";
import { Routes, Route, NavLink, HashRouter} from "react-router-dom";
import { AuthProvider } from 'oidc-react';
import Budgets from "./budgets/budgets/Budgets.component";
import Infos from "./infos/Infos.component";

import Logout from "./login/Logout.component";
import {AppBar, Stack, Toolbar, Typography} from "@mui/material";


/** Page principale avec le routeur **/
export default class Main extends Component {

    state = {
        connectedUser: null
    }


    oidcConfig = {
        onSignIn: async (user: any) => {
            console.log("Connexion de l'utilisateur")
            console.log(user);
            this.setState({connectedUser: user })
        },
        authority: 'https://accounts.google.com/',
        clientId:
            '550431928138-edestj28rk5a0emk546p7ii28dl5boc5.apps.googleusercontent.com',
        clientSecret:
            '',
        responseType: 'code',
        scopes: ['openid', 'https://www.googleapis.com/auth/userinfo.email', 'https://www.googleapis.com/auth/userinfo.profile', "auth/userinfo.email", "auth/userinfo.profile"],
        redirectUri:
            process.env.NODE_ENV === 'development'
                ? 'http://localhost:3000/login/response'
                : 'http://localhost:5011/login/response',
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
                            <img src={this.state.connectedUser != null ? this.state.connectedUser.profile.picture : "/img/avatar.png"} width="60" height="60" alt="User loggé"/>
                        </Typography>
                    </Toolbar>
                </AppBar>

                <div className="App">
                    <Routes>
                        <Route path="/"    element={<Infos/>}/>
                        <Route path="/budgets"  element={<Budgets/>} />
                        <Route path="/infos"    element={<Infos/>}/>

                        <Route path="/logout"   element={<Logout/>}/>
                    </Routes>
                </div>
            </AuthProvider>
        </HashRouter>
    );
  }
}