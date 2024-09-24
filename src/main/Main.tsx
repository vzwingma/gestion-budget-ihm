import React, {Component} from "react";
import {HashRouter, Route, Routes} from "react-router-dom";
import {AuthProvider} from 'react-oidc-context';
import {removeTokenFromStorage} from "./Services/Auth.service";

import {AppBar, createTheme, CssBaseline, Stack, ThemeProvider, Typography} from "@mui/material";
import {Infos} from "@/src/main/infos/Infos.component";
import MainPage from "@/src/main/mainpages/MainPage.component";
import PrivateNavLinks from "@/src/main/menuTopBar/PrivateNavLinks.component";
import Profile from "@/src/main/menuTopBar/Profile.component";
import { OIDC_ENUM } from "./Utils/AppTechEnums.constants";
import { BUSINESS_ONGLETS } from "./Utils/AppBusinessEnums.constants";


/** Page principale avec le routeur **/
export default class Main extends Component {

    oidcConfig = {
        authority: OIDC_ENUM.AUTHORITY,
        client_id: OIDC_ENUM.CLIENT_ID,
        client_secret: OIDC_ENUM.CLIENT_SECRET,
        response_type: 'code',
        automaticSilentRenew: true,
        scope: 'openid profile email',
        acr_values: "Level3",
        ui_locales: "nb",
        redirect_uri: OIDC_ENUM.URL + 'login/response',
        post_logout_redirect_uri: OIDC_ENUM.URL + 'logout/response'
    };


    render() {
        removeTokenFromStorage();

        const darkTheme = createTheme({
            palette: {
                mode: 'dark',
            },
        });

        return (
            <HashRouter>
                <AuthProvider {...this.oidcConfig}>
                    <ThemeProvider theme={darkTheme}>
                        <CssBaseline/>
                        <AppBar position={"fixed"} sx={{zIndex: (theme) => theme.zIndex.drawer + 1, height: "66px"}}>
                            <Stack direction="row" alignItems="flex-start" spacing={1}>
                                <img src="/img/favicon64.png" width="60" height="60" style={{margin: "2px"}}
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
                                <Route path="/" element={<Infos/>}/>
                                <Route path="/budgets" element={<MainPage fonction={BUSINESS_ONGLETS.BUDGET}/>}/>
                                <Route path="/analyses" element={<MainPage fonction={BUSINESS_ONGLETS.ANALYSE}/>}/>
                                <Route path="/analysesTemporelles" element={<MainPage fonction={BUSINESS_ONGLETS.ANALYSE_TEMP}/>}/>
                                <Route path="/infos" element={<Infos/>}/>
                            </Routes>
                        </div>
                    </ThemeProvider>
                </AuthProvider>
            </HashRouter>
        )
    }
}
