import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, test, expect, vi, beforeEach } from 'vitest';

import { RecurrentsPage } from './Recurrents.component.tsx';
import { BudgetContextsWrapper } from '../../../hooks/budgetContexts.testutils.tsx';
import BudgetMensuelModel from '../../../Models/budgets/BudgetMensuel.model.ts';
import { createNewOperation } from '../../../Models/budgets/Operation.model.ts';
import { PERIODES_MENSUALITE_ENUM, UTILISATEUR_DROITS } from '../../../Utils/AppBusinessEnums.constants.ts';

/**
 * Tests de rendu de RecurrentsPage (filet de sécurité AP 006 - T19, posé avant T1 :
 * fusion avec BudgetPage).
 *
 * Même stratégie que Budget.component.test.tsx : enfants mockés, services réseau mockés,
 * `fetchBudget` mocké résout le budget (useFetch) pour vérifier le
 * regroupement des opérations récurrentes par périodicité.
 */

vi.mock('./../budget/Budget.extservices.ts', () => ({
    fetchPreferenceUtilisateur: vi.fn(),
    fetchBudget: vi.fn()
}));

vi.mock('../shared/BudgetPageHeader.component.tsx', () => ({
    default: ({ additionalHeaderContentRight }: any) => (
        <div data-testid="mock-header">{additionalHeaderContentRight}</div>
    )
}));

vi.mock('../budget/actions/BudgetActionsButtonGroup.component.tsx', () => ({
    BudgetActionsButtonGroupComponent: ({ droits }: any) => <output data-testid="mock-actions">{droits.join(',')}</output>
}));

vi.mock('../operations/recurrentes/OperationsRecurrentesListe.component.tsx', () => ({
    default: ({ operationGroupedByPeriodicity, onClick }: any) => (
        <div data-testid="mock-liste">
            {Object.entries(operationGroupedByPeriodicity).map(([periode, operations]: any) => (
                <div key={periode} data-testid={`group-${periode}`}>
                    {operations.map((operation: any) => (
                        <button key={operation.id} data-testid={`op-${operation.id}`} onClick={() => onClick(operation)} />
                    ))}
                </div>
            ))}
        </div>
    )
}));

vi.mock('../operations/recurrentes/details/OperationRecurrenteDetailPage.component.tsx', () => ({
    default: () => <div data-testid="mock-detail" />
}));

import { fetchBudget, fetchPreferenceUtilisateur } from './../budget/Budget.extservices.ts';

function buildOperationRecurrente(id: string) {
    const operation = createNewOperation();
    operation.id = id;
    operation.libelle = 'Opération récurrente ' + id;
    operation.mensualite = { periode: PERIODES_MENSUALITE_ENUM.MENSUELLE, prochaineEcheance: 15 };
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
        ...overrides
    };
}

function renderRecurrentsPage(contextOverrides: any = {}) {
    const contextValue = buildContextValue(contextOverrides);
    const onOpenMenu = vi.fn();
    render(
        <BudgetContextsWrapper value={contextValue}>
            <RecurrentsPage onOpenMenu={onOpenMenu} />
        </BudgetContextsWrapper>
    );
    return { contextValue, onOpenMenu };
}

describe('RecurrentsPage', () => {

    beforeEach(() => {
        vi.clearAllMocks();
        // Variantes Promise consommées par useFetch : toujours une promesse résolue par défaut
        (fetchPreferenceUtilisateur as any).mockResolvedValue([]);
        (fetchBudget as any).mockResolvedValue(undefined);
    });

    test('affiche le Backdrop de chargement quand aucun budget courant', () => {
        renderRecurrentsPage({ currentBudget: undefined });

        expect(screen.queryByTestId('mock-liste')).not.toBeInTheDocument();
        expect(screen.queryByTestId('mock-detail')).not.toBeInTheDocument();
    });

    test('regroupe les opérations récurrentes par périodicité et affiche la liste', () => {
        const budget = new BudgetMensuelModel('budget-1', 'Budget test');
        budget.listeOperations = [buildOperationRecurrente('op-1')];

        (fetchBudget as any).mockResolvedValue(budget);

        renderRecurrentsPage({ currentBudget: budget });

        expect(screen.getByTestId('mock-liste')).toBeInTheDocument();
        expect(screen.getByTestId(`group-${PERIODES_MENSUALITE_ENUM.MENSUELLE}`)).toBeInTheDocument();
        expect(screen.getByTestId('op-op-1')).toBeInTheDocument();
    });

    test('droits utilisateur : préférences chargées transmises telles quelles (pas de droit de création ajouté)', async () => {
        (fetchPreferenceUtilisateur as any).mockResolvedValue([UTILISATEUR_DROITS.DROIT_RAZ_BUDGET]);
        const budget = new BudgetMensuelModel('budget-1', 'Budget test');
        (fetchBudget as any).mockResolvedValue(budget);

        renderRecurrentsPage({ currentBudget: budget });

        await waitFor(() => expect(screen.getByTestId('mock-actions')).toHaveTextContent(String(UTILISATEUR_DROITS.DROIT_RAZ_BUDGET)));
        expect(screen.getByTestId('mock-actions')).not.toHaveTextContent(String(UTILISATEUR_DROITS.DROIT_CREATE_OPERATION));
    });

    test('droits utilisateur : aucun droit tant que les préférences ne sont pas chargées', () => {
        const budget = new BudgetMensuelModel('budget-1', 'Budget test');

        renderRecurrentsPage({ currentBudget: budget });

        expect(screen.getByTestId('mock-actions')).toBeEmptyDOMElement();
    });

    test('sélection d une opération récurrente met à jour currentOperation', async () => {
        const user = userEvent.setup();
        const budget = new BudgetMensuelModel('budget-1', 'Budget test');
        const operation = buildOperationRecurrente('op-1');
        budget.listeOperations = [operation];

        (fetchBudget as any).mockResolvedValue(budget);

        const { contextValue } = renderRecurrentsPage({ currentBudget: budget });

        await user.click(screen.getByTestId('op-op-1'));

        expect(contextValue.setCurrentOperation).toHaveBeenCalledWith(operation);
    });

    test('affiche le détail quand une opération est sélectionnée', () => {
        const budget = new BudgetMensuelModel('budget-1', 'Budget test');
        const operation = buildOperationRecurrente('op-1');
        budget.listeOperations = [operation];

        renderRecurrentsPage({ currentBudget: budget, currentOperation: operation });

        expect(screen.getByTestId('mock-detail')).toBeInTheDocument();
    });
});
