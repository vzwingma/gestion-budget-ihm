import type { Mock } from 'vitest';
import {getPreferenceUtilisateur, loadCategories, reloadBudget} from './Budget.extservices.ts';
import {call} from '../../../Services/ClientHTTP.service.ts';
import {toast} from 'react-toastify';

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

const flushPromises = () => new Promise(resolve => setTimeout(resolve, 0));

describe('Budget.extservices', () => {

    beforeEach(() => {
        vi.clearAllMocks();
    });

    test('charge les catégories et appelle le callback', async () => {
        const handleLoadCategories = vi.fn();
        (call as Mock).mockResolvedValue([{id: 'cat-1'}]);

        loadCategories(handleLoadCategories as any);
        await flushPromises();

        expect(call).toHaveBeenCalledTimes(1);
        expect(handleLoadCategories).toHaveBeenCalledTimes(1);
    });

    test('recharge le budget pour compte/date renseignés', async () => {
        const handleBudgetUpdate = vi.fn();
        (call as Mock).mockResolvedValue({id: 'budget-1'});

        reloadBudget(handleBudgetUpdate as any, {id: 'c1'} as any, new Date('2026-01-20'));
        await flushPromises();

        expect(call).toHaveBeenCalledTimes(1);
        expect(handleBudgetUpdate).toHaveBeenCalledWith({id: 'budget-1'});
    });

    test('ne recharge pas le budget si compte ou date absent', () => {
        const handleBudgetUpdate = vi.fn();

        reloadBudget(handleBudgetUpdate as any, null, new Date());
        reloadBudget(handleBudgetUpdate as any, {id: 'c1'} as any);

        expect(call).not.toHaveBeenCalled();
        expect(handleBudgetUpdate).not.toHaveBeenCalled();
    });

    test('mappe les droits utilisateur et met à jour le state', async () => {
        const setUserDroits = vi.fn();
        (call as Mock).mockResolvedValue({
            droits: {
                DROIT_CLOTURE_BUDGET: true,
                DROIT_RAZ_BUDGET: false
            }
        });

        getPreferenceUtilisateur(setUserDroits as any);
        await flushPromises();

        expect(setUserDroits).toHaveBeenCalledTimes(1);
        expect(setUserDroits.mock.calls[0][0].length).toBeGreaterThan(0);
    });

    test('affiche un toast si chargement catégories en erreur', async () => {
        (call as Mock).mockRejectedValue(new Error('ko'));

        loadCategories(vi.fn());
        await flushPromises();

        expect(toast.error).toHaveBeenCalledTimes(1);
    });
});
