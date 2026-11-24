import {useEffect} from "react";
import {CircularProgress} from "@mui/material";
import {useAuth} from "react-oidc-context";
import {Navigate, Outlet} from "react-router-dom";
import {estTokenExpire, getOAuthToken} from "../../Services/Auth.service.ts";
import {estDeconnexionEnCours, verifierSessionExpiree} from "../../Services/ClientHTTP.service.ts";

/** Ne monte aucune page métier tant que la session n'est pas restaurée et utilisable. */
export default function RequireAuth() {
    const auth = useAuth();
    const enChargement = auth.isLoading || Boolean(auth.activeNavigator);
    // Le hook racine synchronise cet id_token en layout effect, avant les effets HTTP des pages.
    const token = auth.user?.id_token ?? getOAuthToken();
    const expire = estTokenExpire(token);
    const deconnexion = estDeconnexionEnCours();

    useEffect(() => {
        if (!enChargement && expire) {
            // Le rendu reste pur ; le gestionnaire racine est enregistré en layout effect.
            verifierSessionExpiree(getOAuthToken() ?? token);
        }
    }, [enChargement, expire, token]);

    if (enChargement) {
        return <CircularProgress />;
    }
    if (expire || deconnexion) {
        return null;
    }
    if (!auth.isAuthenticated || !auth.user?.id_token) {
        return <Navigate to="/" replace />;
    }
    return <Outlet />;
}
