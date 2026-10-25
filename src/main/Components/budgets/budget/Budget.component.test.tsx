import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, test, expect, vi, beforeEach } from 'vitest';

import { BudgetPage } from './Budget.component.tsx';
import { BudgetContext } from '../../../Models/contextProvider/BudgetContextProvider.tsx';
import BudgetMensuelModel from '../../../Models/budgets/BudgetMensuel.model.ts';
import { createNewOperation } from '../../../Models/budgets/Operation.model.ts';
import { OPERATION_ETATS_ENUM } from '../../../Utils/AppBusinessEnums.constants.ts';
import { FILTRE_OPERATIONS_VIDE } from '../../../Utils/OperationsFilter.utils.ts';

/**
 * Tests de rendu de BudgetPage (filet de sécurité AP 006 - T19, posé avant T1/T5 :
 * fusion avec RecurrentsPage et dérivation du regroupement via useMemo).
 *
 * Stratégie : composants enfants mockés (header, soldes, actions, liste, détail), services
 * réseau mockés (pas d'appel HTTP réel). Le `fetchBudget` mocké résout le budget
 * (consommé par `useFetch`) pour simuler la réponse du back-end et vérifier le
 * regroupement des opérations par date.
 */

vi.mock('./Budget.extservices.ts', () => ({
    fetchCategories: vi.fn(),
    fetchPreferenceUtilisateur: vi.fn(),
    fetchBudget: vi.fn()
}));

vi.mock('../operations/courantes/detail/OperationDetailPage.extservices.ts', () => ({
    fetchLibellesOperationsCompte: vi.fn()
}));

vi.mock('../shared/BudgetPageHeader.component.tsx', () => ({
    default: ({ additionalHeaderContentLeft, additionalHeaderContentRight }: any) => (
        <div data-testid="mock-header">
            {additionalHeaderContentLeft}
            {additionalHeaderContentRight}
        </div>
    )
}));

vi.mock('./BudgetSoldes.component.tsx', () => ({
    default: () => <div data-testid="mock-soldes" />
}));

vi.mock('./actions/BudgetActionsButtonGroup.component.tsx', () => ({
    BudgetActionsButtonGroupComponent: ({ onActionOperationCreate }: any) => (
        <button data-testid="mock-create" onClick={onActionOperationCreate} />
    )
}));

vi.mock('../operations/OperationsListe.component.tsx', () => ({
    default: ({ operationGroupedByDate, onClick }: any) => (
        <div data-testid="mock-liste">
            {Object.entries(operationGroupedByDate).map(([date, operations]: any) => (
                <div key={date} data-testid={`group-${date}`}>
                    {operations.map((operation: any) => (
                        <button key={operation.id} data-testid={`op-${operation.id}`} onClick={() => onClick(operation)} />
                    ))}
                </div>
            ))}
        </div>
    )
}));

vi.mock('../operations/courantes/detail/OperationDetailPage.component.tsx', () => ({
    default: () => <div data-testid="mock-detail" />
}));

import { fetchBudget, fetchCategories, fetchPreferenceUtilisateur } from './Budget.extservices.ts';
import { fetchLibellesOperationsCompte } from '../operations/courantes/detail/OperationDetailPage.extservices.ts';

function buildOperation(id: string, dateOperation: Date | null) {
    const operation = createNewOperation();
    operation.id = id;
    operation.libelle = 'Opération ' + id;
    operation.etat = OPERATION_ETATS_ENUM.REALISEE;
    operation.autresInfos.dateOperation = dateOperation;
    return operation;
}

function buildContextValue(overrides: any = {}) {
    return {
        currentBudget: undefined,
        setCurrentBudget: vi.fn(),
        currentOperation: null,
        setCurrentOperation: vi.fn(),
        comptes: [],
        setListeComptes: vi.fn(),
        selectedCompte: { id: 'compte-1', libelle: 'Compte 1' },
        setSelectedCompte: vi.fn(),
        selectedDate: new Date(2026, 0, 1),
        setSelectedDate: vi.fn(),
        categories: [],
        setCategories: vi.fn(),
        filtreOperations: FILTRE_OPERATIONS_VIDE,
        setFiltreOperations: vi.fn(),
        ...overrides
    };
}

function renderBudgetPage(contextOverrides: any = {}) {
    const contextValue = buildContextValue(contextOverrides);
    const onOpenMenu = vi.fn();
    render(
        <BudgetContext.Provider value={contextValue}>
            <BudgetPage onOpenMenu={onOpenMenu} />
        </BudgetContext.Provider>
    );
    return { contextValue, onOpenMenu };
}

describe('BudgetPage', () => {

    beforeEach(() => {
        vi.clearAllMocks();
        // Variantes Promise consommées par useFetch : toujours une promesse résolue par défaut
        (fetchCategories as any).mockResolvedValue([]);
        (fetchPreferenceUtilisateur as any).mockResolvedValue([]);
        (fetchLibellesOperationsCompte as any).mockResolvedValue([]);
        (fetchBudget as any).mockResolvedValue(undefined);
    });

    test('affiche le Backdrop de chargement quand aucun budget courant', () => {
        renderBudgetPage({ currentBudget: undefined });

        expect(screen.queryByTestId('mock-liste')).not.toBeInTheDocument();
        expect(screen.queryByTestId('mock-detail')).not.toBeInTheDocument();
    });

    test('regroupe les opérations par date à la résolution du budget et affiche la liste', () => {
        const budget = new BudgetMensuelModel('budget-1', 'Budget test');
        const dateOperation = new Date(2026, 0, 15);
        budget.listeOperations = [buildOperation('op-1', dateOperation)];

        (fetchBudget as any).mockResolvedValue(budget);

        renderBudgetPage({ currentBudget: budget });

        expect(screen.getByTestId('mock-liste')).toBeInTheDocument();
        expect(screen.getByTestId('op-op-1')).toBeInTheDocument();
    });

    test('sélection d une opération dans la liste met à jour currentOperation', async () => {
        const user = userEvent.setup();
        const budget = new BudgetMensuelModel('budget-1', 'Budget test');
        const operation = buildOperation('op-1', new Date(2026, 0, 15));
        budget.listeOperations = [operation];

        (fetchBudget as any).mockResolvedValue(budget);

        const { contextValue } = renderBudgetPage({ currentBudget: budget });

        await user.click(screen.getByTestId('op-op-1'));

        expect(contextValue.setCurrentOperation).toHaveBeenCalledWith(operation);
    });

    test('bouton de création déclenche setCurrentOperation avec une nouvelle opération', async () => {
        const user = userEvent.setup();
        const budget = new BudgetMensuelModel('budget-1', 'Budget test');

        const { contextValue } = renderBudgetPage({ currentBudget: budget });

        await user.click(screen.getByTestId('mock-create'));

        const calls = (contextValue.setCurrentOperation as any).mock.calls;
        const createdOperation = calls[calls.length - 1][0];
        expect(createdOperation.id).toBe('-1');
    });
});
