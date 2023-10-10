import React, {Component} from "react";
import {HashRouter, Route, Routes} from "react-router-dom";
import {AuthProvider} from 'react-oidc-context';
import * as AppConstants from "./Utils/AppTechEnums.constants"
import Infos from "./infos/Infos.component";
import {removeTokenFromStorage} from "./Services/Auth.service";

import {AppBar, Stack, Typography} from "@mui/material";
import Profile from "./menuTopBar/Profile.component";
import PrivateNavLinks from "./menuTopBar/PrivateNavLinks.component";
import MainBudget from "./budgets/MainBudgets.component";
import MainAnalyses from "./analyses/MainAnalyses.component";


/** Page principale avec le routeur **/
export default class Main extends Component {

    oidcConfig = {
        authority: AppConstants.OIDC_ENUM.AUTHORITY,
        client_id: AppConstants.OIDC_ENUM.CLIENT_ID,
        client_secret: AppConstants.OIDC_ENUM.CLIENT_SECRET,
        response_type: 'code',
        automaticSilentRenew: true,
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
                <AppBar position={"fixed"} sx={{zIndex: (theme) => theme.zIndex.drawer + 1}}>
                    <Stack direction="row" alignItems="flex-start" spacing={1}>
                        <img src="/img/favicon64.png" width="60" height="60" style={{margin: "4px"}}
                             alt="Gestion de budgets"/>
                        <Typography variant="h6" component="div" noWrap
                                    sx={{flexGrow: 1, fontWeight: 700, fontSize: "1.2rem"}}>
                                <PrivateNavLinks/>
                        </Typography>
                        <Typography variant="h6" noWrap component="div"
                                    sx={{
                                        mr: 2, display: {xs: 'none', md: 'flex'},
                                        fontWeight: 300,
                                        fontSize: "1rem",
                                        color: 'inherit',
                                        textDecoration: 'none',
                                    }}>
                            <Profile/>
                        </Typography>
                    </Stack>
                </AppBar>
                <div className="App">
                    <Routes>
                        <Route path="/"         element={<Infos/>}/>
                        <Route path="/budgets" element={<MainBudget/>}/>
                        <Route path="/analyses" element={<MainAnalyses/>}/>
                        <Route path="/infos"    element={<Infos/>}/>
                    </Routes>
                </div>
            </AuthProvider>
        </HashRouter>
    )
  }
}
