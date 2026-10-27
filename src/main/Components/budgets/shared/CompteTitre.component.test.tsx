import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';

import CompteTitre from './CompteTitre.component.tsx';
import { BudgetSelectionContext } from '../../../hooks/useBudgetContext.ts';

/**
 * CompteTitre lit uniquement la moitié "sélection" du contexte (AP 006 - T6) :
 * il suffit de fournir BudgetSelectionContext (pas de CurrentBudgetContext).
 */

const compte: any = { id: 'c1', libelle: 'Compte courant', itemIcon: 'banque.png' };

function renderTitre(selectedCompte: any, selectedDate = new Date(2026, 0, 1)) {
    const value: any = { selectedCompte, selectedDate, comptes: [], categories: [] };
    return render(
        <BudgetSelectionContext.Provider value={value}>
            <CompteTitre />
        </BudgetSelectionContext.Provider>
    );
}

describe('CompteTitre', () => {

    test('affiche libellé, icône et année du compte sélectionné', () => {
        renderTitre(compte);

        expect(screen.getByText('Compte courant')).toBeInTheDocument();
        expect(screen.getByRole('img', { name: 'Compte courant' })).toHaveAttribute('src', '/img/banques/banque.png');
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
});
