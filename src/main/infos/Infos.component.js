import React, { Component } from "react";
import ModuleInfos from "./MicroServicesInfos.component";
import { ListGroup, Card, Container, Table } from "react-bootstrap";
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

        let infosUpdated = []
        // Itération sur tous les composants
        this.backEnds
            .filter(backEnd => backEnd.url !== undefined)
            .map(backEnd =>
                ClientHTTP.call('GET', backEnd.url, AppConstants.SERVICES_URL.INFOS.GET_INFO)
                    .then((data) => {
                        infosUpdated.push(data)
                        this.setState({ infos: infosUpdated })
                    })
                    .catch(() => {
                        console.log("Erreur pour " + backEnd.idMS)
                        const errData = {
                            nom: backEnd.idMS,
                            version : 'N/A',
                            description: 'Module pour les ' + backEnd.idMS
                        };
                        infosUpdated.push(errData)
                        this.setState({ infos: infosUpdated })
                    })
            )
      }

    /** Phase de Render à partir de la liste de statuts  **/
  render() {
        return (
        <Container fluid>
            <Card border="primary" bg="light" style={{ width: '40rem', margin: '10px auto' }} >
                <Card.Header><h4><center>Application de Budgets</center></h4></Card.Header>
                <Card.Body>
                    <ListGroup>
                        <ListGroup.Item>Environnement : <b>{process.env.NODE_ENV}</b></ListGroup.Item>
                        <ListGroup.Item>

                            <Table striped hover variant="dark" style={{ margin: '0px 0px 0px 0px' }} >
                              <tbody>
                                    <ModuleInfos
                                        key='ihm'
                                        name='IHM'
                                        version={process.env.REACT_APP_BUDGET_VERSION}
                                        description="IHM REACT" />

                                {this.state.infos.map((msInfos, i) => (
                                    <ModuleInfos
                                        key={msInfos.nom + i} name={msInfos.nom}
                                        version={msInfos.version} description={msInfos.description} />
                                ))}
                              </tbody>
                            </Table>

                        </ListGroup.Item>
                    </ListGroup>
                </Card.Body>
            </Card>
        </Container>
        )
  }
}