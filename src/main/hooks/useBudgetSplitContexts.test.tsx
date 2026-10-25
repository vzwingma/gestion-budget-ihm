import React from 'react';
import { act, render, renderHook, screen } from '@testing-library/react';
import { describe, test, expect, vi } from 'vitest';
import {
    BudgetContext,
    BudgetSelectionContext,
    CurrentBudgetContext,
    useBudgetSelection,
    useCurrentBudget
} from './useBudgetContext.ts';
import { BudgetContextProvider } from '../Models/contextProvider/BudgetContextProvider.tsx';

/**
 * Tests de la scission du contexte budget (AP 006 - T6 / T20) :
 * hooks ciblés `useBudgetSelection()` / `useCurrentBudget()` et isolation des re-renders.
 */

describe('useBudgetSelection / useCurrentBudget', () => {

    test('useBudgetSelection lève une erreur hors provider', () => {
        // React logge l'erreur du render en console.error : neutralisée pour ce test
        const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
        expect(() => renderHook(() => useBudgetSelection())).toThrow('useBudgetSelection doit être utilisé dans un BudgetContextProvider');
        spy.mockRestore();
    });

    test('useCurrentBudget lève une erreur hors provider', () => {
        const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
        expect(() => renderHook(() => useCurrentBudget())).toThrow('useCurrentBudget doit être utilisé dans un BudgetContextProvider');
        spy.mockRestore();
    });

    test('useBudgetSelection retourne la valeur de BudgetSelectionContext', () => {
        const value = { comptes: [], categories: [] } as never;
        const wrapper = ({ children }: { children: React.ReactNode }) =>
            <BudgetSelectionContext.Provider value={value}>{children}</BudgetSelectionContext.Provider>;
        const { result: hook } = renderHook(() => useBudgetSelection(), { wrapper });
        expect(hook.current).toBe(value);
    });

    test('useCurrentBudget retourne la valeur de CurrentBudgetContext', () => {
        const value = { currentBudget: undefined, currentOperation: null } as never;
        const wrapper = ({ children }: { children: React.ReactNode }) =>
            <CurrentBudgetContext.Provider value={value}>{children}</CurrentBudgetContext.Provider>;
        const { result: hook } = renderHook(() => useCurrentBudget(), { wrapper });
        expect(hook.current).toBe(value);
    });

    test('les hooks ciblés ne lisent pas l agrégat BudgetContext', () => {
        const wrapper = ({ children }: { children: React.ReactNode }) =>
            <BudgetContext.Provider value={{ comptes: [] } as never}>{children}</BudgetContext.Provider>;
        const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
        expect(() => renderHook(() => useBudgetSelection(), { wrapper })).toThrow();
        expect(() => renderHook(() => useCurrentBudget(), { wrapper })).toThrow();
        spy.mockRestore();
    });
});

describe('isolation des re-renders (AP 006 T6)', () => {

    // Compteurs de rendu : incrémentés à chaque render du consommateur concerné
    const renders = { selection: 0, current: 0 };
    // Setters capturés pendant le render des consommateurs (stables, fournis par useState)
    const api: Record<string, (value: unknown) => void> = {};

    function SelectionConsumer() {
        const { selectedCompte, setSelectedCompte, setCategories } = useBudgetSelection();
        renders.selection++;
        api.setSelectedCompte = setSelectedCompte as (value: unknown) => void;
        api.setCategories = setCategories as (value: unknown) => void;
        return <span data-testid="sel">{selectedCompte ? selectedCompte.id : 'none'}</span>;
    }

    function CurrentConsumer() {
        const { currentBudget, setCurrentBudget, setCurrentOperation } = useCurrentBudget();
        renders.current++;
        api.setCurrentBudget = setCurrentBudget as (value: unknown) => void;
        api.setCurrentOperation = setCurrentOperation as (value: unknown) => void;
        return <span data-testid="cur">{currentBudget ? currentBudget.id : 'none'}</span>;
    }

    function renderTree() {
        renders.selection = 0;
        renders.current = 0;
        // Éléments enfants créés une seule fois : seul un changement de contexte peut les re-render
        render(
            <BudgetContextProvider>
                <SelectionConsumer />
                <CurrentConsumer />
            </BudgetContextProvider>
        );
    }

    test('changer le budget courant ne re-render pas le consommateur de la sélection', () => {
        renderTree();
        const selectionAvant = renders.selection;
        const currentAvant = renders.current;

        act(() => api.setCurrentBudget({ id: 'b1' }));

        expect(screen.getByTestId('cur')).toHaveTextContent('b1');
        expect(renders.current).toBeGreaterThan(currentAvant);
        expect(renders.selection).toBe(selectionAvant);
    });

    test('changer l opération courante ne re-render pas le consommateur de la sélection', () => {
        renderTree();
        const selectionAvant = renders.selection;

        act(() => api.setCurrentOperation({ id: 'op1' }));

        expect(renders.selection).toBe(selectionAvant);
    });

    test('changer le compte sélectionné ne re-render pas le consommateur du budget courant', () => {
        renderTree();
        const selectionAvant = renders.selection;
        const currentAvant = renders.current;

        act(() => api.setSelectedCompte({ id: 'c1', libelle: 'C1' }));

        expect(screen.getByTestId('sel')).toHaveTextContent('c1');
        expect(renders.selection).toBeGreaterThan(selectionAvant);
        expect(renders.current).toBe(currentAvant);
    });

    test('changer les catégories ne re-render pas le consommateur du budget courant', () => {
        renderTree();
        const currentAvant = renders.current;

        act(() => api.setCategories([{ id: 'cat1' }]));

        expect(renders.current).toBe(currentAvant);
    });
});
