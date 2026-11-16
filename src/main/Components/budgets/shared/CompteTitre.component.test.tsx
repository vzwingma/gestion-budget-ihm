import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';

import CompteTitre from './CompteTitre.component.tsx';
import { BudgetSelectionContext, CurrentBudgetContext } from '../../../hooks/useBudgetContext.ts';
import BudgetMensuelModel from '../../../Models/budgets/BudgetMensuel.model.ts';

/**
 * CompteTitre lit la sélection (compte, date) et le budget courant (bandeau « Compte inactif »,
 * IHM AP011 T1.2) : les deux sous-contextes doivent être fournis.
 */

const compte: any = { id: 'c1', libelle: 'Compte courant', itemIcon: 'banque' };

function renderTitre(selectedCompte: any, selectedDate = new Date(2026, 0, 1), currentBudget: BudgetMensuelModel | undefined = undefined) {
    const selectionValue: any = { selectedCompte, selectedDate, comptes: [], categories: [] };
    const currentBudgetValue: any = { currentBudget, setCurrentBudget: vi.fn(), currentOperation: null, setCurrentOperation: vi.fn(), filtreOperations: undefined, setFiltreOperations: vi.fn() };
    return render(
        <BudgetSelectionContext.Provider value={selectionValue}>
            <CurrentBudgetContext.Provider value={currentBudgetValue}>
                <CompteTitre />
            </CurrentBudgetContext.Provider>
        </BudgetSelectionContext.Provider>
    );
}

describe('CompteTitre', () => {

    test('affiche libellé, icône et année du compte sélectionné', () => {
        renderTitre(compte);

        expect(screen.getByText('Compte courant')).toBeInTheDocument();
        expect(screen.getByRole('img', { name: 'Compte courant' })).toHaveAttribute('src', '/img/banques/banque.webp');
        expect(screen.getByText(/2026/)).toBeInTheDocument();
    });

    test.each(['../x', 'a/b', 'https://evil.example/x.png', ''])('nom d icône non sûr "%s" : icône par défaut', (itemIcon) => {
        renderTitre({ ...compte, itemIcon });

        expect(screen.getByRole('img', { name: 'Compte courant' })).toHaveAttribute('src', '/img/icon.webp');
    });

    test('ne rend rien sans compte sélectionné', () => {
        renderTitre(null);

        expect(screen.queryByRole('img')).not.toBeInTheDocument();
        expect(screen.queryByText(/2026/)).not.toBeInTheDocument();
    });

    test('bandeau affiché : compte inactif, budget reçu d\'un autre mois (IHM AP011 - C2)', () => {
        const budget = new BudgetMensuelModel('c1_2025_11', 'Budget');
        renderTitre({ ...compte, actif: false }, new Date(2026, 0, 1), budget);

        expect(screen.getByText('Compte inactif — dernier budget disponible : 11/2025')).toBeInTheDocument();
    });

    test('pas de bandeau : compte inactif mais budget du mois demandé', () => {
        const budget = new BudgetMensuelModel('c1_2026_01', 'Budget');
        renderTitre({ ...compte, actif: false }, new Date(2026, 0, 1), budget);

        expect(screen.queryByText(/Compte inactif/)).not.toBeInTheDocument();
    });

    test('pas de bandeau : compte actif (backend inchangé)', () => {
        const budget = new BudgetMensuelModel('c1_2025_11', 'Budget');
        renderTitre({ ...compte, actif: true }, new Date(2026, 0, 1), budget);

        expect(screen.queryByText(/Compte inactif/)).not.toBeInTheDocument();
    });
});
