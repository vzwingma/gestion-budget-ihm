import {getPreferenceUtilisateur, loadCategories, reloadBudget} from './Budget.extservices.ts';
import {call} from '../../../Services/ClientHTTP.service.ts';
import {toast} from 'react-toastify';

jest.mock('../../../Services/ClientHTTP.service.ts', () => ({
    call: jest.fn()
}));

jest.mock('./Budget.controller.ts', () => ({
    populateAllCategories: jest.fn((data: unknown) => data)
}));

jest.mock('react-toastify', () => ({
    toast: {
        error: jest.fn()
    }
}));

const flushPromises = () => new Promise(resolve => setTimeout(resolve, 0));

describe('Budget.extservices', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('charge les catégories et appelle le callback', async () => {
        const handleLoadCategories = jest.fn();
        (call as jest.Mock).mockResolvedValue([{id: 'cat-1'}]);

        loadCategories(handleLoadCategories as any);
        await flushPromises();

        expect(call).toHaveBeenCalledTimes(1);
        expect(handleLoadCategories).toHaveBeenCalledTimes(1);
    });

    test('recharge le budget pour compte/date renseignés', async () => {
        const handleBudgetUpdate = jest.fn();
        (call as jest.Mock).mockResolvedValue({id: 'budget-1'});

        reloadBudget(handleBudgetUpdate as any, {id: 'c1'} as any, new Date('2026-01-20'));
        await flushPromises();

        expect(call).toHaveBeenCalledTimes(1);
        expect(handleBudgetUpdate).toHaveBeenCalledWith({id: 'budget-1'});
    });

    test('ne recharge pas le budget si compte ou date absent', () => {
        const handleBudgetUpdate = jest.fn();

        reloadBudget(handleBudgetUpdate as any, null, new Date());
        reloadBudget(handleBudgetUpdate as any, {id: 'c1'} as any, undefined);

        expect(call).not.toHaveBeenCalled();
        expect(handleBudgetUpdate).not.toHaveBeenCalled();
    });

    test('mappe les droits utilisateur et met à jour le state', async () => {
        const setUserDroits = jest.fn();
        (call as jest.Mock).mockResolvedValue({
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
        (call as jest.Mock).mockRejectedValue(new Error('ko'));

        loadCategories(jest.fn());
        await flushPromises();

        expect(toast.error).toHaveBeenCalledTimes(1);
    });
});
