import {SERVICES_URL} from "../Utils/AppEnums.constants"
import {call} from "../Services/ClientHTTP.service";


/**
 * Chargement des infos des µS
 * @returns {Promise<void>}
 */
export async function getInfosFromMicroServices() {
    let infosUpdated = []
    for await (const backEnd of this.backEnds.filter(backEnd => backEnd.url !== undefined)) {
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

