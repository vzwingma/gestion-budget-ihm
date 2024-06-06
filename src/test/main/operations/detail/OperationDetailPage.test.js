import '@testing-library/jest-dom';
import {
    getListeAllCategories,
    handleDateOperationFromAction,
    handleOperationEditionClick
} from '../../../../main/budgets/operations/detail/OperationDetailPage.controller';

describe('OperationDetailPage Controller', () => {
    describe('getListeAllCategories', () => {
        it('should return all categories', () => {
            // Mock props
            this.props = {
                listeCategories: [
                    {
                        listeSSCategories: ['ssCat1', 'ssCat2']
                    },
                    {
                        listeSSCategories: ['ssCat3', 'ssCat4']
                    }
                ]
            };

            const result = getListeAllCategories.call(this);
            expect(result).toEqual(['ssCat1', 'ssCat2', 'ssCat3', 'ssCat4']);
        });
    });

    describe('handleOperationEditionClick', () => {
        it('should handle click event', () => {
            // Mock props and state
            this.props = {budget: {actif: true}};
            this.state = {editOperation: {formValidationEnabled: false}, editForm: {}};

            const event = {target: {}, type: 'click'};
            handleOperationEditionClick.call(this, event);
            expect(this.state.editForm).toBeDefined();
        });
    });

    describe('handleDateOperationFromAction', () => {
        it('should handle date operation', () => {
            // Mock state
            this.state = {editOperation: {autresInfos: {}}};

            const valeurDate = '2022-01-01';
            handleDateOperationFromAction.call(this, valeurDate);
            expect(this.state.editOperation.autresInfos.dateOperation).toEqual(valeurDate);
        });
    });

    // Add more tests for other functions...
});
