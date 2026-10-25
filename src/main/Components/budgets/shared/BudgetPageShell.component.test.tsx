import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import BudgetPageShell from './BudgetPageShell.component.tsx';

// Header mocké : on vérifie uniquement la transmission des props (le header a sa propre responsabilité)
const headerProps = vi.fn();
vi.mock('./BudgetPageHeader.component.tsx', () => ({
    default: (props: any) => {
        headerProps(props);
        return <div data-testid="mock-header">{props.additionalHeaderContentLeft}{props.additionalHeaderContentRight}</div>;
    }
}));

function renderShell(overrides: any = {}) {
    const props = {
        className: 'page-test',
        isLoading: false,
        onOpenMenu: vi.fn(),
        filterOperations: 'abc',
        onFilterChange: vi.fn(),
        selectedCompte: null,
        selectedDate: new Date(2026, 0, 1),
        filterPlaceholder: 'Filtrer',
        leftColumnSize: { md: 6, xl: 6 },
        rightColumnSize: { md: 6, xl: 6 },
        leftContent: <div data-testid="left">gauche</div>,
        rightContent: <div data-testid="right">droite</div>,
        ...overrides
    };
    const utils = render(<BudgetPageShell {...props} />);
    return { props, ...utils };
}

describe('BudgetPageShell', () => {

    beforeEach(() => {
        vi.clearAllMocks();
    });

    test('affiche les contenus des 2 colonnes et applique la className', () => {
        const { container } = renderShell();

        expect(screen.getByTestId('left')).toHaveTextContent('gauche');
        expect(screen.getByTestId('right')).toHaveTextContent('droite');
        // Racine Box sans rôle ni testid (code prod non modifiable) : sélection par classe inévitable
        // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
        expect(container.querySelector('.page-test')).toBeInTheDocument();
        expect(screen.getByTestId('mock-header')).toBeInTheDocument();
    });

    test('transmet les props au header', () => {
        const { props } = renderShell({
            additionalHeaderContentLeft: <span>extra-gauche</span>,
            additionalHeaderContentRight: <span>extra-droite</span>
        });

        expect(headerProps).toHaveBeenCalledWith(expect.objectContaining({
            onOpenMenu: props.onOpenMenu,
            filterOperations: 'abc',
            onFilterChange: props.onFilterChange,
            selectedCompte: null,
            selectedDate: props.selectedDate,
            filterPlaceholder: 'Filtrer'
        }));
        expect(screen.getByText('extra-gauche')).toBeInTheDocument();
        expect(screen.getByText('extra-droite')).toBeInTheDocument();
    });

    test('affiche le spinner de chargement quand isLoading=true', () => {
        renderShell({ isLoading: true });
        expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });

    test('masque le spinner quand isLoading=false', () => {
        renderShell({ isLoading: false });
        expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    });

    test('transmet filterBar au header (AP 005 - Phase 4) ; absent par défaut', () => {
        renderShell();
        expect(headerProps.mock.calls[0][0].filterBar).toBeUndefined();

        headerProps.mockClear();
        const barre = <span>barre</span>;
        renderShell({ filterBar: barre });
        expect(headerProps.mock.calls.at(-1)?.[0].filterBar).toBe(barre);
    });

    describe('hauteur de la colonne droite', () => {
        beforeEach(() => {
            vi.stubGlobal('innerHeight', 1000);
        });
        afterEach(() => {
            vi.unstubAllGlobals();
        });

        // Grid sans rôle ni testid : la hauteur est vérifiée via la règle emotion injectée dans <head>
        test('sans filterBar : innerHeight - 140 (inchangé)', () => {
            renderShell();
            expect(document.head.textContent).toContain('height:860px');
            expect(document.head.textContent).not.toContain('height:812px');
        });

        test('avec filterBar : réduite de FILTER_BAR_HEIGHT (48 px)', () => {
            renderShell({ filterBar: <span>barre</span> });
            expect(document.head.textContent).toContain('height:812px');
        });
    });
});
