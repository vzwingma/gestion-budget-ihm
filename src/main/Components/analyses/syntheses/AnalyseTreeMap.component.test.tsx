import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, test, expect, vi } from 'vitest';

import AnalyseTreeMap from './AnalyseTreeMap.component.tsx';

/**
 * Tests du composant AnalyseTreeMap après extraction de TreemapContentRenderer
 * hors du composant parent (issue SonarCloud S6478 - composant défini en ligne).
 *
 * `recharts` est mocké : Treemap invoque directement la prop `content` pour chaque
 * donnée, ce qui permet de vérifier que TreemapContentRenderer transmet correctement
 * selectedCategory / onCategoryClick sans dépendre du calcul de layout réel de recharts
 * (non pertinent en environnement jsdom).
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
                ss1: { ssCategorie: { libelle: 'SousCat 1' }, pourcentage: 60, total: 6, nbTransactions: 1 }
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

describe('AnalyseTreeMap', () => {

    test('affiche NoDataComponent quand pas de données', () => {
        render(<AnalyseTreeMap analyseCategories={[]} selectedCategories={[]} setFilters={vi.fn()} />);
        expect(screen.queryByTestId('treemap')).not.toBeInTheDocument();
    });

    test('rend une cellule par catégorie avec onClick actif quand aucune sélection', () => {
        render(<AnalyseTreeMap analyseCategories={buildAnalyseCategories()} selectedCategories={[]} setFilters={vi.fn()} />);

        const cellC1 = screen.getByTestId('cell-c1');
        const cellC2 = screen.getByTestId('cell-c2');
        expect(cellC1).toBeEnabled();
        expect(cellC2).toBeEnabled();
    });

    test('clic sur une cellule déclenche setFilters avec la catégorie sélectionnée', async () => {
        const user = userEvent.setup();
        const setFilters = vi.fn();
        render(<AnalyseTreeMap analyseCategories={buildAnalyseCategories()} selectedCategories={[]} setFilters={setFilters} />);

        await user.click(screen.getByTestId('cell-c1'));

        expect(setFilters).toHaveBeenCalledTimes(1);
        const updater = setFilters.mock.calls[0][0];
        const result = updater({ someOtherFilter: 'x' });
        expect(result).toEqual({ someOtherFilter: 'x', selectedCategories: [{ id: 'c1', libelle: 'Cat 1' }] });
    });

    test('vue drill-down (catégorie sélectionnée) : cellules des sous-catégories désactivées', () => {
        render(
            <AnalyseTreeMap
                analyseCategories={buildAnalyseCategories()}
                selectedCategories={[{ id: 'c1', libelle: 'Cat 1' } as any]}
                setFilters={vi.fn()}
            />
        );

        // Vue drill-down : sous-catégorie de c1 affichée, sans catégorie parente cliquable
        const cell = screen.getByTestId('cell-SousCat 1');
        expect(cell).toBeDisabled();
    });
});
