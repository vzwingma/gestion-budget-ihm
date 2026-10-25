import React from 'react';
import { renderHook } from '@testing-library/react';
import { describe, test, expect, vi } from 'vitest';
import { BudgetContext, useBudgetContext } from './useBudgetContext.ts';
import * as Provider from '../Models/contextProvider/BudgetContextProvider.tsx';

describe('useBudgetContext', () => {

    test('lève une erreur hors provider', () => {
        // React logge l'erreur du render en console.error : on la neutralise pour ce test
        const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
        expect(() => renderHook(() => useBudgetContext())).toThrow('useBudgetContext doit être utilisé dans un BudgetContextProvider');
        spy.mockRestore();
    });

    test('retourne la valeur du contexte dans un provider', () => {
        const value: any = { comptes: [], selectedDate: new Date(2026, 0, 1) };
        const wrapper = ({ children }: any) => <BudgetContext.Provider value={value}>{children}</BudgetContext.Provider>;
        const { result } = renderHook(() => useBudgetContext(), { wrapper });
        expect(result.current).toBe(value);
    });

    test('BudgetContextProvider ré-exporte le même contexte et le même hook', () => {
        expect(Provider.BudgetContext).toBe(BudgetContext);
        expect(Provider.useBudgetContext).toBe(useBudgetContext);
    });
});
