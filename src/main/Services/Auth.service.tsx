/** Service d'Authentification**/
const OAUTH2_KEY = 'oauth2TokenKey';

/**
 * Authentifié ?
 */
export const getOAuthToken = () => {
    return localStorage.getItem(OAUTH2_KEY);
}
/**
 * Stockage du token
 * @param value : string valeur du token
 */
export const putTokenInStorage = (value: string) => {
    localStorage.setItem(OAUTH2_KEY, value);
}

/**
 * Suppression du token
 */
export const removeTokenFromStorage = () => {
    localStorage.removeItem(OAUTH2_KEY);
}
