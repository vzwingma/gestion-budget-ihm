import React, {Component} from "react";
import {Table, TableBody, TableCell, TableFooter, TableHead, TableRow, Typography} from "@mui/material";
import {AlignHorizontalCenter, Mic} from "@mui/icons-material";
import { getInfosFromMicroServices } from "./Infos.extservices";
import MicroServicesInfos from "./MicroServicesInfos.component";
import MsInfo from "../Models/MsInfo.model";


interface infosState {
    infos : MsInfo[];
}

export default class Infos extends Component<any, infosState> {

    state: infosState = {
        infos: [] as MsInfo[]
    };


    /** Appels WS vers /actuator/info pour tous les µS **/
    componentDidMount() {
        getInfosFromMicroServices(this.setState);
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
                                    <MicroServicesInfos
                                        key='ihm'
                                        name='IHM'
                                        version={process.env.REACT_APP_BUDGET_VERSION}/>

                                    {this.state.infos.map((msInfos) => (
                                        <MicroServicesInfos
                                            key={msInfos.nom} name={msInfos.nom}
                                            version={msInfos.version} />
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
