import type { Mock } from 'vitest';
import {callReinitBudget, callReopenCloseBudget} from './BudgetActionsButtonGroup.extservices.ts';
import {call} from './../../../../Services/ClientHTTP.service.ts';
import {toast} from 'react-toastify';

vi.mock('./../../../../Services/ClientHTTP.service.ts', () => ({
    call: vi.fn()
}));

vi.mock('react-toastify', () => ({
    toast: {
        error: vi.fn(),
        success: vi.fn()
    }
}));

const flushPromises = () => new Promise(resolve => setTimeout(resolve, 0));

describe('BudgetActionsButtonGroup.extservices', () => {

    beforeEach(() => {
        vi.clearAllMocks();
    });

    test('réinitialise un budget et propage la mise à jour', async () => {
        const onActionBudgetChange = vi.fn();
        (call as Mock).mockResolvedValue({id: 'b1'});

        callReinitBudget({id: 'b1'} as any, onActionBudgetChange);
        await flushPromises();

        expect(call).toHaveBeenCalledTimes(1);
        expect(onActionBudgetChange).toHaveBeenCalledWith({id: 'b1'});
    });

    test('affiche une erreur si la réinitialisation échoue', async () => {
        (call as Mock).mockRejectedValue(new Error('ko'));

        callReinitBudget({id: 'b1'} as any, vi.fn());
        await flushPromises();

        expect(toast.error).toHaveBeenCalledTimes(1);
    });

    test('réouvre ou clôture un budget et affiche un succès', async () => {
        const onActionBudgetChange = vi.fn();
        (call as Mock).mockResolvedValue({id: 'b1'});

        callReopenCloseBudget('b1', true, onActionBudgetChange);
        await flushPromises();

        expect(call).toHaveBeenCalledTimes(1);
        expect(toast.success).toHaveBeenCalledTimes(1);
        expect(onActionBudgetChange).toHaveBeenCalledWith({id: 'b1'});
    });
});
