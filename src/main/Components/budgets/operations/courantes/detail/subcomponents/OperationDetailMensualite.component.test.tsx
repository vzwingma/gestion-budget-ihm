import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, test, vi } from 'vitest';

import { OperationDetailMensualite } from './OperationDetailMensualite.component.tsx';
import { buildBudget, buildOperation, renderWithContexts } from '../OperationDetailPage.testutils.tsx';
import { PERIODES_MENSUALITE_ENUM } from '../../../../../../Utils/AppBusinessEnums.constants.ts';

describe('OperationDetailMensualite', () => {

    const fill = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    test('budget absent ou opération absente : rien n\'est rendu', () => {
        renderWithContexts(<OperationDetailMensualite formMensualiteInEdition={false} fillOperationForm={fill} />, { budget: undefined });
        expect(screen.queryByText('Ponctuelle')).not.toBeInTheDocument();
    });

    test('opération absente : rien n\'est rendu', () => {
        renderWithContexts(<OperationDetailMensualite formMensualiteInEdition={true} fillOperationForm={fill} />, { operation: null });
        expect(screen.queryByRole('combobox')).not.toBeInTheDocument();
    });

    test.each([
        [PERIODES_MENSUALITE_ENUM.PONCTUELLE, 'Ponctuelle'],
        [PERIODES_MENSUALITE_ENUM.MENSUELLE, 'Mensuelle'],
        [PERIODES_MENSUALITE_ENUM.TRIMESTRIELLE, 'Trimestrielle'],
        [PERIODES_MENSUALITE_ENUM.SEMESTRIELLE, 'Semestrielle'],
        [PERIODES_MENSUALITE_ENUM.ANNUELLE, 'Annuelle']
    ])('lecture : période %s affichée "%s", éditable', (periode, texte) => {
        renderWithContexts(<OperationDetailMensualite formMensualiteInEdition={false} fillOperationForm={fill} />,
            { operation: buildOperation({ mensualite: { periode, prochaineEcheance: 1 } }) });

        const element = screen.getByText(texte);
        expect(element).toHaveClass('editableField');
        expect(element).toHaveAttribute('id', 'OPERATION_MENSUALITE');
    });

    test('lecture sur budget clos : marquée désactivée', () => {
        renderWithContexts(<OperationDetailMensualite formMensualiteInEdition={false} fillOperationForm={fill} />, { budget: buildBudget(false) });

        expect(screen.getByText('Ponctuelle')).toHaveClass('editableField--disabled');
    });

    test('édition : le sélecteur affiche la période de l\'opération et propose toutes les périodes', async () => {
        const user = userEvent.setup();
        renderWithContexts(<OperationDetailMensualite formMensualiteInEdition={true} fillOperationForm={fill} />,
            { operation: buildOperation({ mensualite: { periode: PERIODES_MENSUALITE_ENUM.ANNUELLE, prochaineEcheance: 1 } }) });

        expect(screen.getByRole('combobox')).toHaveTextContent('Annuelle');
        await user.click(screen.getByRole('combobox'));

        expect(await screen.findAllByRole('option')).toHaveLength(Object.values(PERIODES_MENSUALITE_ENUM).length);
    });

    test('édition : choisir une période appelle fillOperationForm(OPERATION_MENSUALITE, valeur de l\'enum)', async () => {
        const user = userEvent.setup();
        renderWithContexts(<OperationDetailMensualite formMensualiteInEdition={true} fillOperationForm={fill} />);

        await user.click(screen.getByRole('combobox'));
        await user.click(await screen.findByRole('option', { name: 'Trimestrielle' }));

        expect(fill).toHaveBeenCalledWith('OPERATION_MENSUALITE', PERIODES_MENSUALITE_ENUM.TRIMESTRIELLE);
    });

    test('édition : le focus désactive la validation clavier, la perte de focus la réactive', async () => {
        const user = userEvent.setup();
        renderWithContexts(<OperationDetailMensualite formMensualiteInEdition={true} fillOperationForm={fill} />);

        await user.click(screen.getByRole('combobox'));
        expect(fill).toHaveBeenCalledWith('FORM_VALIDATION', 'false');
        await user.keyboard('{Escape}');
        await user.tab();

        expect(fill).toHaveBeenCalledWith('FORM_VALIDATION', 'true');
    });
});
