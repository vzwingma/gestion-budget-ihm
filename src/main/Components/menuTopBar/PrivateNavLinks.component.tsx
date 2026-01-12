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
                    <NavLink id="accueil-link" className={({isActive}) => isActive ? 'nav-link_selected' : 'nav-link'} to="/infos">🏠 Accueil</NavLink>
                    <NavLink id="operations-link" className={({isActive}) => isActive ? 'nav-link_selected' : 'nav-link'}
                            to="/budgets">💳 Opérations</NavLink>
                    <NavLink id="recurrents-link"  className={({isActive}) => isActive ? 'nav-link_selected' : 'nav-link'}
                            to="/recurrents">🔁 Récurrents</NavLink>                            
                    <NavLink id="analyses-link" className={({isActive}) => isActive ? 'nav-link_selected' : 'nav-link'}
                            to="/analyses">🍰 Par catégories</NavLink>
                    <NavLink id="tendances-link" className={({isActive}) => isActive ? 'nav-link_selected' : 'nav-link'}
                            to="/analysesTendances">📈 Tendances</NavLink>
                </Stack>
    } else {
        return <Stack direction="row" spacing={1}><NavLink id="accueil-link" className='nav-link_selected' to="/infos">🏠 Accueil</NavLink></Stack>
    }
}

export default PrivateNavLinks;
