/** Service d'Authentification**/
    const OAUTH2_KEY = 'oauth2TokenKey';

    // Authentifié ?
    export const getOAuthToken = () => {
        return  localStorage.getItem(OAUTH2_KEY);
    }

    export const putTokenInStorage = (value) => {
        localStorage.setItem(OAUTH2_KEY, value);
    }

    export const removeTokenFromStorage = () => {
        localStorage.removeItem(OAUTH2_KEY);
    }
