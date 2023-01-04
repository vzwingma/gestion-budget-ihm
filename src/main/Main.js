import React, { Component } from "react";
import { Routes, Route, NavLink, HashRouter} from "react-router-dom";
import { AuthProvider } from 'react-oidc-context';
import * as AppConstants from "./Utils/AppEnums.constants"
import Budgets from "./budgets/budgets/Budgets.component";
import Infos from "./infos/Infos.component";
import { removeTokenFromStorage} from "./Services/Auth.service";

import {AppBar, Container, Stack, Toolbar, Typography} from "@mui/material";
import Profile from "./menubar/Profile.component";
import PrivateNavLinks from "./menubar/PrivateNavLinks.component";



/** Page principale avec le routeur **/
export default class Main extends Component {

    oidcConfig = {
        authority: AppConstants.OIDC_ENUM.AUTHORITY,
        client_id: AppConstants.OIDC_ENUM.CLIENT_ID,
        client_secret: AppConstants.OIDC_ENUM.CLIENT_SECRET,
        response_type: 'code',
        scope: 'openid profile email',
        acr_values: "Level3",
        ui_locales: "nb",
        redirect_uri: AppConstants.OIDC_ENUM.URL+ 'login/response',
        post_logout_redirect_uri:AppConstants.OIDC_ENUM.URL+ 'logout/response'
    };



  render() {
    removeTokenFromStorage();
    return (
        <HashRouter>
            <AuthProvider {...this.oidcConfig}>
                <AppBar position={"fixed"}>
                    <Toolbar>
                        <Typography variant="h6" component="div" noWrap sx={{ flexGrow: 1, fontWeight: 700,fontSize: "1.2rem" }}>
                            <Stack direction="row">
                                <img src="/img/favicon64.png" width="60" height="60" alt="Gestion de budgets"/>
                                <NavLink className="nav-link" to="/infos">Infos</NavLink>
                                <PrivateNavLinks/>
                            </Stack>
                        </Typography>
                        <Container fixed/>
                        <Typography variant="h6" noWrap component="div"
                            sx={{ mr: 2, display: { xs: 'none', md: 'flex' },
                                    fontWeight: 300,
                                    fontSize: "1rem",
                                    color: 'inherit',
                                    textDecoration: 'none',        }} >
                            <Profile/>
                        </Typography>
                    </Toolbar>
                </AppBar>
                <div className="App">
                    <Routes>
                        <Route path="/"         element={<Infos/>}/>
                        <Route path="/budgets"  element={<Budgets/>} />
                        <Route path="/infos"    element={<Infos/>}/>
                    </Routes>
                </div>
            </AuthProvider>
        </HashRouter>
    );
  }
}
