import React from "react";
import MsInfoModel from "../../Models/MsInfo.model";
import {BACKEND_ENUM, METHODE_HTTP, SERVICES_URL} from "../../Utils/AppTechEnums.constants";
import {call} from "../../Services/ClientHTTP.service";


/**
 * Chargement des infos des µS
 */
export function getInfosFromMicroServices(setInfo: React.Dispatch<React.SetStateAction<MsInfoModel[]>>) {

    /** Config Backend **/
    const backEnds = [
        {idMS: 'API Paramétrage', url: BACKEND_ENUM.URL_PARAMS},
        {idMS: 'API Utilisateurs', url: BACKEND_ENUM.URL_UTILISATEURS},
        {idMS: 'API Comptes', url: BACKEND_ENUM.URL_COMPTES},
        {idMS: 'API Opérations', url: BACKEND_ENUM.URL_OPERATIONS}
    ]


    let infosUpdated = [] as MsInfoModel[];
    for (const backEnd of backEnds.filter(backEnd => backEnd.url !== undefined)) {
        call(METHODE_HTTP.GET, backEnd.url, SERVICES_URL.INFOS.GET_INFO)
            .then((data : any) => {
                    const msInfo : MsInfoModel = {
                        nom: data.nom,
                        version: data.version
                    }
                    infosUpdated.push(msInfo);
                    setInfo(infosUpdated);
                }
            )
            .catch((e) => {
                console.log("Erreur pour " + backEnd.idMS, e)
                const errData : MsInfoModel = {
                    nom: backEnd.idMS,
                    version: 'N/A'
                };
                infosUpdated.push(errData)
                setInfo(infosUpdated)
            })
    }
    return infosUpdated;
}

