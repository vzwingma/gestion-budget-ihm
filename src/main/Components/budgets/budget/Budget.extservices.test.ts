import type { Mock } from 'vitest';
import {fetchBudget, fetchCategories, fetchPreferenceUtilisateur} from './Budget.extservices.ts';
import {call} from '../../../Services/ClientHTTP.service.ts';
import {toast} from 'react-toastify';
import {UTILISATEUR_DROITS} from '../../../Utils/AppBusinessEnums.constants.ts';

vi.mock('../../../Services/ClientHTTP.service.ts', () => ({
    call: vi.fn()
}));

vi.mock('./Budget.controller.ts', () => ({
    populateAllCategories: vi.fn((data: unknown) => data)
}));

vi.mock('react-toastify', () => ({
    toast: {
        error: vi.fn()
    }
}));

describe('Budget.extservices (variantes Promise pour useFetch)', () => {

    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('fetchCategories', () => {
        test('résout avec les catégories peuplées', async () => {
            (call as Mock).mockResolvedValue([{id: 'cat-1'}]);

            await expect(fetchCategories()).resolves.toEqual([{id: 'cat-1'}]);
            expect(call).toHaveBeenCalledTimes(1);
            expect(toast.error).not.toHaveBeenCalled();
        });

        test('en erreur : toast + rejet', async () => {
            const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
            (call as Mock).mockRejectedValue(new Error('ko'));

            await expect(fetchCategories()).rejects.toThrow('ko');
            expect(toast.error).toHaveBeenCalledTimes(1);
            expect(toast.error).toHaveBeenCalledWith('Erreur lors du chargement des catégories', undefined);
            spy.mockRestore();
        });
    });

    describe('fetchBudget', () => {
        test('résout avec le budget et passe compte/année/mois (mois 1-based) à call()', async () => {
            (call as Mock).mockResolvedValue({id: 'budget-1'});

            await expect(fetchBudget({id: 'c1'} as any, new Date(2026, 0, 20))).resolves.toEqual({id: 'budget-1'});
            expect((call as Mock).mock.calls[0][3]).toEqual(['c1', '2026', '1']);
        });

        test.each([
            ['compte null', null, new Date(2026, 0, 20)],
            ['date absente', {id: 'c1'}, undefined],
        ])('résout avec undefined sans appel réseau : %s', async (_nom, compte, date) => {
            await expect(fetchBudget(compte as any, date)).resolves.toBeUndefined();
            expect(call).not.toHaveBeenCalled();
        });

        test('en erreur : toast persistant (autoClose false) + rejet', async () => {
            const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
            (call as Mock).mockRejectedValue(new Error('500'));

            await expect(fetchBudget({id: 'c1'} as any, new Date(2026, 2, 5))).rejects.toThrow('500');
            expect(toast.error).toHaveBeenCalledWith(
                'Erreur lors du chargement du budget c1 du 3/2026', {autoClose: false, closeOnClick: true});
            spy.mockRestore();
        });
    });

    describe('fetchPreferenceUtilisateur', () => {
        test('mappe les droits à true vers l enum, ignore les droits à false ou inconnus', async () => {
            (call as Mock).mockResolvedValue({
                droits: {
                    DROIT_CLOTURE_BUDGET: true,
                    DROIT_RAZ_BUDGET: false,
                    DROIT_CREATE_OPERATION: true,
                    DROIT_INCONNU: true
                }
            });

            await expect(fetchPreferenceUtilisateur()).resolves.toEqual([
                UTILISATEUR_DROITS.DROIT_CLOTURE_BUDGET,
                UTILISATEUR_DROITS.DROIT_CREATE_OPERATION
            ]);
        });

        test('en erreur : log + rejet, sans toast', async () => {
            const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
            (call as Mock).mockRejectedValue(new Error('403'));

            await expect(fetchPreferenceUtilisateur()).rejects.toThrow('403');
            expect(spy).toHaveBeenCalled();
            expect(toast.error).not.toHaveBeenCalled();
            spy.mockRestore();
        });
    });
});
