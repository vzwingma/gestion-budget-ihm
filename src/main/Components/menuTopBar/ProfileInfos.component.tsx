import React, { useEffect, useState } from "react";
import { Stack } from "@mui/material";
import { getLastAccessDateUtilisateur } from "./ProfileInfos.extservices";
/**
 *   Page de Gestion du profile
 **/
const ProfileInfos: React.FC = (): JSX.Element => {

    /** Etats pour la page Infos **/
    const [lastConnectedDate, setLastConnectedDate] = useState<string>("-");

    useEffect(() => {
        getLastAccessDateUtilisateur(setLastConnectedDate);
    }, []);

    return (
        <Stack>
            <div>Dernière connexion :</div>
            <div>{lastConnectedDate}</div>
        </Stack>
    );
}
export default ProfileInfos;
