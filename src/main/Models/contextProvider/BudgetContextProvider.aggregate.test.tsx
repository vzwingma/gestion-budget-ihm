import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, test, expect } from 'vitest';

import {
    BudgetContextProvider,
    useBudgetContext,
    useBudgetSelection,
    useCurrentBudget
} from './BudgetContextProvider.tsx';

/**
 * Agrégat `useBudgetContext()` vs sous-contextes `useBudgetSelection()` / `useCurrentBudget()`
 * (AP 006 - T6 / T20) : l'agrégat doit contenir les 12 champs, avec les mêmes valeurs que les deux moitiés.
 */

const CHAMPS_SELECTION = ['categories', 'comptes', 'selectedCompte', 'selectedDate', 'setCategories', 'setListeComptes', 'setSelectedCompte', 'setSelectedDate'];
const CHAMPS_COURANT = ['currentBudget', 'currentOperation', 'setCurrentBudget', 'setCurrentOperation'];

type Captured = { agregat?: Record<string, unknown>, selection?: Record<string, unknown>, courant?: Record<string, unknown> };

function Capture({ captured }: Readonly<{ captured: Captured }>) {
    captured.agregat = useBudgetContext() as unknown as Record<string, unknown>;
    captured.selection = useBudgetSelection() as unknown as Record<string, unknown>;
    captured.courant = useCurrentBudget() as unknown as Record<string, unknown>;
    return <></>;
}

describe('BudgetContextProvider - agrégat et sous-contextes', () => {

    test('l agrégat expose exactement les 12 champs, identiques à ceux des deux sous-contextes', () => {
        const captured: Captured = {};
        render(<BudgetContextProvider><Capture captured={captured} /></BudgetContextProvider>);

        expect(Object.keys(captured.agregat!).sort()).toEqual([...CHAMPS_SELECTION, ...CHAMPS_COURANT].sort());
        expect(Object.keys(captured.selection!).sort()).toEqual(CHAMPS_SELECTION);
        expect(Object.keys(captured.courant!).sort()).toEqual(CHAMPS_COURANT);
        for (const champ of CHAMPS_SELECTION) {
            expect(captured.agregat![champ], 'champ sélection ' + champ).toBe(captured.selection![champ]);
        }
        for (const champ of CHAMPS_COURANT) {
            expect(captured.agregat![champ], 'champ budget courant ' + champ).toBe(captured.courant![champ]);
        }
    });

    test('valeurs initiales : date = 1er du mois courant, listes vides, ni budget ni opération', () => {
        const captured: Captured = {};
        render(<BudgetContextProvider><Capture captured={captured} /></BudgetContextProvider>);

        const maintenant = new Date();
        expect(captured.agregat!.selectedDate).toEqual(new Date(maintenant.getFullYear(), maintenant.getMonth(), 1, 0, 0, 0));
        expect(captured.agregat!.comptes).toEqual([]);
        expect(captured.agregat!.categories).toEqual([]);
        expect(captured.agregat!.currentBudget).toBeUndefined();
        expect(captured.agregat!.currentOperation).toBeNull();
        expect(captured.agregat!.selectedCompte).toBeNull();
    });

    test('une mise à jour via l agrégat est visible dans le sous-contexte correspondant', async () => {
        const user = userEvent.setup();
        const captured: Captured = {};
        function Probe() {
            const { setSelectedCompte } = useBudgetContext();
            captured.selection = useBudgetSelection() as unknown as Record<string, unknown>;
            return <button data-testid="pick" onClick={() => setSelectedCompte({ id: 'c9' } as never)} />;
        }
        render(<BudgetContextProvider><Probe /></BudgetContextProvider>);

        await user.click(screen.getByTestId('pick'));

        expect((captured.selection!.selectedCompte as { id: string }).id).toBe('c9');
    });
});
