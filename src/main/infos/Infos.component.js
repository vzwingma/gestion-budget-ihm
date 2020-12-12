import React, { Component } from "react";
import ModuleInfos from "./MsInfos.component";
import * as AppConstants from "../Utils/AppEnums.constants"
import * as ClientHTTP from './../Services/ClientHTTP.service'

export default class Infos extends Component {

    /** Etats pour la page Infos **/
      state = {
        infos: []
      }
    /** Config Backend **/
      backEnds = [
        {idMS: 'API Paramétrage',   url: AppConstants.BACKEND_ENUM.URL_PARAMS},
        {idMS: 'API Utilisateurs',  url: AppConstants.BACKEND_ENUM.URL_UTILISATEURS},
        {idMS: 'API Comptes',       url: AppConstants.BACKEND_ENUM.URL_COMPTES},
        {idMS: 'API Opérations',    url: AppConstants.BACKEND_ENUM.URL_OPERATIONS}
      ]

    /** Appels WS vers /actuator/info pour tous les µS **/
    componentDidMount() {

        // Itération sur tous les composants
        this.backEnds.map((backEnd, id) => (

            fetch(ClientHTTP.getURL(backEnd.url, AppConstants.SERVICES_URL.INFOS.GET_INFO),
                  { method: 'GET', headers:{'origin':'localhost', 'accept':'application/json'} })
            .then(res => res.json())
            .then((data) => {
                this.setState({ infos: [...this.state.infos, data.app] })
            })
            .catch(() => {
                console.log("Erreur pour " + backEnd.idMS)
                var errData = {
                    key: backEnd.idMS,
                    name: backEnd.idMS,
                    version : 'N/A',
                    description: backEnd.idMS
                };
                this.setState({ infos: [...this.state.infos, errData] })
            })
        ))
      }

    /** Phase de Render à partir de la liste de statuts  **/
  render() {
        return (
          <div>
            <center><h1>Liste des composants</h1></center>
            <small>Mode : <b>{process.env.NODE_ENV}</b></small>

            <ModuleInfos
                key='ihm'
                name='IHM'
                version={process.env.REACT_APP_BUDGET_VERSION}
                description="IHM REACT" />

            {this.state.infos.map((msInfos) => (
               <ModuleInfos
                    key={msInfos.name}
                    name={msInfos.name}
                    version={msInfos.version}
                    description={msInfos.description} />
            ))}
          </div>
        )
  }
}