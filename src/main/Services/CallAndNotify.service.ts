import { toast } from "react-toastify";
import type { ToastOptions } from "react-toastify";
import { HttpError } from "./HttpError.ts";

/** Messages par code HTTP, prioritaires sur les messages techniques (ex: codes métier d'un appel précis) **/
export type MessagesParStatut = Partial<Record<number, string>>;

/** Messages techniques centralisés (ADR 008) **/
const MESSAGES_TECHNIQUES: Readonly<Record<number, string>> = {
    500: "Erreur interne du serveur, réessayez plus tard",
    503: "Service momentanément indisponible, réessayez"
};
const MESSAGE_ERREUR_RESEAU = "Serveur injoignable, vérifiez votre connexion";

/**
 * Journalise l'erreur (console uniquement : le libellé du backend n'est jamais affiché) et affiche le toast adapté.
 * - 401 / 403 : aucun toast, la déconnexion et le toast « Session expirée » sont gérés ailleurs ;
 * - sinon, par priorité : message par statut de l'appelant, message technique (503, 500, réseau), message de l'appelant.
 */
function notifierErreur(e: unknown, errorMessage: string, toastOptions?: ToastOptions, messagesParStatut?: MessagesParStatut): void {
    if (e instanceof HttpError) {
        if (e.isSessionInvalide) {
            return;
        }
        console.error(errorMessage, e);
        const message = e.status === undefined
            ? MESSAGE_ERREUR_RESEAU
            : (messagesParStatut?.[e.status] ?? MESSAGES_TECHNIQUES[e.status] ?? errorMessage);
        toast.error(message, toastOptions);
        return;
    }
    console.error(errorMessage, e);
    toast.error(errorMessage, toastOptions);
}

/**
 * Factorise le pattern `call(...).then(data => ...).catch(e => { console.error(...); toast.error(...) })`
 * répété dans plusieurs `*.extservices.ts`.
 *
 * Usage typique :
 * ```ts
 * callAndNotify(
 *     call(METHODE_HTTP.GET, BACKEND_ENUM.URL_X, SERVICES_URL.X.GET),
 *     (data) => setX(data),
 *     "Erreur lors du chargement de X"
 * );
 * ```
 *
 * @param promise promesse de l'appel backend (généralement issue de `ClientHTTP.service#call`)
 * @param onSuccess callback appelé avec la donnée résolue
 * @param errorMessage message loggé en erreur et affiché en toast en cas d'échec
 * @param toastOptions options optionnelles du toast d'erreur (ex: `{ autoClose: false, closeOnClick: true }`)
 * @param messagesParStatut messages métier par code HTTP (optionnel), prioritaires sur les messages techniques
 */
export function callAndNotify<T>(
    promise: Promise<T>,
    onSuccess: (data: T) => void,
    errorMessage: string,
    toastOptions?: ToastOptions,
    messagesParStatut?: MessagesParStatut
): void {
    promise
        .then(onSuccess)
        .catch((e) => {
            notifierErreur(e, errorMessage, toastOptions, messagesParStatut);
        });
}

/**
 * Variante "Promise" de {@link callAndNotify}, destinée à `useFetch` (AP 006 - T11, adoption) :
 * logue + notifie par toast en cas d'échec, puis **relance** l'erreur pour que `useFetch`
 * l'expose dans son état `error`.
 *
 * @param promise promesse de l'appel backend
 * @param errorMessage message loggé en erreur et affiché en toast en cas d'échec
 * @param toastOptions options optionnelles du toast d'erreur
 * @param messagesParStatut messages métier par code HTTP (optionnel), prioritaires sur les messages techniques
 * @returns la promesse d'origine, avec notification en cas d'échec
 */
export function callWithNotify<T>(
    promise: Promise<T>,
    errorMessage: string,
    toastOptions?: ToastOptions,
    messagesParStatut?: MessagesParStatut
): Promise<T> {
    return promise.catch((e) => {
        notifierErreur(e, errorMessage, toastOptions, messagesParStatut);
        throw e;
    });
}
