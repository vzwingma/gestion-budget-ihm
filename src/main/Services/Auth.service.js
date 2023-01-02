/** Service d'Authentification**/
    const OAUTH2_KEY = 'oauth2TokenKey';
    export const OAUTH2_PROFILE_NAME = 'oauth2ProfileName';
    export const OAUTH2_PROFILE_PIC = 'oauth2ProfilePic';
    // Authentifié ?
    export const isAuthenticated = () => {
        return localStorage.getItem(OAUTH2_KEY);
    }

    // Authentifié ?
    export const getOAuthToken = () => {
        return localStorage.getItem(OAUTH2_KEY);
    }
    export const getOAuthItem = (oauthKey) => {
        return isAuthenticated() ? localStorage.getItem(oauthKey) : null;
    }


    export const authenticate = (value) => {
        console.log("Authentification par token OAuth2 ")
        localStorage.setItem(OAUTH2_KEY, value.id_token);
        localStorage.setItem(OAUTH2_PROFILE_NAME, value.profile.name);
        localStorage.setItem(OAUTH2_PROFILE_PIC, value.profile.picture);
    }

    export const logout = () => {
        console.log("Déconnexion" )
        localStorage.removeItem(OAUTH2_KEY);
        localStorage.removeItem(OAUTH2_PROFILE_NAME);
        localStorage.removeItem(OAUTH2_PROFILE_PIC);
    }
