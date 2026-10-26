import React from 'react';
import {describe, expect, test, vi} from 'vitest';
import {render, screen, within} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import BudgetPageHeader, {HEADER_FILTER_SIZE, HEADER_MENU_SIZE} from './BudgetPageHeader.component.tsx';

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

    test('tailles de colonnes exportées : menu et champ de filtre', () => {
        expect(HEADER_MENU_SIZE).toEqual({md: 0.6, xl: 0.4});
        expect(HEADER_FILTER_SIZE).toEqual({md: 2.8, xl: 2});
    });

    test('filterBar rendu directement (cellules fournies par la barre), sans wrapper intermédiaire', () => {
        renderHeader({filterBar: <><div data-testid="c1"/><div data-testid="c2"/></>});
        const c1 = screen.getByTestId('c1');
        const c2 = screen.getByTestId('c2');
        // eslint-disable-next-line testing-library/no-node-access
        expect(c1.parentElement).toBe(c2.parentElement);
        // frère direct du spacer menu : le parent est le Grid container de l'en-tête
        // eslint-disable-next-line testing-library/no-node-access
        const ligne = c1.parentElement as HTMLElement;
        expect(within(ligne).getByLabelText('Filtrage des opérations')).toBeInTheDocument();
    });

    test('filterBar : un spacer (cellule vide) précède les cellules de la barre', () => {
        renderHeader({filterBar: <div data-testid="c1"/>});
        // eslint-disable-next-line testing-library/no-node-access
        const spacer = screen.getByTestId('c1').previousElementSibling as HTMLElement;
        expect(spacer).toBeEmptyDOMElement();
    });
});
