import React from "react";
import {useAuth} from "react-oidc-context";
import {NavLink} from "react-router-dom";
import {Divider, Stack} from "@mui/material";

/**
 *   Page de Gestion du menu
 **/
function PrivateNavLinks() {

    if(useAuth().isAuthenticated) {
        return <Stack direction="row" divider={<Divider orientation="vertical" flexItem/>} spacing={1}>
            <NavLink className="nav-link" to="/infos">Infos</NavLink>
            <NavLink className="nav-link" to="/budgets">Budgets</NavLink>
            <NavLink className="nav-link" to="/analyses">Analyses</NavLink>
        </Stack>
    } else {
        return <NavLink className="nav-link" to="/infos">Infos</NavLink>
    }
}
export default PrivateNavLinks;
