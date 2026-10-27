import React from 'react';
import {
    BudgetContext,
    BudgetSelectionContext,
    CurrentBudgetContext
} from '../Models/contextProvider/BudgetContextProvider.tsx';

/**
 * Fournit les 3 contextes (agrégat + sélection + budget courant) à partir d'une même valeur,
 * pour que les spies `vi.fn()` du test soient ceux lus par `useBudgetSelection()` / `useCurrentBudget()`.
 */
export function BudgetContextsWrapper({ value, children }: Readonly<{ value: any; children: React.ReactNode }>) {
    return (
        <BudgetSelectionContext.Provider value={value}>
            <CurrentBudgetContext.Provider value={value}>
                <BudgetContext.Provider value={value}>
                    {children}
                </BudgetContext.Provider>
            </CurrentBudgetContext.Provider>
        </BudgetSelectionContext.Provider>
    );
}
