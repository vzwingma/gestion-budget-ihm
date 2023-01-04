import React from "react";
import { useAuth } from "react-oidc-context";
import {Stack, Tooltip, Typography} from "@mui/material";
import * as Service from './Profile.extservices';
import { authenticate } from '../Services/Auth.service'

/**
 *   Page de Gestion du profile
 **/
function Profile() {
    const auth = useAuth();
/*
    switch (auth.activeNavigator) {
        case "signinSilent":
            return <div>Signing you in...</div>;
        case "signoutRedirect":
            return <div>Signing you out...</div>;

    }
*/
    if (auth.isLoading) {
        return <div>Chargement...</div>;
    }

    if (auth.error) {
        console.log("Erreur lors de l'authentification : " + auth.error.message)
    }

    if(auth.isAuthenticated) {
        authenticate(auth.user?.id_token)
        return (
            <>
                <Stack>
                    <div>Dernière connexion :</div>
                    <div>{ Service.getLastAccessDateUtilisateur() }</div>
                </Stack>

                <Typography variant={"subtitle1"} component="div" sx={{ flexGrow: 10 }} align={"right"}>
                    <Tooltip title={  auth.user?.profile.name }>
                        <img onClick={() => void auth.removeUser()} src={ auth.user?.profile.picture } width="60" height="60" alt="User loggé"/>
                    </Tooltip>
                </Typography>
            </>
        );
    }

        return (
            <>
                <Typography variant={"subtitle1"} component="div" sx={{ flexGrow: 10 }} align={"right"}>
                    <Tooltip title="Non connecté. Cliquez pour vous identifier">
                        <img onClick={() => void auth.signinRedirect()} src="/img/avatar.png" width="60" height="60" alt="User loggé"/>
                    </Tooltip>
                </Typography>
            </>
        );


}
export default Profile;