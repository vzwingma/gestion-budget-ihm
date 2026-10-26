import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, test, vi } from 'vitest';

import { OperationDetailActions } from './OperationDetailActions.component.tsx';
import { saveOperation } from '../OperationDetailPage.extservices.ts';
import { buildBudget, buildOperation, renderWithContexts } from '../OperationDetailPage.testutils.tsx';
import { cloneOperation } from '../../../../../../Models/budgets/OperationEdition.model.ts';
import { OPERATION_ETATS_ENUM } from '../../../../../../Utils/AppBusinessEnums.constants.ts';

vi.mock('../OperationDetailPage.extservices.ts', () => ({ saveOperation: vi.fn() }));

describe('OperationDetailActions - composant', () => {

    const onOperationChange = vi.fn();
    const onClickRealise = vi.fn();

    function rendre(contexte: Parameters<typeof renderWithContexts>[1] = {}, enCreation = false) {
        const operation = contexte.operation ?? buildOperation();
        return renderWithContexts(
            <OperationDetailActions isInCreateMode={enCreation} editOperation={cloneOperation(operation)}
                onClickRealiseInCreateMode={onClickRealise} onOperationChange={onOperationChange} />, contexte);
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

    test('édition : Valider l\'opération -> saveOperation(REALISEE) avec le callback du parent', async () => {
        const user = userEvent.setup();
        const operation = buildOperation();
        const budget = buildBudget();
        rendre({ operation, budget });

        await user.click(screen.getByRole('button', { name: 'Valider l\'opération' }));

        expect(saveOperation).toHaveBeenCalledWith(operation, budget, onOperationChange);
        expect(operation.etat).toBe(OPERATION_ETATS_ENUM.REALISEE);
    });

    test('budget clos : aucune sauvegarde (avertissement)', async () => {
        const user = userEvent.setup();
        rendre({ budget: buildBudget(false) });

        await user.click(screen.getByRole('button', { name: 'Reporter l\'opération' }));

        expect(saveOperation).not.toHaveBeenCalled();
    });

    test('création : Valider l\'opération renseigne l\'état et notifie la page, sans sauvegarde', async () => {
        const user = userEvent.setup();
        const operation = buildOperation();
        rendre({ operation }, true);

        await user.click(screen.getByRole('button', { name: 'Valider l\'opération' }));

        expect(operation.etat).toBe(OPERATION_ETATS_ENUM.REALISEE);
        expect(onClickRealise).toHaveBeenCalledTimes(1);
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

    test('Supprimer puis Confirmer : sauvegarde de l\'opération SUPPRIMEE et fermeture de la confirmation', async () => {
        const user = userEvent.setup();
        const operation = buildOperation();
        rendre({ operation });

        await user.click(screen.getByRole('button', { name: 'Supprimer l\'opération' }));
        await user.click(await screen.findByRole('button', { name: 'Confirmer' }));

        expect(operation.etat).toBe(OPERATION_ETATS_ENUM.SUPPRIMEE);
        expect(saveOperation).toHaveBeenCalledTimes(1);
        await waitFor(() => expect(screen.queryByText('Voulez vous supprimer l\'opération ?')).not.toBeInTheDocument());
    });
});
