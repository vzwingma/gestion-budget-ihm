import React, {Component} from "react";
import ModuleInfos from "./MicroServicesInfos.component";
import {BACKEND_ENUM} from "../Utils/AppEnums.constants"
import {Table, TableBody, TableCell, TableFooter, TableHead, TableRow} from "@mui/material";
import * as Services from "./Infos.extservices";


export default class Infos extends Component {


    /** Config Backend **/
    backEnds = [
        {idMS: 'API Paramétrage', url: BACKEND_ENUM.URL_PARAMS},
        {idMS: 'API Utilisateurs', url: BACKEND_ENUM.URL_UTILISATEURS},
        {idMS: 'API Comptes', url: BACKEND_ENUM.URL_COMPTES},
        {idMS: 'API Opérations', url: BACKEND_ENUM.URL_OPERATIONS}
    ]


    constructor(props) {
        super(props);
        /** Etats pour la page Infos **/

        this.state = {
            infos: []
        };
        this.getInfosFromMicroServices = Services.getInfosFromMicroServices.bind(this);
    }


    /** Appels WS vers /actuator/info pour tous les µS **/
    componentDidMount() {

        this.getInfosFromMicroServices();

    }

    /** Phase de Render à partir de la liste de statuts  **/
    render() {
        return (
        <center>
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

                                {this.state.infos.map((msInfos) => (
                                    <ModuleInfos
                                        key={msInfos.nom} name={msInfos.nom}
                                        version={msInfos.version} description={msInfos.description} />
                                ))}
                            </TableBody>
                        </Table>
                        </TableCell>
                    </TableRow>
                </TableBody>
                <TableFooter>
                    <TableRow>
                        <TableCell align={"right"}>by Zed.corp</TableCell>
                    </TableRow>
                </TableFooter>
        </center>
        )
  }
}
