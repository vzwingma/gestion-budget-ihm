import React, {Component} from "react";
import {Table, TableBody, TableCell, TableFooter, TableHead, TableRow, Typography} from "@mui/material";
import * as Services from "./Infos.extservices";
import {AlignHorizontalCenter} from "@mui/icons-material";


export default class Infos extends Component {


    constructor(props : any) {
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
            <AlignHorizontalCenter>
                <TableHead>
                    <TableRow>
                        <TableCell>
                            <AlignHorizontalCenter><Typography variant={"h3"}> Gestion de budgets</Typography></AlignHorizontalCenter>
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    <TableRow>
                        <TableCell>
                            <AlignHorizontalCenter><img src="/img/icon.png" width="300" height="362"
                                         className="d-inline-block align-middle" alt="Gestion de budgets"/></AlignHorizontalCenter>
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>
                            <Table size={"small"}>
                                <TableBody>
                                    <ModuleInfos
                                        key='ihm'
                                        name='IHM'
                                        version={process.env.REACT_APP_BUDGET_VERSION}
                                        description="IHM REACT"/>

                                    {this.state.infos.map((msInfos) => (
                                        <ModuleInfos
                                            key={msInfos.nom} name={msInfos.nom}
                                            version={msInfos.version} description={msInfos.description}/>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableCell>
                    </TableRow>
                </TableBody>
                <TableFooter>
                    <TableRow>
                        <TableCell align={"right"} style={{color: "#114b65"}}>by Zed.corp</TableCell>
                    </TableRow>
                </TableFooter>
            </AlignHorizontalCenter>
        )
    }
}
