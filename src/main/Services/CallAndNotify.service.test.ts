import { describe, test, expect, vi, beforeEach } from 'vitest';
import { toast } from 'react-toastify';
import { callAndNotify, callWithNotify, messageErreurHttp, notifierErreur } from './CallAndNotify.service.ts';
import { HttpError, isSessionInvalide } from './HttpError.ts';

vi.mock('react-toastify', () => ({ toast: { error: vi.fn() } }));

// Laisse les microtâches (then/catch) se résoudre
const flush = () => new Promise((r) => setTimeout(r, 0));

describe('callAndNotify', () => {

    beforeEach(() => {
        vi.clearAllMocks();
    });

    test('succès : appelle onSuccess avec la donnée, sans toast', async () => {
        const onSuccess = vi.fn();
        callAndNotify(Promise.resolve({ id: 1 }), onSuccess, 'Erreur X');
        await flush();
        expect(onSuccess).toHaveBeenCalledWith({ id: 1 });
        expect(toast.error).not.toHaveBeenCalled();
    });

    test('échec : console.error + toast.error avec options', async () => {
        const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
        const err = new Error('ko');
        const onSuccess = vi.fn();
        const options = { autoClose: false as const };
        callAndNotify(Promise.reject(err), onSuccess, 'Erreur X', options);
        await flush();
        expect(onSuccess).not.toHaveBeenCalled();
        expect(spy).toHaveBeenCalledWith('Erreur X', err);
        expect(toast.error).toHaveBeenCalledWith('Erreur X', options);
        spy.mockRestore();
    });

    test('exception levée dans onSuccess : également notifiée', async () => {
        const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
        callAndNotify(Promise.resolve(1), () => { throw new Error('cb'); }, 'Erreur Y');
        await flush();
        expect(toast.error).toHaveBeenCalledWith('Erreur Y', undefined);
        spy.mockRestore();
    });
});

describe('callWithNotify', () => {

    beforeEach(() => {
        vi.clearAllMocks();
    });

    test('succès : résout avec la donnée, sans toast ni log', async () => {
        const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
        await expect(callWithNotify(Promise.resolve({ id: 1 }), 'Erreur X')).resolves.toEqual({ id: 1 });
        expect(toast.error).not.toHaveBeenCalled();
        expect(spy).not.toHaveBeenCalled();
        spy.mockRestore();
    });

    test('échec : console.error + toast.error (avec options) puis rejet de la même erreur', async () => {
        const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
        const err = new Error('ko');
        const options = { autoClose: false as const };

        await expect(callWithNotify(Promise.reject(err), 'Erreur X', options)).rejects.toBe(err);
        expect(spy).toHaveBeenCalledWith('Erreur X', err);
        expect(toast.error).toHaveBeenCalledWith('Erreur X', options);
        spy.mockRestore();
    });

    test('échec sans options : toast.error appelé avec options undefined', async () => {
        const spy = vi.spyOn(console, 'error').mockImplementation(() => {});

        await expect(callWithNotify(Promise.reject(new Error('ko')), 'Erreur Y')).rejects.toThrow('ko');
        expect(toast.error).toHaveBeenCalledWith('Erreur Y', undefined);
        spy.mockRestore();
    });
});

describe('notifierErreur', () => {

    beforeEach(() => {
        vi.clearAllMocks();
    });

    test.each([401, 403])('HttpError %i (session invalide) : aucun toast, pas de log console', (status) => {
        const spy = vi.spyOn(console, 'error').mockImplementation(() => {});

        notifierErreur(new HttpError(status, 'peu importe'), 'Erreur X');

        expect(toast.error).not.toHaveBeenCalled();
        expect(spy).not.toHaveBeenCalled();
        spy.mockRestore();
    });

    test('HttpError 503 : message technique dédié', () => {
        const spy = vi.spyOn(console, 'error').mockImplementation(() => {});

        notifierErreur(new HttpError(503, 'Service Unavailable'), 'Erreur X');

        expect(toast.error).toHaveBeenCalledWith('Service momentanément indisponible, réessayez', undefined);
        expect(spy).toHaveBeenCalled();
        spy.mockRestore();
    });

    test('HttpError 500 : message technique dédié', () => {
        vi.spyOn(console, 'error').mockImplementation(() => {});

        notifierErreur(new HttpError(500, 'Internal Server Error'), 'Erreur X');

        expect(toast.error).toHaveBeenCalledWith('Erreur interne du serveur, réessayez plus tard', undefined);
    });

    test('HttpError sans statut (erreur réseau) : message réseau', () => {
        vi.spyOn(console, 'error').mockImplementation(() => {});

        notifierErreur(new HttpError(undefined, '', undefined, {cause: new Error('fetch failed')}), 'Erreur X');

        expect(toast.error).toHaveBeenCalledWith('Serveur injoignable, vérifiez votre connexion', undefined);
    });

    test('HttpError 404 sans message dédié : repli sur le message de l\'appelant', () => {
        vi.spyOn(console, 'error').mockImplementation(() => {});

        notifierErreur(new HttpError(404, 'Not Found'), 'Erreur X');

        expect(toast.error).toHaveBeenCalledWith('Erreur X', undefined);
    });

    test('messagesParStatut prioritaire sur le message technique', () => {
        vi.spyOn(console, 'error').mockImplementation(() => {});

        notifierErreur(new HttpError(500, 'Internal Server Error'), 'Erreur X', undefined, {500: 'Message métier 500'});

        expect(toast.error).toHaveBeenCalledWith('Message métier 500', undefined);
    });

    test('messagesParStatut prioritaire sur le repli de l\'appelant', () => {
        vi.spyOn(console, 'error').mockImplementation(() => {});

        notifierErreur(new HttpError(404, 'Not Found'), 'Erreur X', undefined, {404: 'Message métier 404'});

        expect(toast.error).toHaveBeenCalledWith('Message métier 404', undefined);
    });

    test('le libellé renvoyé par le backend (body) ne part jamais au toast', () => {
        vi.spyOn(console, 'error').mockImplementation(() => {});

        notifierErreur(new HttpError(404, 'Not Found', 'Détail technique backend'), 'Erreur X');

        expect(toast.error).toHaveBeenCalledWith('Erreur X', undefined);
        expect((toast.error as ReturnType<typeof vi.fn>).mock.calls[0][0]).not.toContain('Détail technique backend');
    });

    test('options de toast transmises', () => {
        vi.spyOn(console, 'error').mockImplementation(() => {});
        const options = { autoClose: false as const };

        notifierErreur(new HttpError(500), 'Erreur X', options);

        expect(toast.error).toHaveBeenCalledWith('Erreur interne du serveur, réessayez plus tard', options);
    });
});

describe('messageErreurHttp (IHM AP011 T2.1 : réutilisé hors toast, ex. écran d\'erreur budget)', () => {

    test('HttpError 503 : message technique, distinct du message générique (404)', () => {
        expect(messageErreurHttp(new HttpError(503, 'Service Unavailable'), 'Impossible de charger le budget'))
            .toBe('Service momentanément indisponible, réessayez');
        expect(messageErreurHttp(new HttpError(404, 'Not Found'), 'Impossible de charger le budget'))
            .toBe('Impossible de charger le budget');
    });

    test('erreur non HttpError : message de l\'appelant tel quel', () => {
        expect(messageErreurHttp(new Error('x'), 'Impossible de charger le budget')).toBe('Impossible de charger le budget');
    });
});

describe('HttpError', () => {

    test.each([401, 403])('isSessionInvalide vrai pour le statut %i', (status) => {
        expect(new HttpError(status).isSessionInvalide).toBe(true);
    });

    test.each([200, 404, 500, undefined])('isSessionInvalide faux pour le statut %s', (status) => {
        expect(new HttpError(status).isSessionInvalide).toBe(false);
    });

    test('isSessionInvalide() (fonction) vrai pour une HttpError 401/403', () => {
        expect(isSessionInvalide(new HttpError(401))).toBe(true);
        expect(isSessionInvalide(new HttpError(403))).toBe(true);
    });

    test('isSessionInvalide() (fonction) faux pour une autre erreur ou statut', () => {
        expect(isSessionInvalide(new HttpError(500))).toBe(false);
        expect(isSessionInvalide(new Error('x'))).toBe(false);
        expect(isSessionInvalide('x')).toBe(false);
    });

    test('message "Erreur réseau" sans statut, avec statusText si fourni', () => {
        expect(new HttpError(undefined).message).toBe('Erreur réseau');
        expect(new HttpError(undefined, 'Failed to fetch').message).toBe('Erreur réseau - Failed to fetch');
    });

    test('message "HTTP <status>" avec statusText si fourni', () => {
        expect(new HttpError(404).message).toBe('HTTP 404');
        expect(new HttpError(404, 'Not Found').message).toBe('HTTP 404 - Not Found');
    });
});
