import React from 'react';
import { act, renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, test, vi } from 'vitest';

import { useBudgetPageData } from './useBudgetPageData.ts';
import { BudgetContextProvider, useBudgetContext } from '../../../Models/contextProvider/BudgetContextProvider.tsx';
import BudgetMensuelModel from '../../../Models/budgets/BudgetMensuel.model.ts';
import { createNewOperation } from '../../../Models/budgets/Operation.model.ts';
import { UTILISATEUR_DROITS } from '../../../Utils/AppBusinessEnums.constants.ts';
import { fetchBudget, fetchPreferenceUtilisateur } from '../budget/Budget.extservices.ts';

/**
 * Hook `useBudgetPageData` avec le VRAI `BudgetContextProvider` et le VRAI `useFetch`
 * (seul `Budget.extservices.ts` est mocké : réponses pilotées par le test).
 */
vi.mock('../budget/Budget.extservices.ts', () => ({
    fetchBudget: vi.fn(),
    fetchPreferenceUtilisateur: vi.fn()
}));

const COMPTE_A: any = { id: 'A', libelle: 'Compte A' };
const COMPTE_B: any = { id: 'B', libelle: 'Compte B' };

/** Réponses en attente du back, clé = `<idCompte>/<mois 0-based>` */
const pending = new Map<string, (budget: BudgetMensuelModel) => void>();

function buildBudget(id: string, operationId = 'op-' + id): BudgetMensuelModel {
    const budget = new BudgetMensuelModel(id, 'Budget ' + id);
    const operation = createNewOperation();
    operation.id = operationId;
    budget.listeOperations = [operation];
    return budget;
}

async function respond(key: string, budget: BudgetMensuelModel) {
    const resolve = pending.get(key);
    expect(resolve, 'aucun appel fetchBudget en attente pour ' + key).toBeDefined();
    await act(async () => { resolve!(budget); });
}

/** Regroupement : une seule clé listant les opérations (fonction de module = référence stable) */
const groupOperations = (budget: BudgetMensuelModel) => ({ all: budget.listeOperations });

const wrapper = ({ children }: { children: React.ReactNode }) => <BudgetContextProvider>{children}</BudgetContextProvider>;

function setup(options: Partial<Parameters<typeof useBudgetPageData>[0]> = {}) {
    return renderHook(
        () => ({
            page: useBudgetPageData({ groupOperations, ...options }),
            ctx: useBudgetContext()
        }),
        { wrapper }
    );
}

describe('useBudgetPageData', () => {

    beforeEach(() => {
        vi.clearAllMocks();
        pending.clear();
        (fetchPreferenceUtilisateur as any).mockResolvedValue([]);
        (fetchBudget as any).mockImplementation((compte: any, date?: Date) =>
            compte == null || date == null
                ? Promise.resolve(undefined)
                : new Promise((resolve) => { pending.set(compte.id + '/' + date.getMonth(), resolve); }));
    });

    test('sans budget : regroupement vide, fonction de regroupement non appelée', async () => {
        const groupSpy = vi.fn(groupOperations);
        const { result } = setup({ groupOperations: groupSpy });

        await waitFor(() => expect(fetchPreferenceUtilisateur).toHaveBeenCalled());
        expect(result.current.page.currentBudget).toBeUndefined();
        expect(result.current.page.operationsGroupees).toEqual({});
        expect(groupSpy).not.toHaveBeenCalled();
    });

    test('budget chargé : injecté dans le contexte et regroupé', async () => {
        const { result } = setup();
        const mois = result.current.ctx.selectedDate.getMonth();

        act(() => result.current.ctx.setSelectedCompte(COMPTE_A));
        await respond('A/' + mois, buildBudget('A1', 'op-a'));

        await waitFor(() => expect(result.current.page.currentBudget?.id).toBe('A1'));
        expect(result.current.page.operationsGroupees.all.map((o) => o.id)).toEqual(['op-a']);
    });

    test('changement de compte : budget et opération courants réinitialisés, budget périmé non réinjecté', async () => {
        const { result } = setup();
        const mois = result.current.ctx.selectedDate.getMonth();

        act(() => result.current.ctx.setSelectedCompte(COMPTE_A));
        await respond('A/' + mois, buildBudget('A1'));
        await waitFor(() => expect(result.current.page.currentBudget?.id).toBe('A1'));
        act(() => result.current.page.setCurrentOperation(createNewOperation()));
        expect(result.current.page.currentOperation).not.toBeNull();

        act(() => result.current.ctx.setSelectedCompte(COMPTE_B));

        // Nouveau compte en cours de chargement : plus de budget ni d'opération (le budget de A n'est pas réinjecté)
        await waitFor(() => expect(result.current.page.currentBudget).toBeUndefined());
        expect(result.current.page.currentOperation).toBeNull();
        expect(result.current.page.operationsGroupees).toEqual({});

        await respond('B/' + mois, buildBudget('B1'));
        await waitFor(() => expect(result.current.page.currentBudget?.id).toBe('B1'));
    });

    test('changement de date (même compte) : contexte réinitialisé puis budget du nouveau mois', async () => {
        const { result } = setup();
        const date = result.current.ctx.selectedDate;
        const moisSuivant = new Date(date.getFullYear(), date.getMonth() + 1, 1);

        act(() => result.current.ctx.setSelectedCompte(COMPTE_A));
        await respond('A/' + date.getMonth(), buildBudget('A-m1'));
        await waitFor(() => expect(result.current.page.currentBudget?.id).toBe('A-m1'));

        act(() => result.current.ctx.setSelectedDate(moisSuivant));
        await waitFor(() => expect(result.current.page.currentBudget).toBeUndefined());

        await respond('A/' + moisSuivant.getMonth(), buildBudget('A-m2'));
        await waitFor(() => expect(result.current.page.currentBudget?.id).toBe('A-m2'));
    });

    test('réponse tardive d un compte abandonné : ignorée', async () => {
        const { result } = setup();
        const mois = result.current.ctx.selectedDate.getMonth();

        act(() => result.current.ctx.setSelectedCompte(COMPTE_A));
        await waitFor(() => expect(pending.has('A/' + mois)).toBe(true));
        act(() => result.current.ctx.setSelectedCompte(COMPTE_B));
        await waitFor(() => expect(pending.has('B/' + mois)).toBe(true));

        // B répond d'abord, puis A (tardif)
        await respond('B/' + mois, buildBudget('B1'));
        await waitFor(() => expect(result.current.page.currentBudget?.id).toBe('B1'));
        await respond('A/' + mois, buildBudget('A1'));

        expect(result.current.page.currentBudget?.id).toBe('B1');
    });

    test('prepareBudget : appelé sur le budget chargé puis sur handleBudgetUpdate', async () => {
        const prepareBudget = vi.fn();
        const { result } = setup({ prepareBudget });
        const mois = result.current.ctx.selectedDate.getMonth();

        act(() => result.current.ctx.setSelectedCompte(COMPTE_A));
        const charge = buildBudget('A1');
        await respond('A/' + mois, charge);
        await waitFor(() => expect(result.current.page.currentBudget).toBe(charge));
        expect(prepareBudget).toHaveBeenCalledTimes(1);
        expect(prepareBudget).toHaveBeenLastCalledWith(charge);

        const maj = buildBudget('A1-maj');
        act(() => result.current.page.handleBudgetUpdate(maj));
        expect(prepareBudget).toHaveBeenCalledTimes(2);
        expect(prepareBudget).toHaveBeenLastCalledWith(maj);
        expect(result.current.page.currentBudget).toBe(maj);
    });

    // FRAGILITÉ LATENTE connue (useBudgetPageData.ts, effet « Le budget chargé alimente le contexte ») : avec une référence `prepareBudget`
    // instable, `handleBudgetUpdate` change à chaque rendu, l'effet d'injection se rejoue après le reset avec le `budgetCharge` PÉRIMÉ
    // (useFetch conserve l'ancien `data` pendant le rechargement) et le réinjecte. Sans effet avec les références stables du contrat
    // (Budget / Recurrents). Inverser l'ordre reset/injection ne corrige pas (mutation « reset après injection » : même résultat) ;
    // correctif possible : n'injecter que si `budgetCharge` a changé depuis la dernière injection (ref).
    test('prepareBudget instable (fonction recréée à chaque rendu) : le budget périmé n est pas réinjecté au changement de compte', async () => {
        const { result } = renderHook(
            () => ({
                page: useBudgetPageData({ groupOperations, prepareBudget: (budget) => { void budget; } }),
                ctx: useBudgetContext()
            }),
            { wrapper }
        );
        const mois = result.current.ctx.selectedDate.getMonth();

        act(() => result.current.ctx.setSelectedCompte(COMPTE_A));
        await respond('A/' + mois, buildBudget('A1'));
        await waitFor(() => expect(result.current.page.currentBudget?.id).toBe('A1'));

        act(() => result.current.ctx.setSelectedCompte(COMPTE_B));

        await waitFor(() => expect(pending.has('B/' + mois)).toBe(true));
        expect(result.current.page.currentBudget).toBeUndefined();
    });

    test('handleBudgetUpdate sans prepareBudget : injecte simplement le budget', () => {
        const { result } = setup();
        const budget = buildBudget('X');

        act(() => result.current.page.handleBudgetUpdate(budget));

        expect(result.current.page.currentBudget).toBe(budget);
    });

    test('userDroits : vide avant chargement puis issus des préférences utilisateur', async () => {
        (fetchPreferenceUtilisateur as any).mockResolvedValue([UTILISATEUR_DROITS.DROIT_CREATE_OPERATION]);
        const { result } = setup();

        expect(result.current.page.userDroits).toEqual([]);
        await waitFor(() => expect(result.current.page.userDroits).toEqual([UTILISATEUR_DROITS.DROIT_CREATE_OPERATION]));
    });

    test('userDroits : reste vide si le chargement des préférences échoue', async () => {
        (fetchPreferenceUtilisateur as any).mockRejectedValue(new Error('500'));
        const { result } = setup();

        await waitFor(() => expect(fetchPreferenceUtilisateur).toHaveBeenCalled());
        expect(result.current.page.userDroits).toEqual([]);
    });
});
