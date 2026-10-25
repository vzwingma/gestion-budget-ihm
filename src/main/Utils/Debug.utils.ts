/**
 * Utilitaires de debug : logs applicatifs activés uniquement si VITE_CONFIG_DEBUG est renseigné.
 */

/**
 * @returns {boolean} true si le mode debug est actif (VITE_CONFIG_DEBUG)
 */
export function isDebugEnabled(): boolean {
    return !!import.meta.env.VITE_CONFIG_DEBUG;
}

/**
 * Trace de debug (console.log) uniquement si le mode debug est actif.
 * Attention : les arguments sont évalués même si le debug est inactif → pas de calcul coûteux.
 * @param args éléments à tracer
 */
export function debug(...args: unknown[]): void {
    if (isDebugEnabled()) {
        console.log(...args);
    }
}
