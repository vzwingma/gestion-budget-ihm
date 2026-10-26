import { screen } from '@testing-library/react';
import { beforeEach, describe, expect, test, vi } from 'vitest';

import AnalyseOperationItem from './AnalyseOperationItem.component.tsx';
import { buildOperation, renderWithContexts } from '../../budgets/operations/courantes/detail/OperationDetailPage.testutils.tsx';
import { OPERATION_ETATS_ENUM, TYPES_OPERATION_ENUM } from '../../../Utils/AppBusinessEnums.constants.ts';

describe('AnalyseOperationItem', () => {

    beforeEach(() => {
        vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    });

    test('affiche le libellé, la catégorie / sous-catégorie et le montant', () => {
        renderWithContexts(<AnalyseOperationItem operation={buildOperation()} />);

        expect(screen.getByText('Courses Carrefour')).toBeInTheDocument();
        expect(screen.getByText('Alimentation / Courses')).toBeInTheDocument();
        // le montant formaté dépend de la locale : on vérifie le contenu et le style de dépense
        const montant = screen.getByText(/€/);
        expect(montant).toHaveTextContent('50');
        expect(montant).toHaveClass('text-DEPENSE');
    });

    test('opération créditrice : style de crédit', () => {
        renderWithContexts(<AnalyseOperationItem operation={buildOperation({ typeOperation: TYPES_OPERATION_ENUM.CREDIT, valeur: 120 })} />);

        expect(screen.getByText(/€/)).toHaveClass('text-CREDIT');
    });

    test.each([OPERATION_ETATS_ENUM.ANNULEE, OPERATION_ETATS_ENUM.SUPPRIMEE])('opération %s : montant barré (style annulée)', (etat) => {
        renderWithContexts(<AnalyseOperationItem operation={buildOperation({ etat })} />);

        expect(screen.getByText(/€/)).toHaveClass('text-ANNULEE');
    });

    test('sans date d\'opération : aucune date affichée', () => {
        renderWithContexts(<AnalyseOperationItem operation={buildOperation()} />);

        expect(screen.queryByText(/2026/)).not.toBeInTheDocument();
    });

    test('avec date d\'opération : mois et année en français', () => {
        const operation = buildOperation();
        operation.autresInfos.dateOperation = new Date(2026, 2, 15, 12);

        renderWithContexts(<AnalyseOperationItem operation={operation} />);

        expect(screen.getByText('mars 2026')).toBeInTheDocument();
    });

    test('virement interne : le libellé affiche le compte cible (résolu depuis les comptes du contexte)', () => {
        renderWithContexts(<AnalyseOperationItem operation={buildOperation({ libelle: '[vers compte-2] Epargne' })} />);

        expect(screen.getByRole('img', { name: 'Livret A' })).toBeInTheDocument();
        expect(screen.getByText('Epargne')).toBeInTheDocument();
    });
});
