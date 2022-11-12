import React, { Component } from "react";
import ModuleInfos from "./MicroServicesInfos.component";
import * as AppConstants from "../Utils/AppEnums.constants"
import * as ClientHTTP from './../Services/ClientHTTP.service'
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableFooter,
    TableHead,
    TableRow
} from "@mui/material";

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
            .forEach(backEnd =>
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
        <center>
            <TableContainer>
                <TableHead>
                    <TableRow>
                        <TableCell><center><h2>Gestion de budgets</h2></center></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    <TableRow>
                        <TableCell> <img src="/img/icon.png" width="300" height="300" className="d-inline-block align-middle" alt="Gestion de budgets"/> </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell> Environnement : <b>{process.env.NODE_ENV}</b> </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>
                        <Table size={"small"}>
                            <TableBody v>
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
                            </TableBody>
                        </Table>
                        </TableCell>
                    </TableRow>
                </TableBody>
                <TableFooter>
                    <TableCell align={"right"}>by Z.corp</TableCell>
                </TableFooter>
            </TableContainer>
        </center>
        )
  }
}