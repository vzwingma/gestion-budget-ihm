import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, test, expect } from 'vitest';

import { BudgetContextProvider, useBudgetContext } from './BudgetContextProvider.tsx';

/**
 * Tests de rendu de BudgetContextProvider (filet de sécurité AP 006 - T19, posé avant T6 :
 * scission éventuelle du contexte en contextes plus fins).
 *
 * Un composant de test consomme le contexte via `useBudgetContext` et expose les valeurs
 * courantes + des boutons déclenchant les setters, afin de vérifier :
 * - les valeurs par défaut exposées au premier rendu,
 * - la propagation d'une mise à jour d'état aux consommateurs,
 * - le lever d'erreur si utilisé hors provider.
 */

function ContextConsumer() {
    const { currentBudget, selectedCompte, comptes, setSelectedCompte, setListeComptes } = useBudgetContext();
    return (
        <div>
            <span data-testid="current-budget">{currentBudget ? currentBudget.id : 'none'}</span>
            <span data-testid="selected-compte">{selectedCompte ? selectedCompte.id : 'none'}</span>
            <span data-testid="comptes-count">{comptes.length}</span>
            <button data-testid="select-compte" onClick={() => setSelectedCompte({ id: 'compte-1', libelle: 'Compte 1' } as any)} />
            <button data-testid="load-comptes" onClick={() => setListeComptes([{ id: 'c1' } as any, { id: 'c2' } as any])} />
        </div>
    );
}

function ThrowingConsumer() {
    useBudgetContext();
    return <></>;
}

describe('BudgetContextProvider', () => {

    test('expose des valeurs par défaut au premier rendu', () => {
        render(
            <BudgetContextProvider>
                <ContextConsumer />
            </BudgetContextProvider>
        );

        expect(screen.getByTestId('current-budget')).toHaveTextContent('none');
        expect(screen.getByTestId('selected-compte')).toHaveTextContent('none');
        expect(screen.getByTestId('comptes-count')).toHaveTextContent('0');
    });

    test('propage la mise à jour du compte sélectionné au consommateur', async () => {
        const user = userEvent.setup();
        render(
            <BudgetContextProvider>
                <ContextConsumer />
            </BudgetContextProvider>
        );

        await user.click(screen.getByTestId('select-compte'));

        expect(screen.getByTestId('selected-compte')).toHaveTextContent('compte-1');
    });

    test('propage la mise à jour de la liste des comptes au consommateur', async () => {
        const user = userEvent.setup();
        render(
            <BudgetContextProvider>
                <ContextConsumer />
            </BudgetContextProvider>
        );

        await user.click(screen.getByTestId('load-comptes'));

        expect(screen.getByTestId('comptes-count')).toHaveTextContent('2');
    });

    test('useBudgetContext lève une erreur hors provider', () => {
        expect(() => render(<ThrowingConsumer />)).toThrow('useBudgetContext doit être utilisé dans un BudgetContextProvider');
    });
});
