import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, test, expect, vi } from 'vitest';
import AnalyseTooltip from './AnalyseTooltip.component.tsx';
import AnalyseEvolutionTooltip from './AnalyseEvolutionTooltip.component.tsx';
import AnalyseSyntheseTooltip from './AnalyseSyntheseTooltip.component.tsx';
import AnalyseTreeMapTooltip from './AnalyseTreeMapTooltip.component.tsx';
import AnalyseTreeMapContent from './AnalyseTreeMapContent.component.tsx';
import { TYPES_CATEGORIES_OPERATION_ENUM } from '../../../Utils/AppBusinessEnums.constants.ts';

describe('AnalyseTooltip (générique)', () => {

    test('ne rend rien si inactif', () => {
        const { container } = render(<AnalyseTooltip active={false} rows={[{ key: 'a', label: 'A', value: '1' }]} />);
        expect(container).toBeEmptyDOMElement();
    });

    test('ne rend rien si aucune ligne', () => {
        const { container } = render(<AnalyseTooltip active={true} rows={[]} />);
        expect(container).toBeEmptyDOMElement();
    });

    test('variant stacked : titre + lignes libellé/valeur', () => {
        render(<AnalyseTooltip active={true} title="Titre" minWidth="200px"
            rows={[{ key: 'a', label: 'LibA', value: '10', color: 'red' }, { key: 'b', label: 'LibB', value: '20' }]} />);

        expect(screen.getByText('Titre')).toBeInTheDocument();
        expect(screen.getByText('LibA')).toBeInTheDocument();
        expect(screen.getByText('10')).toBeInTheDocument();
        expect(screen.getByText('LibB')).toBeInTheDocument();
        expect(screen.getByText('20')).toBeInTheDocument();
    });

    test('variant stacked : pas de séparateur sans title', () => {
        render(<AnalyseTooltip active={true} rows={[{ key: 'a', label: 'LibA', value: '10' }]} />);
        expect(screen.queryByRole('separator')).not.toBeInTheDocument();
    });

    test('variant stacked : séparateur présent avec title', () => {
        render(<AnalyseTooltip active={true} title="T" rows={[{ key: 'a', label: 'LibA', value: '10' }]} />);
        expect(screen.getByRole('separator')).toBeInTheDocument();
    });

    test('variant inline : affiche uniquement la première ligne', () => {
        render(<AnalyseTooltip active={true} variant="inline"
            rows={[{ key: 'a', label: 'Premier', value: 'v1' }, { key: 'b', label: 'Second', value: 'v2' }]} />);

        expect(screen.getByText('Premier')).toBeInTheDocument();
        expect(screen.getByText('v1')).toBeInTheDocument();
        expect(screen.queryByText('Second')).not.toBeInTheDocument();
    });
});

describe('AnalyseEvolutionTooltip', () => {

    test('filtre les valeurs à 0, trie par nom, formate les montants', () => {
        const payload = [
            { dataKey: 'z', name: 'Zeta', value: 5, color: 'blue' },
            { dataKey: 'n', name: 'Nul', value: 0, color: 'grey' },
            { dataKey: 'a', name: 'Alpha', value: -12.5, color: 'red' }
        ];
        render(<AnalyseEvolutionTooltip active={true} payload={payload} label="Janvier" />);

        expect(screen.getByText('Janvier')).toBeInTheDocument();
        expect(screen.queryByText('Nul :')).not.toBeInTheDocument();
        const alpha = screen.getByText('Alpha :');
        const zeta = screen.getByText('Zeta :');
        // Alpha avant Zeta dans le DOM
        expect(alpha.compareDocumentPosition(zeta) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
        expect(screen.getByText(/-12[.,]50/)).toBeInTheDocument();
        expect(screen.getByText(/^\+?5[.,]00/)).toBeInTheDocument();
    });

    test('ne rend rien sans payload ou si toutes les valeurs sont nulles', () => {
        const { container, rerender } = render(<AnalyseEvolutionTooltip active={true} />);
        expect(container).toBeEmptyDOMElement();
        rerender(<AnalyseEvolutionTooltip active={true} payload={[{ dataKey: 'a', name: 'A', value: 0 }]} />);
        expect(container).toBeEmptyDOMElement();
    });

    test('ne rend rien si inactif', () => {
        const { container } = render(<AnalyseEvolutionTooltip active={false} payload={[{ dataKey: 'a', name: 'A', value: 3 }]} />);
        expect(container).toBeEmptyDOMElement();
    });
});

describe('AnalyseSyntheseTooltip', () => {

    test('affiche le libellé du type de catégorie et le pourcentage', () => {
        render(<AnalyseSyntheseTooltip active={true}
            payload={[{ name: TYPES_CATEGORIES_OPERATION_ENUM.ESSENTIEL, value: 42.456 }]} />);

        expect(screen.getByText('Essentiel')).toBeInTheDocument();
        expect(screen.getByText(': 42.46%')).toBeInTheDocument();
    });

    test('type inconnu : libellé N/D', () => {
        render(<AnalyseSyntheseTooltip active={true} payload={[{ name: 'INCONNU', value: 1 }]} />);
        expect(screen.getByText('N/D')).toBeInTheDocument();
    });

    test('ne rend rien sans payload ou payload vide', () => {
        const { container, rerender } = render(<AnalyseSyntheseTooltip active={true} />);
        expect(container).toBeEmptyDOMElement();
        rerender(<AnalyseSyntheseTooltip active={true} payload={[]} />);
        expect(container).toBeEmptyDOMElement();
    });
});

describe('AnalyseTreeMapTooltip', () => {

    test('affiche nom, pourcentage, montant et transactions', () => {
        render(<AnalyseTreeMapTooltip active={true}
            payload={[{ payload: { name: 'Courses', size: 12.345, total: -50, nbTransactions: 7 } }]} />);

        expect(screen.getByText('Courses')).toBeInTheDocument();
        expect(screen.getByText('12.35%')).toBeInTheDocument();
        expect(screen.getByText(/-50[.,]00/)).toBeInTheDocument();
        expect(screen.getByText('7')).toBeInTheDocument();
    });

    test('omet montant et transactions si non définis', () => {
        render(<AnalyseTreeMapTooltip active={true} payload={[{ payload: { name: 'Autre', size: 3 } }]} />);

        expect(screen.getByText('Pourcentage :')).toBeInTheDocument();
        expect(screen.queryByText('Montant :')).not.toBeInTheDocument();
        expect(screen.queryByText('Transactions :')).not.toBeInTheDocument();
    });

    test('ne rend rien sans données', () => {
        const { container, rerender } = render(<AnalyseTreeMapTooltip active={true} />);
        expect(container).toBeEmptyDOMElement();
        rerender(<AnalyseTreeMapTooltip active={true} payload={[]} />);
        expect(container).toBeEmptyDOMElement();
    });
});

describe('AnalyseTreeMapContent', () => {

    function renderContent(props: any) {
        return render(<svg><AnalyseTreeMapContent {...props} /></svg>);
    }

    test('affiche nom et pourcentage si la cellule est assez grande', () => {
        renderContent({ x: 0, y: 0, width: 100, height: 50, name: 'Cat', color: 'red', size: 12.34 });
        expect(screen.getByText('Cat')).toBeInTheDocument();
        expect(screen.getByText('12.3%')).toBeInTheDocument();
    });

    test('masque le texte si la cellule est trop petite', () => {
        renderContent({ width: 50, height: 20, name: 'Cat', size: 5 });
        expect(screen.queryByText('Cat')).not.toBeInTheDocument();
    });

    test('affiche ? si size absent', () => {
        renderContent({ width: 100, height: 50, name: 'Cat' });
        expect(screen.getByText('?%')).toBeInTheDocument();
    });

    test('déclenche onClick au clic sur la cellule', () => {
        const onClick = vi.fn();
        const { container } = renderContent({ width: 100, height: 50, name: 'Cat', onClick });
        // <rect> SVG sans rôle ni testid (code prod non modifiable) : sélection directe inévitable
        // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
        fireEvent.click(container.querySelector('rect')!);
        expect(onClick).toHaveBeenCalledTimes(1);
    });
});
