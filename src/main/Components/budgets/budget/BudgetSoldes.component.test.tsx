import React from 'react';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, test, vi, MockInstance } from 'vitest';

import BudgetSoldes from './BudgetSoldes.component.tsx';
import { CurrentBudgetContext } from '../../../hooks/useBudgetContext.ts';
import BudgetMensuelModel, { TotauxParTypeCategorie } from '../../../Models/budgets/BudgetMensuel.model.ts';

/**
 * BudgetSoldes lit uniquement la moitié "budget courant" du contexte (AP 006 - T6) :
 * il suffit de fournir CurrentBudgetContext (pas de BudgetSelectionContext).
 */

// Le format des montants dépend de la locale du runtime (ICU) : on cible les soldes par leur id plutôt que par leur texte
const parId = (id: string) => (_contenu: string, element: Element | null) => element?.id === id;

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
    budget.totauxParTypeCategories = {
        ESSENTIEL: new TotauxParTypeCategorie('ESSENTIEL', -10, -20),
        REVENUS: new TotauxParTypeCategorie('REVENUS', 30, 40),
    };
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
        vi.unstubAllGlobals();
    });

    test('budget actif : solde actuel et solde de fin de mois affichés', () => {
        renderSoldes(buildBudget(true));

        expect(screen.getByText(parId('soldeAtMaintenant'))).toBeInTheDocument();
        expect(screen.getByText(parId('soldeAtFinMoisCourant'))).toBeInTheDocument();
        expect(consoleError).not.toHaveBeenCalled();
    });

    test('budget actif : libellés « Aujourd\'hui » et « Fin de mois » affichés', () => {
        renderSoldes(buildBudget(true));

        expect(screen.getByText('Aujourd\'hui')).toBeInTheDocument();
        expect(screen.getByText('Fin de mois')).toBeInTheDocument();
    });

    test('budget actif : survol du solde -> tooltip détaillant "Fin du mois"', async () => {
        const user = userEvent.setup();
        renderSoldes(buildBudget(true));

        expect(screen.queryByText('Fin du mois')).not.toBeInTheDocument();
        await user.hover(screen.getByText(parId('soldeAtMaintenant')));

        expect(await screen.findByText('Fin du mois')).toBeVisible();
        expect(screen.getByText('Soldes')).toBeVisible();
    });

    test('budget actif : survol du solde de fin de mois -> tooltip visible', async () => {
        const user = userEvent.setup();
        renderSoldes(buildBudget(true));

        await user.hover(screen.getByText(parId('soldeAtFinMoisCourant')));

        expect(await screen.findByText('Fin du mois')).toBeVisible();
    });

    test('budget clos : solde actuel affiché, pas de solde de fin de mois, aucune erreur console', () => {
        renderSoldes(buildBudget(false));

        expect(screen.getByText(parId('soldeAtMaintenant'))).toBeInTheDocument();
        expect(screen.getByText('Aujourd\'hui')).toBeInTheDocument();
        expect(screen.queryByText('Fin de mois')).not.toBeInTheDocument();
        expect(screen.queryByText(parId('soldeAtFinMoisCourant'))).not.toBeInTheDocument();
        expect(consoleError).not.toHaveBeenCalled();
        expect(consoleWarn).not.toHaveBeenCalled();
    });

    test('budget clos : le tooltip du solde actuel reste disponible', async () => {
        const user = userEvent.setup();
        renderSoldes(buildBudget(false));

        await user.hover(screen.getByText(parId('soldeAtMaintenant')));

        expect(await screen.findByText('Fin du mois')).toBeVisible();
    });

    test('sans budget courant : aucun solde affiché, aucune erreur/warning Tooltip', () => {
        renderSoldes(undefined);

        expect(screen.queryByText(/[.,]\d{2}/)).not.toBeInTheDocument();
        expect(screen.queryByText('Aujourd\'hui')).not.toBeInTheDocument();
        expect(screen.queryByText('Fin du mois')).not.toBeInTheDocument();
        expect(consoleError).not.toHaveBeenCalled();
        expect(consoleWarn).not.toHaveBeenCalled();
    });

    test('infobulle : types de catégories et ligne Soldes', async () => {
        const user = userEvent.setup();
        renderSoldes(buildBudget(true));

        await user.hover(screen.getByText('Aujourd\'hui'));
        const tooltip = await screen.findByRole('tooltip');

        expect(within(tooltip).getByText('Essentiel')).toBeInTheDocument();
        expect(within(tooltip).getByText('Revenus')).toBeInTheDocument();
        expect(within(tooltip).getByText('Soldes')).toBeInTheDocument();
        expect(within(tooltip).getByText('Fin du mois')).toBeInTheDocument();
    });

    test('tactile : pas d\'ouverture au survol, ouverture au tap', async () => {
        setTouch(true);
        renderSoldes(buildBudget(true));

        await userEvent.hover(screen.getByText('Aujourd\'hui'));
        await new Promise((resolve) => setTimeout(resolve, 300));
        expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();

        await userEvent.click(screen.getByText('Aujourd\'hui'));
        const tooltip = await screen.findByRole('tooltip');
        expect(within(tooltip).getByText('Soldes')).toBeInTheDocument();
    });
});
