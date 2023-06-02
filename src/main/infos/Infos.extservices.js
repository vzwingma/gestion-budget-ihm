import {BACKEND_ENUM, SERVICES_URL} from "../Utils/AppEnums.constants"
import {call} from "../Services/ClientHTTP.service";


/**
 * Chargement des infos des µS
 * @returns {Promise<void>}
 */
export async function getInfosFromMicroServices() {

    /** Config Backend **/
    const backEnds = [
        {idMS: 'API Paramétrage', url: BACKEND_ENUM.URL_PARAMS},
        {idMS: 'API Utilisateurs', url: BACKEND_ENUM.URL_UTILISATEURS},
        {idMS: 'API Comptes', url: BACKEND_ENUM.URL_COMPTES},
        {idMS: 'API Opérations', url: BACKEND_ENUM.URL_OPERATIONS}
    ]


    let infosUpdated = []
    for await (const backEnd of backEnds.filter(backEnd => backEnd.url !== undefined)) {
        call('GET', backEnd.url, SERVICES_URL.INFOS.GET_INFO)
            .then((data) => {
                infosUpdated.push(data)
                this.setState({infos: infosUpdated})
            })
            .catch(() => {
                console.log("Erreur pour " + backEnd.idMS)
                const errData = {
                    nom: backEnd.idMS,
                    version: 'N/A',
                    description: 'Module pour les ' + backEnd.idMS
                };
                infosUpdated.push(errData)
                this.setState({infos: infosUpdated})
            })
    }
}

