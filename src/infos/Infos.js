import React, { Component } from "react";
import MicroServicesInfos from "./MsInfos";

class Infos extends Component {

    /** Etats pour la page Infos **/
      state = {
        infos: [],
        urls: ['http://localhost:8091', 'http://localhost:8092', 'http://localhost:8093', 'http://localhost:8094']
      }


    /** Appels WS vers /actuator/info pour tous les µS **/
      componentDidMount() {

        // Itération sur tous les composants
        this.state.urls.map((urlMS) => (
            fetch(urlMS+"/actuator/info")
            .then(res => res.json())
            .then((data) => {
                this.setState({ infos: [...this.state.infos, data.app] })
            })
            .catch(console.log)
        ))
      }

    /** Phase de Render **/
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