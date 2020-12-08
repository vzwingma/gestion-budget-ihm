/** Service d'Authentification**/
    const OAUTH2_KEY = 'oauth2TokenKey';
    // Authentifié ?
    export const isAuthenticated = () => {
        if (localStorage.getItem(OAUTH2_KEY)) {
            console.log("L'utilisateur est connecté")
            return true;
        }
        else{
            console.log("L'utilisateur n'est pas connecté")
            return false;
        }
    }

    export const authenticate = (value) => {
        console.log("Authentification du token OAuth2 " + value)
        localStorage.setItem(OAUTH2_KEY, value);
    }

    export const logout = (value) => {
        console.log("Déconnexion du token OAUTH2_KEY" )
        localStorage.removeItem(OAUTH2_KEY);
    }