import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { toast } from 'react-toastify';
import { beforeEach, describe, expect, test, vi } from 'vitest';

import { call } from '../../../../../Services/ClientHTTP.service.ts';
import { buildOperation, renderPage } from './OperationDetailPage.testutils.tsx';
import BudgetMensuelModel from '../../../../../Models/budgets/BudgetMensuel.model.ts';
import { createNewOperation } from '../../../../../Models/budgets/Operation.model.ts';
import { OPERATION_ETATS_ENUM } from '../../../../../Utils/AppBusinessEnums.constants.ts';
import { BACKEND_ENUM, METHODE_HTTP, SERVICES_URL } from '../../../../../Utils/AppTechEnums.constants.ts';

/**
 * Contrat HTTP de bout en bout de la page : la page, ses sous-composants et le vrai `extservices` (`saveOperation`,
 * `saveOperationIntercompte`) sont réels ; seuls le client HTTP et les toasts sont mockés. Vérifie la méthode,
 * l'URL, les paramètres et le corps envoyés au backend, puis la mise à jour du parent en cas de succès.
 */
vi.mock('react-oidc-context', () => ({ useAuth: () => ({ user: { profile: { email: 'vincent@test.fr' } } }) }));
vi.mock('../../../../../Services/ClientHTTP.service.ts', () => ({ call: vi.fn() }));
vi.mock('react-toastify', () => ({ toast: { success: vi.fn(), error: vi.fn(), warn: vi.fn() } }));

const UUID_V7 = /^[0-9a-f]{8}-[0-9a-f]{4}-7[0-9a-f]{3}-[0-9a-f]{4}-[0-9a-f]{12}$/;

describe('OperationDetailPage - contrat HTTP', () => {

    const budgetMaj = new BudgetMensuelModel('compte-1_2026_10', 'Budget mis à jour');

    beforeEach(() => {
        vi.clearAllMocks();
        vi.spyOn(console, 'error').mockImplementation(() => undefined);
        vi.spyOn(console, 'warn').mockImplementation(() => undefined);
        vi.mocked(call).mockResolvedValue(budgetMaj);
    });

    test('Valider une opération existante : POST UPDATE [budget, id] avec l\'opération modifiée, puis mise à jour du parent', async () => {
        const user = userEvent.setup();
        const { onOperationChange, budget } = renderPage();

        await user.click(screen.getByRole('button', { name: 'Reporter l\'opération' }));

        await waitFor(() => expect(onOperationChange).toHaveBeenCalledWith(budgetMaj));
        expect(call).toHaveBeenCalledTimes(1);
        expect(call).toHaveBeenCalledWith(METHODE_HTTP.POST, BACKEND_ENUM.URL_OPERATIONS, SERVICES_URL.OPERATIONS.UPDATE,
            [budget.id, 'op-1'], expect.objectContaining({ id: 'op-1', etat: OPERATION_ETATS_ENUM.REPORTEE }));
        expect(toast.success).toHaveBeenCalledWith('Mise à jour de l\'opération correctement effectuée');
    });

    test('Supprimer (confirmé) : DELETE sur l\'URL UPDATE', async () => {
        const user = userEvent.setup();
        const { onOperationChange, budget } = renderPage();

        await user.click(screen.getByRole('button', { name: 'Supprimer l\'opération' }));
        await user.click(await screen.findByRole('button', { name: 'Confirmer' }));

        await waitFor(() => expect(onOperationChange).toHaveBeenCalledWith(budgetMaj));
        expect(call).toHaveBeenCalledWith(METHODE_HTTP.DELETE, BACKEND_ENUM.URL_OPERATIONS, SERVICES_URL.OPERATIONS.UPDATE,
            [budget.id, 'op-1'], expect.objectContaining({ etat: OPERATION_ETATS_ENUM.SUPPRIMEE }));
    });

    test('Créer une opération : POST CREATE avec un identifiant généré, formulaire refermé au succès', async () => {
        const user = userEvent.setup();
        const { onOperationChange, budget } = renderPage({ operations: { nouvelle: createNewOperation() } });

        await user.type(screen.getByRole('combobox', { name: /description/i }), 'Cinéma');
        await user.tab();
        // eslint-disable-next-line testing-library/no-node-access -- autocomplete des catégories sans label ni nom accessible
        await user.click(document.getElementById('OPERATION_CATEGORIE_INPUT') as HTMLElement);
        await user.click(await screen.findByRole('option', { name: 'Restaurant' }));
        await user.click(screen.getByRole('button', { name: 'Valider' }));

        await waitFor(() => expect(onOperationChange).toHaveBeenCalledWith(budgetMaj));
        expect(call).toHaveBeenCalledWith(METHODE_HTTP.POST, BACKEND_ENUM.URL_OPERATIONS, SERVICES_URL.OPERATIONS.CREATE,
            [budget.id, ''], expect.objectContaining({ id: expect.stringMatching(UUID_V7), libelle: 'Cinéma' }));
        expect(toast.success).toHaveBeenCalledWith('Création de l\'opération correctement effectuée');
        expect(screen.queryByRole('button', { name: 'Valider' })).not.toBeInTheDocument();
    });

    test('Virement interne : POST INTERCOMPTE [budget, compte cible] avec l\'opération', async () => {
        const user = userEvent.setup();
        const { onOperationChange, budget } = renderPage({ operations: { nouvelle: createNewOperation() } });

        await user.type(screen.getByRole('combobox', { name: /description/i }), 'Epargne');
        await user.tab();
        // eslint-disable-next-line testing-library/no-node-access -- autocomplete des catégories sans label ni nom accessible
        await user.click(document.getElementById('OPERATION_CATEGORIE_INPUT') as HTMLElement);
        await user.click(await screen.findByRole('option', { name: 'Virement interne' }));
        // eslint-disable-next-line testing-library/no-node-access -- select MUI sans nom accessible
        await user.click(document.getElementById('OPERATION_INTERCOMPTES_INPUT') as HTMLElement);
        await user.click(await screen.findByRole('option', { name: /Livret A/ }));
        await user.click(screen.getByRole('button', { name: 'Valider' }));

        await waitFor(() => expect(onOperationChange).toHaveBeenCalledWith(budgetMaj));
        expect(call).toHaveBeenCalledWith(METHODE_HTTP.POST, BACKEND_ENUM.URL_OPERATIONS, SERVICES_URL.OPERATIONS.INTERCOMPTE,
            [budget.id, 'compte-2'], expect.objectContaining({ libelle: 'Epargne', intercompte: 'compte-2' }));
        expect(toast.success).toHaveBeenCalledWith('Création de l\'opération inter-comptes correctement effectuée');
    });

    test('échec HTTP : toast d\'erreur, parent non notifié', async () => {
        const user = userEvent.setup();
        vi.mocked(call).mockRejectedValue(new Error('500'));
        const { onOperationChange } = renderPage({ operations: { A: buildOperation() } });

        await user.click(screen.getByRole('button', { name: 'Annuler l\'opération' }));

        await waitFor(() => expect(toast.error).toHaveBeenCalledWith('Erreur lors de la mise à jour de l\'opération', undefined));
        expect(onOperationChange).not.toHaveBeenCalled();
    });
});
