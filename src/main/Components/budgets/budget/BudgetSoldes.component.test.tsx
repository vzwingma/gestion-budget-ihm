import React from 'react';
import {afterEach, describe, expect, test, vi} from 'vitest';
import {render, screen, within} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import BudgetSoldes from './BudgetSoldes.component.tsx';
import BudgetMensuelModel, {TotauxParTypeCategorie} from '../../../Models/budgets/BudgetMensuel.model.ts';
import {BudgetContext} from '../../../Models/contextProvider/BudgetContextProvider.tsx';

const TOUCH_QUERY = '(hover: none) and (pointer: coarse)';

const setTouch = (touch: boolean) => {
    vi.stubGlobal('matchMedia', (query: string) => ({
        matches: touch && query === TOUCH_QUERY,
        media: query,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        addListener: vi.fn(),
        removeListener: vi.fn(),
    }));
};

afterEach(() => {
    vi.unstubAllGlobals();
});

// Montants < 1000 : indépendant de la locale (séparateur de milliers)
const budgetDeTest = (actif = true): BudgetMensuelModel => {
    const budget = new BudgetMensuelModel('b1', 'Budget');
    budget.actif = actif;
    budget.soldes.soldeAtMaintenant = -123.5;
    budget.soldes.soldeAtFinMoisCourant = 456;
    budget.totauxParTypeCategories = {
        ESSENTIEL: new TotauxParTypeCategorie('ESSENTIEL', -10, -20),
        REVENUS: new TotauxParTypeCategorie('REVENUS', 30, 40),
    };
    return budget;
};

const renderSoldes = (budget: BudgetMensuelModel | undefined) =>
    render(
        <BudgetContext.Provider value={{currentBudget: budget} as unknown as React.ContextType<typeof BudgetContext>}>
            <BudgetSoldes/>
        </BudgetContext.Provider>
    );

describe('BudgetSoldes - affichage', () => {
    test('affiche « Aujourd\'hui » et « Fin de mois » avec les valeurs signées (moins ASCII)', () => {
        renderSoldes(budgetDeTest());
        expect(screen.getByText('Aujourd\'hui')).toBeInTheDocument();
        expect(screen.getByText('Fin de mois')).toBeInTheDocument();
        expect(screen.getByText(/^-123,50\s€$/)).toBeInTheDocument();
        expect(screen.getByText(/^456,00\s€$/)).toBeInTheDocument();
    });

    test('budget inactif : « Fin de mois » absent, « Aujourd\'hui » présent', () => {
        renderSoldes(budgetDeTest(false));
        expect(screen.getByText('Aujourd\'hui')).toBeInTheDocument();
        expect(screen.queryByText('Fin de mois')).not.toBeInTheDocument();
        expect(screen.queryByText(/456,00/)).not.toBeInTheDocument();
    });

    test('budget absent : rien de rendu', () => {
        renderSoldes(undefined);
        expect(screen.queryByText('Aujourd\'hui')).not.toBeInTheDocument();
        expect(screen.queryByText('Fin de mois')).not.toBeInTheDocument();
    });
});

describe('BudgetSoldes - infobulle', () => {
    test('survol (desktop) : types de catégories + ligne Soldes', async () => {
        renderSoldes(budgetDeTest());
        await userEvent.hover(screen.getByText('Aujourd\'hui'));
        const tooltip = await screen.findByRole('tooltip');
        expect(within(tooltip).getByText('Essentiel')).toBeInTheDocument();
        expect(within(tooltip).getByText('Revenus')).toBeInTheDocument();
        expect(within(tooltip).getByText('Soldes')).toBeInTheDocument();
        expect(within(tooltip).getByText('Fin du mois')).toBeInTheDocument();
        expect(within(tooltip).getByText(/^-123,50\s€$/)).toBeInTheDocument();
        expect(within(tooltip).getByText(/^-10,00\s€$/)).toBeInTheDocument();
    });

    test('tactile : pas d\'ouverture au survol, ouverture au tap', async () => {
        setTouch(true);
        renderSoldes(budgetDeTest());
        await userEvent.hover(screen.getByText('Aujourd\'hui'));
        await new Promise((r) => setTimeout(r, 300));
        expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();

        await userEvent.click(screen.getByText('Aujourd\'hui'));
        const tooltip = await screen.findByRole('tooltip');
        expect(within(tooltip).getByText('Soldes')).toBeInTheDocument();
    });
});
