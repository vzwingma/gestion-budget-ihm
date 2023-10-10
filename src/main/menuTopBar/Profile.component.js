import React from "react";
import {useAuth} from "react-oidc-context";
import {CircularProgress, Tooltip, Typography} from "@mui/material";
import {putTokenInStorage, removeTokenFromStorage} from '../Services/Auth.service'
import ProfileInfos from "./ProfileInfos.component";

/**
 *   Page de Gestion du profile
 **/
function Profile() {
    const auth = useAuth();

    // LogOut et redirect pour nettoyer l'URL
    function logOut(){
        auth.removeUser();
        removeTokenFromStorage();
        window.location = "/";
    }

    React.useEffect(() => {
        // the `return` is important - addAccessTokenExpiring() returns a cleanup function
        return auth.events.addAccessTokenExpiring(() => {
            auth.signinSilent();
        })
    }, [auth, auth.events, auth.signinSilent]);


    if (auth.isLoading) {
        return <CircularProgress/>;
    }

    if (auth.error) {
        console.log("Erreur lors de l'authentification : " + auth.error.message)
    }

    if(auth.isAuthenticated) {
        putTokenInStorage(auth.user?.id_token)
        return (
            <>
                <ProfileInfos/>

                <Typography variant={"subtitle1"} component="div" sx={{ flexGrow: 10 }} align={"right"}>
                    <Tooltip title={  auth.user?.profile.name }>
                        <img onClick={logOut} src={auth.user?.profile.picture} width="60" height="60"
                             style={{margin: "4px"}} alt="User loggé" referrerPolicy="no-referrer"/>
                    </Tooltip>
                </Typography>
            </>
        );
    }

        return (
            <>
                <Typography variant={"subtitle1"} component="div" sx={{ flexGrow: 10 }} align={"right"}>
                    <Tooltip title="Non connecté. Cliquez pour vous identifier">
                        <img onClick={() => auth.signinRedirect()} src="/img/avatar.png" width="60" height="60" alt="User loggé"/>
                    </Tooltip>
                </Typography>
            </>
        );
}
export default Profile;

