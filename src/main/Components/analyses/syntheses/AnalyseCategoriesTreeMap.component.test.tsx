import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, test, expect, vi } from 'vitest';

import AnalyseCategoriesTreeMap from './AnalyseCategoriesTreeMap.component.tsx';

/**
 * Tests du composant AnalyseCategoriesTreeMap après extraction de TreemapContentRenderer
 * hors du composant parent (issue SonarCloud S6478 - composant défini en ligne).
 *
 * `recharts` est mocké : Treemap invoque directement la prop `content` pour chaque
 * donnée, ce qui permet de vérifier drill-down (sélection de catégorie) et retour
 * arrière sans dépendre du calcul de layout réel de recharts (non pertinent en jsdom).
 */
vi.mock('recharts', () => ({
    ResponsiveContainer: ({ children }: any) => <div>{children}</div>,
    Treemap: ({ content, data }: any) => (
        <div data-testid="treemap">
            {data.map((d: any) => (
                <div key={d.categoryId ?? d.name}>
                    {content({ ...d, x: 0, y: 0, width: 200, height: 200 })}
                </div>
            ))}
        </div>
    ),
    Tooltip: () => null
}));

vi.mock('./AnalyseTreeMapContent.component.tsx', () => ({
    default: ({ categoryId, name, onClick }: any) => (
        <button data-testid={`cell-${categoryId ?? name}`} onClick={onClick} disabled={!onClick}>
            {name}
        </button>
    )
}));

vi.mock('./AnalyseTreeMapTooltip.component.tsx', () => ({
    default: () => null
}));

function buildAnalyseCategories() {
    return [
        {
            categorie: { id: 'c1', libelle: 'Cat 1' },
            pourcentage: 70,
            couleurCategorie: '#ff0000',
            total: 10,
            nbTransactions: 1,
            resumesSsCategories: {
                ss1: { ssCategorie: { libelle: 'SousCat 1' }, pourcentage: 60, couleurSsCategorie: '#f00', total: 6, nbTransactions: 1 }
            }
        },
        {
            categorie: { id: 'c2', libelle: 'Cat 2' },
            pourcentage: 30,
            couleurCategorie: '#00ff00',
            total: 5,
            nbTransactions: 2,
            resumesSsCategories: {}
        }
    ] as any[];
}

describe('AnalyseCategoriesTreeMap', () => {

    test('affiche NoDataComponent quand pas de données', () => {
        render(<AnalyseCategoriesTreeMap analyseCategories={[]} />);
        expect(screen.queryByTestId('treemap')).not.toBeInTheDocument();
    });

    test('vue globale : une cellule par catégorie, cliquable', () => {
        render(<AnalyseCategoriesTreeMap analyseCategories={buildAnalyseCategories()} />);

        expect(screen.getByTestId('cell-c1')).toBeEnabled();
        expect(screen.getByTestId('cell-c2')).toBeEnabled();
    });

    test('clic sur une cellule fait drill-down sur ses sous-catégories', async () => {
        const user = userEvent.setup();
        render(<AnalyseCategoriesTreeMap analyseCategories={buildAnalyseCategories()} />);

        await user.click(screen.getByTestId('cell-c1'));

        // Vue drill-down : sous-catégorie de c1 affichée
        expect(screen.getByTestId('cell-SousCat 1')).toBeInTheDocument();
        expect(screen.queryByTestId('cell-c2')).not.toBeInTheDocument();
    });

    test('drill-down : cellules des sous-catégories non cliquables (pas de re-drill)', async () => {
        const user = userEvent.setup();
        render(<AnalyseCategoriesTreeMap analyseCategories={buildAnalyseCategories()} />);

        await user.click(screen.getByTestId('cell-c1'));

        expect(screen.getByTestId('cell-SousCat 1')).toBeDisabled();
    });

    test('retour arrière (breadcrumb Home) réaffiche la vue globale', async () => {
        const user = userEvent.setup();
        render(<AnalyseCategoriesTreeMap analyseCategories={buildAnalyseCategories()} />);

        await user.click(screen.getByTestId('cell-c1'));
        expect(screen.getByTestId('cell-SousCat 1')).toBeInTheDocument();

        await user.click(screen.getByTestId('HomeIcon'));

        expect(screen.getByTestId('cell-c1')).toBeInTheDocument();
        expect(screen.getByTestId('cell-c2')).toBeInTheDocument();
    });
});
