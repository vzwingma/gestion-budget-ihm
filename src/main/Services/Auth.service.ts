/** Service d'Authentification**/
const OAUTH2_KEY = 'oauth2TokenKey';

/**
 * Authentifié ?
 */
export const getOAuthToken = () => {
    return localStorage.getItem(OAUTH2_KEY);
}

/**
 * Expiration confirmée du JWT effectivement envoyé (id_token), et non de l'access_token OIDC.
 * Un jeton opaque, malformé ou sans exp reste soumis au contrôle du serveur.
 * Ce décodage local ne valide pas la signature du jeton.
 */
export const estTokenExpire = (token: string | null | undefined): boolean => {
    if (token === null || token === undefined) {
        return false;
    }
    try {
        const segments = token.split('.');
        if (segments.length !== 3 || !segments.every(segment => /^[A-Za-z0-9_-]+$/.test(segment))) {
            console.warn("Expiration de session indéterminée : format du jeton invalide");
            return false;
        }
        const payload = segments[1].replace(/-/g, '+').replace(/_/g, '/');
        const claims: unknown = JSON.parse(atob(payload.padEnd(Math.ceil(payload.length / 4) * 4, '=')));
        if (typeof claims !== 'object' || claims === null || !('exp' in claims)
            || typeof claims.exp !== 'number' || !Number.isFinite(claims.exp)) {
            console.warn("Expiration de session indéterminée : expiration absente ou invalide");
            return false;
        }
        return claims.exp <= Date.now() / 1000;
    } catch {
        // Expiration indéterminée : ne pas déconnecter ; conserver les erreurs HTTP du serveur.
        console.warn("Expiration de session indéterminée : décodage du jeton impossible");
        return false;
    }
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
