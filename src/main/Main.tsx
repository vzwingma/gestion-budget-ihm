import React, {Component, Suspense} from "react";
import {HashRouter, Route, Routes} from 'react-router-dom';
import {AuthProvider} from 'react-oidc-context';
import {removeTokenFromStorage} from "./Services/Auth.service.ts";

import {
    AppBar,
    Backdrop,
    CircularProgress,
    createTheme,
    CssBaseline,
    responsiveFontSizes,
    Stack,
    ThemeProvider,
    Typography
} from "@mui/material";
import {OIDC_ENUM} from "./Utils/AppTechEnums.constants.ts";
import {BUSINESS_ONGLETS} from "./Utils/AppBusinessEnums.constants.ts";
import PrivateNavLinks from "./Components/menuTopBar/PrivateNavLinks.component.tsx";
import Profile from "./Components/menuTopBar/Profile.component.tsx";
import {BudgetContextProvider} from "./Models/contextProvider/BudgetContextProvider.tsx";
import AuthTokenSync from "./Components/shared/AuthTokenSync.component.tsx";

// Chargement différé des pages de routes (code-splitting) : chaque page n'est téléchargée
// qu'à la navigation vers son chemin, au lieu d'alourdir le bundle initial.
const MainPage = React.lazy(() => import("./Components/mainpages/MainPage.component.tsx"));
const Infos = React.lazy(() =>
    import("./Components/infos/Infos.component.tsx").then(module => ({default: module.Infos}))
);

/** Fallback affiché pendant le chargement différé d'une page de route **/
function RouteLoadingFallback() {
    return (
        <Backdrop sx={{color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1}} open={true}>
            <CircularProgress color="inherit" />
        </Backdrop>
    );
}


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

        let darkTheme = createTheme({
            palette: {
                mode: 'dark',
            },
        });
        darkTheme = responsiveFontSizes(darkTheme);


        return (
            <HashRouter>
                <AuthProvider {...this.oidcConfig}>
                    <AuthTokenSync />
                    <ThemeProvider theme={darkTheme}>
                        <CssBaseline />
                        <AppBar position={"fixed"} sx={{zIndex: (theme) => theme.zIndex.drawer + 1}}>
                            <Stack direction="row" spacing={1} sx={{ alignItems: "flex-start" }}>
                                <img src="/img/favicon64.webp" className="favicon" alt="Gestion de budgets"/>
                                <Typography variant="h6" component="div" noWrap
                                    sx={{ flexGrow: 1}}>
                                    <PrivateNavLinks />
                                </Typography>
                                <Typography variant="h6" noWrap component="div"
                                    sx={{
                                        mr: 2, display: { md: 'flex', lg: 'flex'  },
                                        fontWeight: 300,
                                        fontSize: "1rem",
                                        color: 'inherit',
                                        textDecoration: 'none',
                                    }}>
                                    <Profile />
                                </Typography>
                            </Stack>
                        </AppBar>
                        <div className="App">
                            <BudgetContextProvider>
                                <Suspense fallback={<RouteLoadingFallback />}>
                                    <Routes>
                                        <Route path="/" element={<Infos />} />
                                        <Route path="/budgets" element={<MainPage fonction={BUSINESS_ONGLETS.BUDGET} />} />
                                        <Route path="/recurrents" element={<MainPage fonction={BUSINESS_ONGLETS.RECURRENTS} />} />
                                        <Route path="/analyses" element={<MainPage fonction={BUSINESS_ONGLETS.ANALYSES} />} />
                                        <Route path="/infos" element={<Infos />} />
                                    </Routes>
                                </Suspense>
                            </BudgetContextProvider>
                        </div>
                    </ThemeProvider>
                </AuthProvider>
            </HashRouter>
        )
    }
}
