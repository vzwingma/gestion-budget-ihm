import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, type Mock, test, vi } from 'vitest';

import { OperationDetailActions } from './OperationDetailActions.component.tsx';
import { saveOperation } from '../OperationDetailPage.extservices.ts';
import { buildBudget, buildOperation, renderWithContexts } from '../OperationDetailPage.testutils.tsx';
import { cloneOperation } from '../../../../../../Models/budgets/OperationEdition.model.ts';
import { OPERATION_ETATS_ENUM } from '../../../../../../Utils/AppBusinessEnums.constants.ts';

vi.mock('../OperationDetailPage.extservices.ts', () => ({ saveOperation: vi.fn() }));

describe('OperationDetailActions - composant', () => {

    const onOperationChange = vi.fn();
    const onOperationCommit = vi.fn();
    const onClickRealise = vi.fn();

    function rendre(contexte: Parameters<typeof renderWithContexts>[1] = {}, enCreation = false) {
        const operation = contexte.operation ?? buildOperation();
        return renderWithContexts(
            <OperationDetailActions isInCreateMode={enCreation} editOperation={cloneOperation(operation)}
                onClickRealiseInCreateMode={onClickRealise} onOperationChange={onOperationChange}
                onOperationCommit={onOperationCommit} />, contexte);
    }

    const actionsVisibles = () => screen.queryAllByRole('button').map((bouton) => bouton.getAttribute('aria-label'));

    beforeEach(() => {
        vi.clearAllMocks();
        vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    });

    test('budget ou opération absents : rien n\'est rendu', () => {
        rendre({ budget: undefined });
        expect(screen.queryByRole('group')).not.toBeInTheDocument();
    });

    test.each([
        [OPERATION_ETATS_ENUM.PREVUE, ['Valider l\'opération', 'Reporter l\'opération', 'Annuler l\'opération', 'Supprimer l\'opération']],
        [OPERATION_ETATS_ENUM.REALISEE, ['Prévoir l\'opération', 'Reporter l\'opération', 'Annuler l\'opération', 'Supprimer l\'opération']],
        [OPERATION_ETATS_ENUM.REPORTEE, ['Valider l\'opération', 'Prévoir l\'opération', 'Annuler l\'opération', 'Supprimer l\'opération']],
        [OPERATION_ETATS_ENUM.ANNULEE, ['Valider l\'opération', 'Prévoir l\'opération', 'Reporter l\'opération', 'Supprimer l\'opération']],
        [OPERATION_ETATS_ENUM.SUPPRIMEE, ['Valider l\'opération', 'Prévoir l\'opération', 'Reporter l\'opération', 'Annuler l\'opération']]
    ])('édition, opération %s : actions proposées = toutes sauf l\'état courant', (etat, attendues) => {
        rendre({ operation: buildOperation({ etat }) });

        expect(actionsVisibles()).toEqual(attendues);
    });

    test('création : pas d\'action Annuler ni Supprimer', () => {
        rendre({}, true);

        expect(actionsVisibles()).toEqual(['Valider l\'opération', 'Reporter l\'opération']);
    });

    test('édition : Valider l\'opération -> saveOperation(copie REALISEE), opération du contexte inchangée', async () => {
        const user = userEvent.setup();
        const operation = buildOperation();
        const budget = buildBudget();
        rendre({ operation, budget });

        await user.click(screen.getByRole('button', { name: 'Valider l\'opération' }));

        expect(saveOperation).toHaveBeenCalledWith(expect.objectContaining({ id: operation.id, etat: OPERATION_ETATS_ENUM.REALISEE }), budget, expect.any(Function));
        expect((saveOperation as Mock).mock.calls[0][0]).not.toBe(operation);
        expect(operation.etat).toBe(OPERATION_ETATS_ENUM.PREVUE);
    });

    test('édition : succès de la sauvegarde -> budget notifié à la page puis copie propagée (commit)', async () => {
        const user = userEvent.setup();
        rendre();
        await user.click(screen.getByRole('button', { name: 'Valider l\'opération' }));
        const [copie, , callback] = (saveOperation as Mock).mock.calls[0];
        const budgetMaj = buildBudget();

        callback(budgetMaj);

        expect(onOperationChange).toHaveBeenCalledWith(budgetMaj);
        expect(onOperationCommit).toHaveBeenCalledWith(copie);
    });

    test('édition : échec de la sauvegarde (callback jamais appelé) -> ni commit ni changement d\'écran', async () => {
        const user = userEvent.setup();
        const operation = buildOperation();
        rendre({ operation });

        await user.click(screen.getByRole('button', { name: 'Valider l\'opération' }));

        // saveOperation (mocké) n'invoque jamais son callback, comme en cas d'erreur HTTP
        expect(saveOperation).toHaveBeenCalledTimes(1);
        expect(onOperationCommit).not.toHaveBeenCalled();
        expect(onOperationChange).not.toHaveBeenCalled();
        expect(operation.etat).toBe(OPERATION_ETATS_ENUM.PREVUE);
    });

    test('budget clos : aucune sauvegarde (avertissement)', async () => {
        const user = userEvent.setup();
        rendre({ budget: buildBudget(false) });

        await user.click(screen.getByRole('button', { name: 'Reporter l\'opération' }));

        expect(saveOperation).not.toHaveBeenCalled();
    });

    test('création : Valider l\'opération transmet date du jour + état à la page, sans sauvegarde ni mutation du contexte', async () => {
        const user = userEvent.setup();
        const operation = buildOperation();
        rendre({ operation }, true);

        await user.click(screen.getByRole('button', { name: 'Valider l\'opération' }));

        expect(onClickRealise).toHaveBeenCalledTimes(1);
        const [date, etat] = onClickRealise.mock.calls[0];
        expect(date).toBeInstanceOf(Date);
        expect(etat).toBe(OPERATION_ETATS_ENUM.REALISEE);
        expect(operation.etat).toBe(OPERATION_ETATS_ENUM.PREVUE);
        expect(saveOperation).not.toHaveBeenCalled();
    });

    test('Supprimer ouvre la confirmation ; Annuler la ferme sans sauvegarde', async () => {
        const user = userEvent.setup();
        rendre();

        expect(screen.queryByText('Voulez vous supprimer l\'opération ?')).not.toBeInTheDocument();
        await user.click(screen.getByRole('button', { name: 'Supprimer l\'opération' }));
        expect(await screen.findByText('Voulez vous supprimer l\'opération ?')).toBeInTheDocument();
        expect(screen.getByText('Suppression de l\'opération')).toBeInTheDocument();
        await user.click(screen.getByRole('button', { name: 'Annuler' }));

        await waitFor(() => expect(screen.queryByText('Voulez vous supprimer l\'opération ?')).not.toBeInTheDocument());
        expect(saveOperation).not.toHaveBeenCalled();
    });

    test('Supprimer puis Confirmer : sauvegarde de la copie SUPPRIMEE et fermeture de la confirmation', async () => {
        const user = userEvent.setup();
        const operation = buildOperation();
        rendre({ operation });

        await user.click(screen.getByRole('button', { name: 'Supprimer l\'opération' }));
        await user.click(await screen.findByRole('button', { name: 'Confirmer' }));

        expect(saveOperation).toHaveBeenCalledTimes(1);
        expect((saveOperation as Mock).mock.calls[0][0].etat).toBe(OPERATION_ETATS_ENUM.SUPPRIMEE);
        expect(operation.etat).toBe(OPERATION_ETATS_ENUM.PREVUE);
        await waitFor(() => expect(screen.queryByText('Voulez vous supprimer l\'opération ?')).not.toBeInTheDocument());
    });
});
