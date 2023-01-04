/** Service d'Authentification**/
    const OAUTH2_KEY = 'oauth2TokenKey';

    // Authentifié ?
    export const getOAuthToken = () => {
        return  localStorage.getItem(OAUTH2_KEY);
    }

    export const putTokenInStorage = (value) => {
        console.log("putTokenInStorage OAuth2 ")
        localStorage.setItem(OAUTH2_KEY, value);
    }

    export const removeTokenFromStorage = () => {
        console.log("removeTokenFromStorage" )
        localStorage.removeItem(OAUTH2_KEY);
    }
