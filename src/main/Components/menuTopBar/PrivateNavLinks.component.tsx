import React from "react";
import {useAuth} from "react-oidc-context";
import {NavLink} from "react-router-dom";
import {Stack} from "@mui/material";

/**
 *   Page de Gestion du menu
 **/
const PrivateNavLinks: React.FC = (): JSX.Element => {    
    
    if (useAuth().isAuthenticated) {
        return <Stack direction="row" spacing={1}>
                    <NavLink className={({isActive}) => isActive ? 'nav-link_selected' : 'nav-link'} to="/infos">Infos</NavLink>
                    <NavLink className={({isActive}) => isActive ? 'nav-link_selected' : 'nav-link'}
                            to="/budgets">Budgets</NavLink>
                    <NavLink className={({isActive}) => isActive ? 'nav-link_selected' : 'nav-link'}
                            to="/analyses">Analyses Catégories</NavLink>
                    <NavLink className={({isActive}) => isActive ? 'nav-link_selected' : 'nav-link'}
                            to="/analysesTemporelles">Analyses Temporelles</NavLink>
                </Stack>
    } else {
        return <Stack direction="row" spacing={1}><NavLink className="nav-link" to="/infos">Infos</NavLink></Stack>
    }
}

export default PrivateNavLinks;
