import React, {JSX} from "react";
import {useAuth} from "react-oidc-context";
import {Avatar, CircularProgress, Tooltip, Typography} from "@mui/material";
import {removeTokenFromStorage} from '../../Services/Auth.service.ts'
import ProfileInfos from "./ProfileInfos.component.tsx";
import { debug } from "../../Utils/Debug.utils.ts";

/**
 *   Page de Gestion du profile
 **/
const Profile: React.FC = (): JSX.Element => {

    const auth = useAuth();
    // LogOut et redirect pour nettoyer l'URL
    function logOut() {
        auth.removeUser().then(() => { debug("Déconnexion de l'utilisateur"); });
        removeTokenFromStorage();
        globalThis.location.href = "/";
    }

    if (auth.isLoading) {
        return <CircularProgress/>;
    }

    if (auth.error) {
        console.error("Erreur lors de l'authentification : " + auth.error.message)
        removeTokenFromStorage();
    }


    // Si l'utilisateur est connecté
    // referrerPolicy="no-referrer"
    if (auth.isAuthenticated) {
        return (
            <>
                <Typography variant={"caption"} component="div"
                            sx={{flexGrow: 10, marginLeft: "20px", justifyContent: "center", alignContent: "center", textAlign: "right"}}>
                    <ProfileInfos/>
                </Typography>
                <Typography variant={"subtitle1"} component="div" sx={{flexGrow: 10, marginLeft: "20px", textAlign: "right"}}>
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

