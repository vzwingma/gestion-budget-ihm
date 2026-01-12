import React, {useEffect, useState} from "react";
import {
    Box,
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
import {getInfosFromMicroServices} from "./Infos.extservices.ts";
import MicroServicesInfos from "./MicroServicesInfos.component.tsx";
import MsInfoModel from "../../Models/infos/MsInfo.model.ts";
import { CenterComponent } from "../../Components/CenterComponent.tsx";


/**
 * Page d'informations sur les µS
 */
export const Infos: React.FC = () => {

    const [infos, setInfos] = useState<MsInfoModel[]>([]);
    const [infoVersion, setInfoVersion] = useState<boolean>(false);


    /** Appels WS vers /actuator/info pour tous les µS **/
    useEffect(() => {
        getInfosFromMicroServices(setInfos);
    }, []);

    const isMobile = useMediaQuery(useTheme().breakpoints.down('lg'));


    /** Phase de Render à partir de la liste de statuts  **/
    return (
        <Box className="page-container infos-page-container">
        <CenterComponent>
            
            <Table size={isMobile ? "small" : "medium"}>
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
                                <button 
                                    onClick={() => setInfoVersion(!infoVersion)}
                                    style={{
                                        background: "none",
                                        border: "none",
                                        padding: 0,
                                        cursor: "pointer"
                                    }}
                                    aria-label="Gestion de budgets">
                                    <img src="/img/icon.webp" width={isMobile ? "205" : "450"}
                                         height={isMobile ? "193" : "425"} style={{margin: "10px"}}
                                         className="d-inline-block align-middle" alt="Gestion de budgets"/>
                                </button>
                            </CenterComponent>
                        </TableCell>
                    </TableRow>
                    {infoVersion &&
                    <MicroServicesInfos
                        key='ihm' nom='IHM'
                        version={process.env.REACT_APP_BUDGET_VERSION}/>}

                    {infoVersion && infos.map((msInfos) => (
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
        </Box>
    )
}
