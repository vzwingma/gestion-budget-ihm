import MsInfoModel from "../../Models/infos/MsInfo.model.ts";
import {BACKEND_ENUM, METHODE_HTTP, SERVICES_URL} from "../../Utils/AppTechEnums.constants.ts";
import {call} from "../../Services/ClientHTTP.service.ts";


/**
 * Chargement des infos des µS (version Promise, pour `useFetch` - AP 006 T11).
 * Ne rejette jamais : un µS en erreur est remonté avec la version `N/A`.
 */
export function fetchInfosFromMicroServices(): Promise<MsInfoModel[]> {

    /** Config Backend **/
    const backEnds = [
        {idMS: 'API Paramétrage', url: BACKEND_ENUM.URL_PARAMS},
        {idMS: 'API Utilisateurs', url: BACKEND_ENUM.URL_UTILISATEURS},
        {idMS: 'API Comptes', url: BACKEND_ENUM.URL_COMPTES},
        {idMS: 'API Opérations', url: BACKEND_ENUM.URL_OPERATIONS}
    ]
    let promisesGetInfos : Promise<void>[] = [];
    let msInfos : MsInfoModel[] = [];

    for (const backEnd of backEnds.filter(backEnd => backEnd.url !== undefined)) {
        promisesGetInfos.push(call(METHODE_HTTP.GET, backEnd.url, SERVICES_URL.INFOS.GET_INFO)
            .then((msInfo : MsInfoModel) => { msInfos.push(msInfo); })
            .catch((e) => {
                console.error("Erreur pour " + backEnd.idMS, e)
                const errData : MsInfoModel = {
                    nom: backEnd.idMS,
                    version: 'N/A'
                };
                msInfos.push(errData);
            }));
    }
    return Promise.all(promisesGetInfos).then(() => msInfos);
}
