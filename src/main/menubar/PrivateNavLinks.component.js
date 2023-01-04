import React from "react";
import { useAuth } from "react-oidc-context";
import {NavLink} from "react-router-dom";

/**
 *   Page de Gestion du menu
 **/
function PrivateNavLinks() {

    if(useAuth().isAuthenticated) {
        return <NavLink className="nav-link" to="/budgets">Budgets</NavLink>
    }
}
export default PrivateNavLinks;