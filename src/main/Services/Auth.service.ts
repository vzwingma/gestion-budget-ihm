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
export const putTokenInStorage = (value: string | undefined) => {
    if(value)
        localStorage.setItem(OAUTH2_KEY, value);
}

/**
 * Suppression du token
 */
export const removeTokenFromStorage = () => {
    localStorage.removeItem(OAUTH2_KEY);
}

const SESSION_EXPIREE_KEY = 'sessionExpiree';

/**
 * Pose le drapeau « session expirée » (sessionStorage), lu au retour sur la page d'accueil
 */
export const marquerSessionExpiree = () => {
    sessionStorage.setItem(SESSION_EXPIREE_KEY, 'true');
}

/**
 * Lit puis efface le drapeau « session expirée »
 * @returns true si le drapeau était présent
 */
export const consommerSessionExpiree = (): boolean => {
    const present = sessionStorage.getItem(SESSION_EXPIREE_KEY) !== null;
    sessionStorage.removeItem(SESSION_EXPIREE_KEY);
    return present;
}
