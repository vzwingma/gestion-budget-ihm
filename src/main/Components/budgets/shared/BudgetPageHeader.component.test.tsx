import React from 'react';
import {describe, expect, test, vi} from 'vitest';
import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import BudgetPageHeader from './BudgetPageHeader.component.tsx';

/** AP 005 - Phase 4 (T4.6) : prop optionnelle `filterBar` de l'en-tête de page */
const renderHeader = (extra: object = {}) => {
    const onFilterChange = vi.fn();
    render(<BudgetPageHeader onOpenMenu={vi.fn()} filterOperations="abc" onFilterChange={onFilterChange}
                             selectedCompte={null} selectedDate={null} {...extra}/>);
    return {onFilterChange};
};

describe('BudgetPageHeader', () => {
    test('sans filterBar : champ de filtre présent, rien d autre', () => {
        renderHeader();
        expect(screen.getByLabelText('Filtrage des opérations')).toHaveValue('abc');
        expect(screen.queryByTestId('barre')).not.toBeInTheDocument();
    });

    test('avec filterBar : la barre est rendue', () => {
        renderHeader({filterBar: <div data-testid="barre">barre</div>});
        expect(screen.getByTestId('barre')).toHaveTextContent('barre');
        expect(screen.getByLabelText('Filtrage des opérations')).toBeInTheDocument();
    });

    test('la croix ⊗ du filtre texte (Phase 1) fonctionne toujours : vide le champ et refocus', async () => {
        const {onFilterChange} = renderHeader({filterBar: <div data-testid="barre"/>});
        await userEvent.click(screen.getByRole('button', {name: 'Effacer le filtre'}));
        expect(onFilterChange).toHaveBeenCalledWith('');
        expect(screen.getByLabelText('Filtrage des opérations')).toHaveFocus();
    });
});
