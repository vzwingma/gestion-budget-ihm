import React from 'react';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, test, vi } from 'vitest';

import { BudgetPage } from './budget/Budget.component.tsx';
import { RecurrentsPage } from './recurrents/Recurrents.component.tsx';
import { BudgetContextProvider, useBudgetContext } from '../../Models/contextProvider/BudgetContextProvider.tsx';
import BudgetMensuelModel from '../../Models/budgets/BudgetMensuel.model.ts';
import { createNewOperation } from '../../Models/budgets/Operation.model.ts';
import { OPERATION_ETATS_ENUM, PERIODES_MENSUALITE_ENUM } from '../../Utils/AppBusinessEnums.constants.ts';
import { fetchBudget, fetchCategories, fetchPreferenceUtilisateur } from './budget/Budget.extservices.ts';
import { fetchLibellesOperationsCompte } from './operations/courantes/detail/OperationDetailPage.extservices.ts';

/**
 * Test d'intégration BudgetPage / RecurrentsPage avec le VRAI `BudgetContextProvider` et le VRAI `useFetch`
 * (AP 006 - T20). Point de risque couvert : `useFetch` conserve l'ancien `data` pendant un nouveau chargement.
 * Au changement de compte ou de date, la page doit :
 *  - réinitialiser le budget et l'opération courants (état "chargement"),
 *  - ne PAS réinjecter le budget périmé de l'ancien compte/mois,
 *  - n'afficher que le budget de la sélection courante (réponses tardives d'anciennes sélections ignorées).
 *
 * Réseau : `fetchBudget` mocké avec des promesses contrôlées par le test (une par couple compte/mois).
 * Composants enfants (header, soldes, actions, listes, détails) mockés en éléments minimalistes.
 */

vi.mock('./budget/Budget.extservices.ts', () => ({
    fetchCategories: vi.fn(),
    fetchPreferenceUtilisateur: vi.fn(),
    fetchBudget: vi.fn()
}));

vi.mock('./operations/courantes/detail/OperationDetailPage.extservices.ts', () => ({
    fetchLibellesOperationsCompte: vi.fn()
}));

vi.mock('./shared/BudgetPageHeader.component.tsx', () => ({
    default: ({ additionalHeaderContentLeft, additionalHeaderContentRight }: any) => (
        <div data-testid="mock-header">{additionalHeaderContentLeft}{additionalHeaderContentRight}</div>
    )
}));

vi.mock('./budget/BudgetSoldes.component.tsx', () => ({ default: () => <div /> }));
vi.mock('./budget/actions/BudgetActionsButtonGroup.component.tsx', () => ({
    BudgetActionsButtonGroupComponent: () => <div data-testid="mock-actions" />
}));

/** Les deux listes exposent un bouton par opération, quel que soit le regroupement **/
const renderListe = (groups: Record<string, any[]>, onClick: (operation: any) => void) => (
    <div data-testid="mock-liste">
        {Object.values(groups).flat().map((operation: any) => (
            <button key={operation.id} data-testid={`op-${operation.id}`} onClick={() => onClick(operation)} />
        ))}
    </div>
);
vi.mock('./operations/OperationsListe.component.tsx', () => ({
    default: ({ operationGroupedByDate, onClick }: any) => renderListe(operationGroupedByDate, onClick)
}));
vi.mock('./operations/recurrentes/OperationsRecurrentesListe.component.tsx', () => ({
    default: ({ operationGroupedByPeriodicity, onClick }: any) => renderListe(operationGroupedByPeriodicity, onClick)
}));
vi.mock('./operations/courantes/detail/OperationDetailPage.component.tsx', () => ({
    default: () => <div data-testid="mock-detail" />
}));
vi.mock('./operations/recurrentes/details/OperationRecurrenteDetailPage.component.tsx', () => ({
    default: () => <div data-testid="mock-detail" />
}));

/** Budget d'un compte/mois contenant une opération identifiable (ponctuelle ET récurrente) **/
function buildBudget(id: string, operationId: string): BudgetMensuelModel {
    const budget = new BudgetMensuelModel(id, 'Budget ' + id);
    const operation = createNewOperation();
    operation.id = operationId;
    operation.libelle = 'Opération ' + operationId;
    operation.etat = OPERATION_ETATS_ENUM.REALISEE;
    operation.autresInfos.dateOperation = new Date(2026, 0, 15);
    operation.mensualite = { periode: PERIODES_MENSUALITE_ENUM.MENSUELLE, prochaineEcheance: 15 };
    budget.listeOperations = [operation];
    return budget;
}

/** Promesses de réponse du back, pilotées par le test : clé = `<idCompte>/<mois 0-based>` **/
const pending = new Map<string, (budget: BudgetMensuelModel) => void>();

const COMPTE_A: any = { id: 'A', libelle: 'Compte A' };
const COMPTE_B: any = { id: 'B', libelle: 'Compte B' };
const COMPTE_C: any = { id: 'C', libelle: 'Compte C' };

/** Pilote la sélection depuis le test (équivalent des clics dans le menu de MainPage) **/
function Controls() {
    const { setSelectedCompte, setSelectedDate } = useBudgetContext();
    return (
        <>
            <button data-testid="select-A" onClick={() => setSelectedCompte(COMPTE_A)} />
            <button data-testid="select-B" onClick={() => setSelectedCompte(COMPTE_B)} />
            <button data-testid="select-C" onClick={() => setSelectedCompte(COMPTE_C)} />
            <button data-testid="next-month" onClick={() => setSelectedDate((date) => new Date(date.getFullYear(), date.getMonth() + 1, 1))} />
        </>
    );
}

/** Résout la réponse du back en attente pour la clé donnée **/
async function respond(key: string, budget: BudgetMensuelModel) {
    const resolve = pending.get(key);
    expect(resolve, 'aucun appel fetchBudget en attente pour ' + key).toBeDefined();
    await act(async () => { resolve!(budget); });
}

const currentMonth = () => new Date().getMonth();
const nextMonth = () => new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1).getMonth();

describe.each([
    ['BudgetPage', BudgetPage],
    ['RecurrentsPage', RecurrentsPage]
])('%s - changement de compte / de date (intégration useFetch + BudgetContextProvider)', (_nom, Page) => {

    beforeEach(() => {
        vi.clearAllMocks();
        pending.clear();
        (fetchCategories as any).mockResolvedValue([]);
        (fetchPreferenceUtilisateur as any).mockResolvedValue([]);
        (fetchLibellesOperationsCompte as any).mockResolvedValue([]);
        (fetchBudget as any).mockImplementation((compte: any, date?: Date) =>
            compte == null || date == null
                ? Promise.resolve(undefined)
                : new Promise((resolve) => { pending.set(compte.id + '/' + date.getMonth(), resolve); }));
    });

    function renderPage() {
        return render(
            <BudgetContextProvider>
                <Controls />
                <Page onOpenMenu={vi.fn()} />
            </BudgetContextProvider>
        );
    }

    test('sans compte sélectionné : état de chargement, aucun appel back', () => {
        renderPage();

        expect(screen.queryByTestId('mock-liste')).not.toBeInTheDocument();
        expect(pending.size).toBe(0);
    });

    test('affiche le budget du compte sélectionné une fois chargé', async () => {
        const user = userEvent.setup();
        renderPage();

        await user.click(screen.getByTestId('select-A'));
        expect(screen.queryByTestId('mock-liste')).not.toBeInTheDocument();

        await respond('A/' + currentMonth(), buildBudget('budget-A', 'opA'));

        expect(screen.getByTestId('op-opA')).toBeInTheDocument();
    });

    test('changement de compte : budget périmé retiré, remplacé par celui du nouveau compte seulement à sa résolution', async () => {
        const user = userEvent.setup();
        renderPage();
        await user.click(screen.getByTestId('select-A'));
        await respond('A/' + currentMonth(), buildBudget('budget-A', 'opA'));
        expect(screen.getByTestId('op-opA')).toBeInTheDocument();

        await user.click(screen.getByTestId('select-B'));

        // Nouveau chargement en cours : l'ancien budget (A) ne doit plus être visible ni réinjecté
        expect(screen.queryByTestId('op-opA')).not.toBeInTheDocument();
        expect(screen.queryByTestId('mock-liste')).not.toBeInTheDocument();

        await respond('B/' + currentMonth(), buildBudget('budget-B', 'opB'));

        expect(screen.getByTestId('op-opB')).toBeInTheDocument();
        expect(screen.queryByTestId('op-opA')).not.toBeInTheDocument();
    });

    test('changement de compte : l opération sélectionnée est réinitialisée (détail fermé)', async () => {
        const user = userEvent.setup();
        renderPage();
        await user.click(screen.getByTestId('select-A'));
        await respond('A/' + currentMonth(), buildBudget('budget-A', 'opA'));
        await user.click(screen.getByTestId('op-opA'));
        expect(screen.getByTestId('mock-detail')).toBeInTheDocument();

        await user.click(screen.getByTestId('select-B'));
        expect(screen.queryByTestId('mock-detail')).not.toBeInTheDocument();

        await respond('B/' + currentMonth(), buildBudget('budget-B', 'opB'));
        // Le budget B est affiché mais aucune opération n'est sélectionnée : pas de détail résiduel de A
        expect(screen.getByTestId('op-opB')).toBeInTheDocument();
        expect(screen.queryByTestId('mock-detail')).not.toBeInTheDocument();
    });

    test('changement de date (même compte) : budget du mois précédent retiré puis remplacé par celui du mois suivant', async () => {
        const user = userEvent.setup();
        renderPage();
        await user.click(screen.getByTestId('select-A'));
        await respond('A/' + currentMonth(), buildBudget('budget-A-m1', 'opM1'));
        expect(screen.getByTestId('op-opM1')).toBeInTheDocument();

        await user.click(screen.getByTestId('next-month'));

        expect(screen.queryByTestId('op-opM1')).not.toBeInTheDocument();
        expect(screen.queryByTestId('mock-liste')).not.toBeInTheDocument();

        await respond('A/' + nextMonth(), buildBudget('budget-A-m2', 'opM2'));

        expect(screen.getByTestId('op-opM2')).toBeInTheDocument();
        expect(screen.queryByTestId('op-opM1')).not.toBeInTheDocument();
    });

    test('réponse tardive d un compte abandonné : ignorée (pas de budget fantôme)', async () => {
        const user = userEvent.setup();
        renderPage();
        await user.click(screen.getByTestId('select-A'));
        await user.click(screen.getByTestId('select-B'));
        await user.click(screen.getByTestId('select-C'));

        // B puis A répondent APRÈS la sélection de C : leurs budgets ne doivent jamais s'afficher
        await respond('B/' + currentMonth(), buildBudget('budget-B', 'opB'));
        await respond('A/' + currentMonth(), buildBudget('budget-A', 'opA'));
        expect(screen.queryByTestId('op-opB')).not.toBeInTheDocument();
        expect(screen.queryByTestId('op-opA')).not.toBeInTheDocument();
        expect(screen.queryByTestId('mock-liste')).not.toBeInTheDocument();

        await respond('C/' + currentMonth(), buildBudget('budget-C', 'opC'));
        expect(screen.getByTestId('op-opC')).toBeInTheDocument();
        expect(screen.queryByTestId('op-opB')).not.toBeInTheDocument();
        expect(screen.queryByTestId('op-opA')).not.toBeInTheDocument();
    });

    test('retour sur un compte déjà visité : rechargement (pas de budget en cache réinjecté)', async () => {
        const user = userEvent.setup();
        renderPage();
        await user.click(screen.getByTestId('select-A'));
        await respond('A/' + currentMonth(), buildBudget('budget-A', 'opA'));
        await user.click(screen.getByTestId('select-B'));
        await respond('B/' + currentMonth(), buildBudget('budget-B', 'opB'));

        await user.click(screen.getByTestId('select-A'));

        // Tant que A n'a pas répondu à nouveau, ni A (ancien) ni B ne sont affichés
        expect(screen.queryByTestId('op-opA')).not.toBeInTheDocument();
        expect(screen.queryByTestId('op-opB')).not.toBeInTheDocument();
        // 4 appels : montage sans compte (null), A, B, puis A à nouveau
        expect(fetchBudget).toHaveBeenCalledTimes(4);

        await respond('A/' + currentMonth(), buildBudget('budget-A-bis', 'opA2'));
        expect(screen.getByTestId('op-opA2')).toBeInTheDocument();
    });
});
