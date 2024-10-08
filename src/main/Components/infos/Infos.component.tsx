import React, {useEffect, useState} from "react";
import {Table, TableBody, TableCell, TableFooter, TableHead, TableRow, Typography} from "@mui/material";
import {getInfosFromMicroServices} from "./Infos.extservices";
import MicroServicesInfos from "./MicroServicesInfos.component";
import MsInfoModel from "../../Models/infos/MsInfo.model";
import CenterComponent from "../../Components/CenterComponent";


/**
 * Page d'informations sur les µS
 */
export const Infos: React.FC = () => {

    const [infos, setInfos] = useState<MsInfoModel[]>([]);
    /** Appels WS vers /actuator/info pour tous les µS **/
    useEffect(() => {
        getInfosFromMicroServices(setInfos);
    }, []);

    /** Phase de Render à partir de la liste de statuts  **/
    return (
        <CenterComponent>
            <TableHead>
                <TableRow>
                    <TableCell>
                        <CenterComponent>
                            <Typography variant={"h3"}> Gestion de budgets</Typography>
                        </CenterComponent>
                    </TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                <TableRow>
                    <TableCell>
                        <CenterComponent>
                            <img src="/img/icon.png" width="300" height="362"
                            className="d-inline-block align-middle" alt="Gestion de budgets" />
                        </CenterComponent>
                    </TableCell>
                </TableRow>
                <TableRow>
                    <TableCell>
                        <Table size={"small"}>
                            <TableBody>
                                <MicroServicesInfos
                                    key='ihm' nom='IHM'
                                    version={process.env.REACT_APP_BUDGET_VERSION} />

                                {infos.map((msInfos) => (
                                    <MicroServicesInfos
                                        key={msInfos.nom} nom={msInfos.nom}
                                        version={msInfos.version} />
                                ))}
                            </TableBody>
                        </Table>
                    </TableCell>
                </TableRow>
            </TableBody>
            <TableFooter>
                <TableRow>
                    <TableCell align={"right"} style={{ color: "#114b65" }}>by Zed.corp</TableCell>
                </TableRow>
            </TableFooter>
        </CenterComponent>
    )
}
