import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, test, vi } from 'vitest';

import { BudgetActionsButtonGroupComponent } from './BudgetActionsButtonGroup.component.tsx';
import { callReinitBudget, callReopenCloseBudget } from './BudgetActionsButtonGroup.extservices.ts';
import { buildBudget, renderWithContexts } from '../../operations/courantes/detail/OperationDetailPage.testutils.tsx';
import { UTILISATEUR_DROITS } from '../../../../Utils/AppBusinessEnums.constants.ts';

vi.mock('./BudgetActionsButtonGroup.extservices.ts', () => ({
    callReinitBudget: vi.fn(),
    callReopenCloseBudget: vi.fn()
}));

const TOUS_DROITS = [UTILISATEUR_DROITS.DROIT_CLOTURE_BUDGET, UTILISATEUR_DROITS.DROIT_RAZ_BUDGET, UTILISATEUR_DROITS.DROIT_CREATE_OPERATION];

describe('BudgetActionsButtonGroupComponent', () => {

    const onActionBudgetChange = vi.fn();
    const onActionOperationCreate = vi.fn();

    function rendre(droits: UTILISATEUR_DROITS[] = TOUS_DROITS, contexte: Parameters<typeof renderWithContexts>[1] = {}) {
        return renderWithContexts(
            <BudgetActionsButtonGroupComponent droits={droits} onActionBudgetChange={onActionBudgetChange} onActionOperationCreate={onActionOperationCreate} />,
            contexte);
    }

    const boutons = () => screen.queryAllByRole('button').map((bouton) => bouton.getAttribute('aria-label'));

    beforeEach(() => {
        vi.clearAllMocks();
    });

    test('aucun budget : rien n\'est rendu', () => {
        rendre(TOUS_DROITS, { budget: undefined });

        expect(boutons()).toEqual([]);
    });

    test('budget ouvert, tous les droits : clôturer, réinitialiser, créer (ordre inversé à l\'écran)', () => {
        rendre();

        expect(boutons()).toEqual(['Clôturer le budget', 'Réinitialiser le budget', 'Créer une nouvelle opération']);
    });

    test('budget clos : seule la réouverture est proposée', () => {
        rendre(TOUS_DROITS, { budget: buildBudget(false) });

        expect(boutons()).toEqual(['Réouvrir le budget']);
    });

    test.each([
        [[], []],
        [[UTILISATEUR_DROITS.DROIT_CLOTURE_BUDGET], ['Clôturer le budget']],
        [[UTILISATEUR_DROITS.DROIT_RAZ_BUDGET], ['Réinitialiser le budget']],
        [[UTILISATEUR_DROITS.DROIT_CREATE_OPERATION], ['Créer une nouvelle opération']]
    ])('droits %j : actions proposées %j', (droits, attendues) => {
        rendre(droits);

        expect(boutons()).toEqual(attendues);
    });

    test('créer une opération : callback appelé sans ouvrir de confirmation', async () => {
        const user = userEvent.setup();
        rendre();

        await user.click(screen.getByRole('button', { name: 'Créer une nouvelle opération' }));

        expect(onActionOperationCreate).toHaveBeenCalledTimes(1);
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    test('clôturer : confirmation puis callReopenCloseBudget(id, false)', async () => {
        const user = userEvent.setup();
        rendre();

        await user.click(screen.getByRole('button', { name: 'Clôturer le budget' }));
        expect(await screen.findByText('Activité du budget')).toBeInTheDocument();
        expect(screen.getByText('Voulez vous vraiment clôturer le budget ?')).toBeInTheDocument();
        expect(callReopenCloseBudget).not.toHaveBeenCalled();
        await user.click(screen.getByRole('button', { name: 'Confirmer' }));

        expect(callReopenCloseBudget).toHaveBeenCalledWith('compte-1_2026_10', false, onActionBudgetChange);
        await waitFor(() => expect(screen.queryByText('Activité du budget')).not.toBeInTheDocument());
    });

    test('réouvrir (budget clos) : confirmation puis callReopenCloseBudget(id, true)', async () => {
        const user = userEvent.setup();
        rendre(TOUS_DROITS, { budget: buildBudget(false) });

        await user.click(screen.getByRole('button', { name: 'Réouvrir le budget' }));
        expect(await screen.findByText('Voulez vous vraiment réouvrir le budget ?')).toBeInTheDocument();
        await user.click(screen.getByRole('button', { name: 'Confirmer' }));

        expect(callReopenCloseBudget).toHaveBeenCalledWith('compte-1_2026_10', true, onActionBudgetChange);
    });

    test('réinitialiser : confirmation puis callReinitBudget(budget)', async () => {
        const user = userEvent.setup();
        const budget = buildBudget();
        rendre(TOUS_DROITS, { budget });

        await user.click(screen.getByRole('button', { name: 'Réinitialiser le budget' }));
        expect(await screen.findByText('Action sur le budget')).toBeInTheDocument();
        expect(screen.getByText(/Voulez vous vraiment réinitialiser le budget/)).toBeInTheDocument();
        await user.click(screen.getByRole('button', { name: 'Confirmer' }));

        expect(callReinitBudget).toHaveBeenCalledWith(budget, onActionBudgetChange);
        expect(callReopenCloseBudget).not.toHaveBeenCalled();
    });

    test('annuler dans la confirmation : fermeture sans appel au service', async () => {
        const user = userEvent.setup();
        rendre();

        await user.click(screen.getByRole('button', { name: 'Clôturer le budget' }));
        await user.click(await screen.findByRole('button', { name: 'Annuler' }));

        await waitFor(() => expect(screen.queryByText('Activité du budget')).not.toBeInTheDocument());
        expect(callReopenCloseBudget).not.toHaveBeenCalled();
        expect(callReinitBudget).not.toHaveBeenCalled();
    });
});
