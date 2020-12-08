import React, { Component } from "react";
import MicroServicesInfos from "./MsInfos";

class Infos extends Component {

    /** Etats pour la page Infos **/
      state = {
        infos: []
      }
    /** Config Backend **/
      backEnds = [
        {idMS: 'API Paramétrage', url:'http://localhost:8091'},
        {idMS: 'API Utilisateurs', url:'http://localhost:8092'},
        {idMS: 'API Comptes', url:'http://localhost:8093'},
        {idMS: 'API Opérations', url:'http://localhost:8094'}
      ]

    /** Appels WS vers /actuator/info pour tous les µS **/
      componentDidMount() {

        // Itération sur tous les composants
        this.backEnds.map((backEnd, id) => (
            fetch(backEnd.url+"/actuator/info")
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

            {this.state.infos.map((msInfos) => (
               <MicroServicesInfos
                    key={msInfos.name}
                    name={msInfos.name}
                    version={msInfos.version}
                    description={msInfos.description} />
            ))}
          </div>
        )
  }
}

export default Infos;