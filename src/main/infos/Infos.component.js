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

        // Itération sur tous les composants
        this.backEnds.forEach(backEnd => (

            fetch(ClientHTTP.getURLRequest(backEnd.url, AppConstants.SERVICES_URL.INFOS.GET_INFO),
                  { method: 'GET', headers:{'origin':'localhost', 'accept':'application/json'} })
            .then(res => ClientHTTP.getJSONResponse(res))
            .then((data) => {
                this.setState({ infos: [...this.state.infos, data] })
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

                                {this.state.infos.map((msInfos) => (
                                    <ModuleInfos
                                        key={msInfos.nom} name={msInfos.nom}
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