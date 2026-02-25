import {callReinitBudget, callReopenCloseBudget} from './BudgetActionsButtonGroup.extservices.ts';
import {call} from './../../../../Services/ClientHTTP.service.ts';
import {toast} from 'react-toastify';

jest.mock('./../../../../Services/ClientHTTP.service.ts', () => ({
    call: jest.fn()
}));

jest.mock('react-toastify', () => ({
    toast: {
        error: jest.fn(),
        success: jest.fn()
    }
}));

const flushPromises = () => new Promise(resolve => setTimeout(resolve, 0));

describe('BudgetActionsButtonGroup.extservices', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('réinitialise un budget et propage la mise à jour', async () => {
        const onActionBudgetChange = jest.fn();
        (call as jest.Mock).mockResolvedValue({id: 'b1'});

        callReinitBudget({id: 'b1'} as any, onActionBudgetChange);
        await flushPromises();

        expect(call).toHaveBeenCalledTimes(1);
        expect(onActionBudgetChange).toHaveBeenCalledWith({id: 'b1'});
    });

    test('affiche une erreur si la réinitialisation échoue', async () => {
        (call as jest.Mock).mockRejectedValue(new Error('ko'));

        callReinitBudget({id: 'b1'} as any, jest.fn());
        await flushPromises();

        expect(toast.error).toHaveBeenCalledTimes(1);
    });

    test('réouvre ou clôture un budget et affiche un succès', async () => {
        const onActionBudgetChange = jest.fn();
        (call as jest.Mock).mockResolvedValue({id: 'b1'});

        callReopenCloseBudget('b1', true, onActionBudgetChange);
        await flushPromises();

        expect(call).toHaveBeenCalledTimes(1);
        expect(toast.success).toHaveBeenCalledTimes(1);
        expect(onActionBudgetChange).toHaveBeenCalledWith({id: 'b1'});
    });
});
