import React from 'react';
import { screen } from '@testing-library/react';
import { afterEach, describe, expect, test, vi } from 'vitest';

import { OperationDetailPage } from './OperationDetailPage.component.tsx';
import { buildBudget, buildCategories, buildOperation, renderWithContexts } from './OperationDetailPage.testutils.tsx';

/**
 * Branche responsive (`isMobile`) de OperationDetailPage : `useMediaQuery(down('lg'))` piloté par `matchMedia`.
 * Les sections sont mockées pour exposer la prop `isMobile` qu'elles reçoivent ; le reste de la page est réel.
 */

vi.mock('./subcomponents/OperationDetailCategoriesSection.component.tsx', () => ({
    OperationDetailCategoriesSection: ({ isMobile }: any) => <div data-testid="section-categories">{String(isMobile)}</div>
}));
vi.mock('./subcomponents/OperationDetailMensualiteSection.component.tsx', () => ({
    OperationDetailMensualiteSection: ({ isMobile }: any) => <div data-testid="section-mensualite">{String(isMobile)}</div>
}));
vi.mock('./subcomponents/OperationDetailEtatSection.component.tsx', () => ({
    OperationDetailEtatSection: ({ isMobile }: any) => <div data-testid="section-etat">{String(isMobile)}</div>
}));
vi.mock('./subcomponents/OperationDetailActionsSection.component.tsx', () => ({
    OperationDetailActionsSection: () => <div data-testid="section-actions" />
}));
vi.mock('./subcomponents/OperationDetailHeader.component.tsx', () => ({
    OperationDetailHeader: () => <div data-testid="header" />
}));
vi.mock('./subcomponents/OperationDetailValeur.component.tsx', () => ({
    OperationDetailValeur: () => <div data-testid="valeur" />
}));
vi.mock('./subcomponents/OperationDetailLibelle.component.tsx', () => ({
    OperationDetailLibelle: () => <div data-testid="libelle" />
}));

function stubMatchMedia(matches: boolean) {
    vi.stubGlobal('matchMedia', (query: string) => ({
        matches, media: query, onchange: null,
        addEventListener: vi.fn(), removeEventListener: vi.fn(), addListener: vi.fn(), removeListener: vi.fn(), dispatchEvent: vi.fn()
    }));
}

function renderPage() {
    return renderWithContexts(
        <OperationDetailPage listeCategories={buildCategories()} listeLibellesOperations={[]} onOperationChange={vi.fn()} />,
        { budget: buildBudget(), operation: buildOperation() });
}

describe('OperationDetailPage - responsive', () => {

    afterEach(() => {
        vi.unstubAllGlobals();
    });

    test('écran large : sections rendues avec isMobile=false', () => {
        stubMatchMedia(false);
        renderPage();

        expect(screen.getByTestId('section-categories')).toHaveTextContent('false');
        expect(screen.getByTestId('section-mensualite')).toHaveTextContent('false');
        expect(screen.getByTestId('section-etat')).toHaveTextContent('false');
    });

    test('mobile : sections rendues avec isMobile=true', () => {
        stubMatchMedia(true);
        renderPage();

        expect(screen.getByTestId('section-categories')).toHaveTextContent('true');
        expect(screen.getByTestId('section-mensualite')).toHaveTextContent('true');
        expect(screen.getByTestId('section-etat')).toHaveTextContent('true');
    });

    test('mobile : padding réduit (15px) ; écran large : padding de 30px', () => {
        stubMatchMedia(true);
        const view = renderPage();
        expect(document.head.textContent).toContain('padding:15px');
        view.unmount();

        stubMatchMedia(false);
        renderPage();
        expect(document.head.textContent).toContain('padding:30px');
    });
});
