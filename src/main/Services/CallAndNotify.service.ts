import { toast } from "react-toastify";
import type { ToastOptions } from "react-toastify";

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
 */
export function callAndNotify<T>(
    promise: Promise<T>,
    onSuccess: (data: T) => void,
    errorMessage: string,
    toastOptions?: ToastOptions
): void {
    promise
        .then(onSuccess)
        .catch((e) => {
            console.error(errorMessage, e);
            toast.error(errorMessage, toastOptions);
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
 * @returns la promesse d'origine, avec notification en cas d'échec
 */
export function callWithNotify<T>(
    promise: Promise<T>,
    errorMessage: string,
    toastOptions?: ToastOptions
): Promise<T> {
    return promise.catch((e) => {
        console.error(errorMessage, e);
        toast.error(errorMessage, toastOptions);
        throw e;
    });
}
