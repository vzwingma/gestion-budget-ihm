import React, {JSX} from "react";
import {useAuth} from "react-oidc-context";
import {NavLink} from "react-router-dom";
import {Stack} from "@mui/material";

/**
 *   Page de Gestion du menu
 **/
const PrivateNavLinks: React.FC = (): JSX.Element => {

    if (useAuth().isAuthenticated) {
        return <Stack direction="row" spacing={1}>
                    <NavLink className={({isActive}) => isActive ? 'nav-link_selected' : 'nav-link'} to="/infos">🏠 Accueil</NavLink>
                    <NavLink className={({isActive}) => isActive ? 'nav-link_selected' : 'nav-link'}
                            to="/budgets">💳 Opérations</NavLink>
                    <NavLink className={({isActive}) => isActive ? 'nav-link_selected' : 'nav-link'}
                            to="/recurrents">🔁 Récurrents</NavLink>                            
                    <NavLink className={({isActive}) => isActive ? 'nav-link_selected' : 'nav-link'}
                            to="/analyses">🍰 Par catégories</NavLink>
                    <NavLink className={({isActive}) => isActive ? 'nav-link_selected' : 'nav-link'}
                            to="/analysesTemporelles">📈 Tendances</NavLink>
                </Stack>
    } else {
        return <Stack direction="row" spacing={1}><NavLink className="nav-link" to="/infos">Accueil</NavLink></Stack>
    }
}

export default PrivateNavLinks;
