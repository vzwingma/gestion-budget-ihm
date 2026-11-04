/**
 * Erreur typée d'un appel HTTP vers le backend (ADR 008).
 *
 * - réponse non 2xx : `status` et `statusText` de la réponse, `body` = corps texte éventuel
 *   (destiné à la console uniquement, jamais à l'affichage) ;
 * - erreur réseau (pas de réponse) : `status` indéfini, erreur d'origine dans `cause`.
 */
export class HttpError extends Error {
    readonly status: number | undefined;
    readonly statusText: string;
    readonly body: string | undefined;

    constructor(status: number | undefined, statusText: string = "", body?: string, options?: { cause?: unknown }) {
        super(status === undefined
            ? "Erreur réseau" + (statusText ? " - " + statusText : "")
            : "HTTP " + status + (statusText ? " - " + statusText : ""), options);
        this.name = "HttpError";
        this.status = status;
        this.statusText = statusText;
        this.body = body;
    }

    /** Erreur d'authentification (401 / 403) : la session est invalide, la déconnexion est déjà déclenchée **/
    get isSessionInvalide(): boolean {
        return this.status === 401 || this.status === 403;
    }
}
