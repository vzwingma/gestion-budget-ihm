import { describe, test, expect, vi, beforeEach } from 'vitest';
import { toast } from 'react-toastify';
import { callAndNotify } from './CallAndNotify.service.ts';

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
