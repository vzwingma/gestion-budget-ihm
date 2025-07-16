import React, {useEffect, useState} from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableFooter,
    TableHead,
    TableRow,
    Typography,
    useMediaQuery,
    useTheme
} from "@mui/material";
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

    const isMobile = useMediaQuery(useTheme().breakpoints.down('lg'));


    /** Phase de Render à partir de la liste de statuts  **/
    return (
        <CenterComponent>
            <Table size={"small"}>
                <TableHead>
                    <TableRow>
                        <TableCell colSpan={2}>
                            <CenterComponent>
                                {isMobile ?
                                    <Typography variant={"h3"}> Gestion mobile de budgets</Typography>
                                    :
                                    <Typography variant={"h2"}> Gestion de budgets</Typography>}
                            </CenterComponent>
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    <TableRow>
                        <TableCell colSpan={2}>
                            <CenterComponent>
                                <img src="/img/icon.png" width={isMobile ? "205" : "450"}
                                     height={isMobile ? "193" : "425"} style={{margin: "10px"}}
                                    className="d-inline-block align-middle" alt="Gestion de budgets" />
                            </CenterComponent>
                        </TableCell>
                    </TableRow>

                    <MicroServicesInfos
                        key='ihm' nom='IHM'
                        version={process.env.REACT_APP_BUDGET_VERSION} />

                    {infos.map((msInfos) => (
                        <MicroServicesInfos
                            key={msInfos.nom} nom={msInfos.nom}
                            version={msInfos.version} />
                    ))}
                </TableBody>
                <TableFooter>
                    <TableRow>
                        <TableCell style={{ color: "#114b65" }}>© 2025</TableCell>
                        <TableCell align={"right"} style={{ color: "#114b65" }}>by Zed.corp</TableCell>
                    </TableRow>
                </TableFooter>
            </Table>
        </CenterComponent>
    )
}
