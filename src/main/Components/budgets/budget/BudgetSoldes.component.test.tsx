import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, test, vi, MockInstance } from 'vitest';

import BudgetSoldes from './BudgetSoldes.component.tsx';
import { CurrentBudgetContext } from '../../../hooks/useBudgetContext.ts';
import BudgetMensuelModel from '../../../Models/budgets/BudgetMensuel.model.ts';

/**
 * BudgetSoldes lit uniquement la moitié "budget courant" du contexte (AP 006 - T6) :
 * il suffit de fournir CurrentBudgetContext (pas de BudgetSelectionContext).
 */

function renderSoldes(currentBudget: BudgetMensuelModel | undefined) {
    const value: any = { currentBudget, currentOperation: null };
    return render(
        <CurrentBudgetContext.Provider value={value}>
            <BudgetSoldes />
        </CurrentBudgetContext.Provider>
    );
}

function buildBudget(actif: boolean) {
    const budget = new BudgetMensuelModel('b1', 'Budget');
    budget.actif = actif;
    budget.soldes.soldeAtMaintenant = 1234.5;
    budget.soldes.soldeAtFinMoisCourant = 2000;
    return budget;
}

describe('BudgetSoldes', () => {

    let consoleError: MockInstance;
    let consoleWarn: MockInstance;

    beforeEach(() => {
        // Les erreurs/warnings React ou MUI (ex: Tooltip sans enfant élément DOM) doivent rester absents
        consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
        consoleWarn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    });

    afterEach(() => {
        consoleError.mockRestore();
        consoleWarn.mockRestore();
    });

    test('budget actif : solde actuel et solde de fin de mois affichés', () => {
        renderSoldes(buildBudget(true));

        expect(screen.getByText(/1\s?234[.,]50/)).toBeInTheDocument();
        expect(screen.getByText(/2\s?000[.,]00/)).toBeInTheDocument();
        expect(consoleError).not.toHaveBeenCalled();
    });

    test('budget actif : survol du solde -> tooltip détaillant "Fin du mois"', async () => {
        const user = userEvent.setup();
        renderSoldes(buildBudget(true));

        expect(screen.queryByText('Fin du mois')).not.toBeInTheDocument();
        await user.hover(screen.getByText(/1\s?234[.,]50/));

        expect(await screen.findByText('Fin du mois')).toBeVisible();
        expect(screen.getByText('Soldes')).toBeVisible();
    });

    test('budget actif : survol du solde de fin de mois -> tooltip visible', async () => {
        const user = userEvent.setup();
        renderSoldes(buildBudget(true));

        await user.hover(screen.getByText(/2\s?000[.,]00/));

        expect(await screen.findByText('Fin du mois')).toBeVisible();
    });

    test('budget clos : solde actuel affiché, pas de solde de fin de mois, aucune erreur console', () => {
        renderSoldes(buildBudget(false));

        expect(screen.getByText(/1\s?234[.,]50/)).toBeInTheDocument();
        expect(screen.queryByText(/2\s?000[.,]00/)).not.toBeInTheDocument();
        expect(consoleError).not.toHaveBeenCalled();
        expect(consoleWarn).not.toHaveBeenCalled();
    });

    test('budget clos : le tooltip du solde actuel reste disponible', async () => {
        const user = userEvent.setup();
        renderSoldes(buildBudget(false));

        await user.hover(screen.getByText(/1\s?234[.,]50/));

        expect(await screen.findByText('Fin du mois')).toBeVisible();
    });

    test('sans budget courant : aucun solde affiché, aucune erreur/warning Tooltip', () => {
        renderSoldes(undefined);

        expect(screen.queryByText(/[.,]\d{2}/)).not.toBeInTheDocument();
        expect(screen.queryByText('Fin du mois')).not.toBeInTheDocument();
        expect(consoleError).not.toHaveBeenCalled();
        expect(consoleWarn).not.toHaveBeenCalled();
    });
});
