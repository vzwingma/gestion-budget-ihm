import React, {JSX} from "react";
import { Stack } from "@mui/material";
import { fetchLastAccessDateUtilisateur } from "./ProfileInfos.extservices.ts";
import { useFetch } from "../../hooks/useFetch.ts";
/**
 *   Page de Gestion du profile
 **/
const ProfileInfos: React.FC = (): JSX.Element => {

    /** Etats pour la page Infos **/
    const { data: lastConnectedDateChargee } = useFetch(() => fetchLastAccessDateUtilisateur(), []);
    const lastConnectedDate: string = lastConnectedDateChargee ?? "-";

    return (
        <Stack>
            <div>Dernière connexion :</div>
            <div>{lastConnectedDate}</div>
        </Stack>
    );
}
export default ProfileInfos;
