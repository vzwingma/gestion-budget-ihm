/** Service d'Authentification**/
    const OAUTH2_KEY = 'oauth2TokenKey';
    // Authentifié
    export const isAuthenticated = () => {
        console.log("is Authenticated ? " + localStorage.getItem(OAUTH2_KEY));
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
        isAuthenticated();
    }

    export const logout = (value) => {
        console.log("Déconnexion du token ")
        localStorage.removeItem(OAUTH2_KEY);
    }