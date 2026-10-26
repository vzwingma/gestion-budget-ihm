import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, test, vi } from 'vitest';

import { OperationDetailActionsSection } from './OperationDetailActionsSection.component.tsx';
import { buildBudget, buildOperation, renderWithContexts } from '../OperationDetailPage.testutils.tsx';
import { createEmptyEditForm } from '../OperationDetailPage.constants.ts';
import { cloneOperation } from '../../../../../../Models/budgets/OperationEdition.model.ts';
import { OPERATION_ETATS_ENUM } from '../../../../../../Utils/AppBusinessEnums.constants.ts';

vi.mock('../OperationDetailPage.extservices.ts', () => ({ saveOperation: vi.fn() }));

describe('OperationDetailActionsSection', () => {

    const onValidate = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    function rendre(contexte: Parameters<typeof renderWithContexts>[1] = {}, editForm = createEmptyEditForm(false)) {
        const operation = contexte.operation ?? buildOperation();
        return renderWithContexts(
            <OperationDetailActionsSection editForm={editForm} editOperation={cloneOperation(operation)}
                onClickRealiseInCreateMode={vi.fn()} onOperationChange={vi.fn()} onOperationCommit={vi.fn()} onValidate={onValidate} />, contexte);
    }

    test('budget actif, lecture : libellé Actions et boutons d\'action, pas de bouton Valider', () => {
        rendre();

        expect(screen.getByText('Actions')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Valider l\'opération' })).toBeInTheDocument();
        expect(screen.queryByRole('button', { name: 'Valider' })).not.toBeInTheDocument();
    });

    test('budget clos : ni actions ni bouton Valider', () => {
        rendre({ budget: buildBudget(false) }, { ...createEmptyEditForm(false), libelle: true });

        expect(screen.queryByText('Actions')).not.toBeInTheDocument();
        expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });

    test('opération supprimée : plus aucune action sur l\'état', () => {
        rendre({ operation: buildOperation({ etat: OPERATION_ETATS_ENUM.SUPPRIMEE }) });

        expect(screen.getByText('Actions')).toBeInTheDocument();
        expect(screen.queryByRole('button', { name: 'Prévoir l\'opération' })).not.toBeInTheDocument();
    });

    test('champ ouvert : le bouton Valider déclenche onValidate', async () => {
        const user = userEvent.setup();
        rendre({}, { ...createEmptyEditForm(false), libelle: true });

        await user.click(screen.getByRole('button', { name: 'Valider' }));

        expect(onValidate).toHaveBeenCalledTimes(1);
    });

    test('création : pas d\'action Annuler / Supprimer, bouton Valider présent', () => {
        rendre({}, createEmptyEditForm(true));

        expect(screen.queryByRole('button', { name: 'Supprimer l\'opération' })).not.toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Valider' })).toBeInTheDocument();
    });
});
