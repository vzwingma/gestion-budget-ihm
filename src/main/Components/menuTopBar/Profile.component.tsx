import React, {JSX, useEffect} from "react";
import {useAuth} from "react-oidc-context";
import {Avatar, CircularProgress, Tooltip, Typography} from "@mui/material";
import {putTokenInStorage, removeTokenFromStorage} from '../../Services/Auth.service'
import ProfileInfos from "./ProfileInfos.component";

/**
 *   Page de Gestion du profile
 **/
const Profile: React.FC = (): JSX.Element => {

    const auth = useAuth();
    // LogOut et redirect pour nettoyer l'URL
    function logOut() {
        auth.removeUser().then(() => {console.log("Déconnexion de l'utilisateur")});
        removeTokenFromStorage();
        window.location.href = "/";
    }

    useEffect(() => {
        // the `return` is important - addAccessTokenExpiring() returns a cleanup function
        return auth.events.addAccessTokenExpiring(() => {
            auth.signinSilent().then(r => { console.log("Renouvellement du token") });
        })
    }, [auth, auth.events, auth.signinSilent]);




    if (auth.isLoading) {
        return <CircularProgress/>;
    }

    if (auth.error) {
        console.log("Erreur lors de l'authentification : " + auth.error.message)
        removeTokenFromStorage();
    }


    // Si l'utilisateur est connecté
    // referrerPolicy="no-referrer"
    if (auth.isAuthenticated) {
        putTokenInStorage(auth.user?.id_token)


        return (
            <>
                <Typography variant={"caption"} component="div"
                            sx={{flexGrow: 10, marginLeft: "20px", justifyContent: "center", alignContent: "center"}}
                            align={"right"}>
                    <ProfileInfos/>
                </Typography>
                <Typography variant={"subtitle1"} component="div" sx={{flexGrow: 10, marginLeft: "20px"}}
                            align={"right"}>
                    <Tooltip title={auth.user?.profile.name}>
                        <Avatar onClick={logOut} src={auth.user?.profile.picture}
                                className="favicon" alt="User loggé"
                                slotProps={{img: {referrerPolicy: "no-referrer"}}}/>
                    </Tooltip>
                </Typography>
            </>
        );
    } else {
        return (
                <Tooltip title="Non connecté. Cliquez pour vous identifier">
                    <Avatar onClick={() => auth.signinRedirect()} src="/img/avatar.webp"
                            className="favicon" alt="User non loggé"/>
                </Tooltip>
        );
    }
}

export default Profile;

