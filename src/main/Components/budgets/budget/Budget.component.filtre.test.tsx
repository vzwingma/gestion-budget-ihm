import React, {useState} from 'react';
import {beforeEach, describe, expect, test, vi} from 'vitest';
import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import {BudgetPage} from './Budget.component.tsx';
import {BudgetContextProvider} from '../../../Models/contextProvider/BudgetContextProvider.tsx';
import BudgetMensuelModel from '../../../Models/budgets/BudgetMensuel.model.ts';
import OperationModel from '../../../Models/budgets/Operation.model.ts';
import {OPERATION_ETATS_ENUM} from '../../../Utils/AppBusinessEnums.constants.ts';

/**
 * AP 005 - Phase 4 (T4.6) : intégration BudgetPage + filtre (texte + puces) dans le Context.
 * Réels : BudgetPageShell/Header, OperationsFilterBar, FilterChips, OperationsListe (en-têtes de groupe Phase 3),
 * BudgetContextProvider. Mockés : services réseau, soldes, actions, détail (hors périmètre).
 */

vi.mock('./Budget.extservices.ts', () => ({
    loadCategories: vi.fn(),
    getPreferenceUtilisateur: vi.fn(),
    reloadBudget: vi.fn()
}));
vi.mock('../operations/courantes/detail/OperationDetailPage.extservices.ts', () => ({
    getLibellesOperationsCompte: vi.fn()
}));
vi.mock('./BudgetSoldes.component.tsx', () => ({default: () => <div/>}));
vi.mock('./actions/BudgetActionsButtonGroup.component.tsx', () => ({BudgetActionsButtonGroupComponent: () => <div/>}));
vi.mock('../operations/courantes/detail/OperationDetailPage.component.tsx', () => ({default: () => <div/>}));

import {reloadBudget} from './Budget.extservices.ts';

// Normalise les espaces (insécables) des séparateurs de milliers / avant « € »
const norm = (t: string | null) => (t ?? '').replace(/\s/g, ' ');
const titres = () => screen.queryAllByRole('heading').map(h => norm(h.textContent));
const resultat = () => norm(screen.getByRole('status').textContent);
const d02 = new Date(2026, 10, 2, 12); // lundi 02/11/2026, construit en local

const ope = (id: string, libelle: string, valeur: number, etat: OPERATION_ETATS_ENUM, date: Date | null): OperationModel =>
    ({
        id, libelle, valeur, etat, statuts: [],
        categorie: {id: 'c', libelle: 'Cat'}, ssCategorie: {id: 's', libelle: 'Ss'},
        autresInfos: {dateOperation: date}
    }) as unknown as OperationModel;

const budgetDeTest = (): BudgetMensuelModel => {
    const budget = new BudgetMensuelModel('b1', 'Budget');
    budget.listeOperations = [
        ope('1', 'Loyer', -500, OPERATION_ETATS_ENUM.PREVUE, null),
        ope('2', 'Courses', -30, OPERATION_ETATS_ENUM.REPORTEE, null),
        ope('3', 'Salaire', 2000, OPERATION_ETATS_ENUM.REALISEE, d02),
        ope('4', 'Cafe', -4.35, OPERATION_ETATS_ENUM.REALISEE, d02),
        ope('5', 'Annule', -99, OPERATION_ETATS_ENUM.ANNULEE, d02),
    ];
    return budget;
};

/** Monte / démonte BudgetPage sous un même Provider : simule le changement d'onglet */
const Appli = () => {
    const [affiche, setAffiche] = useState(true);
    return (
        <BudgetContextProvider>
            <button onClick={() => setAffiche(a => !a)}>bascule</button>
            {affiche && <BudgetPage onOpenMenu={vi.fn()}/>}
        </BudgetContextProvider>
    );
};

const puce = (nom: string) => screen.getByRole('button', {name: nom});
const libelles = () => ['Loyer', 'Courses', 'Salaire', 'Cafe', 'Annule'].filter(l => screen.queryByText(l) !== null);

describe('BudgetPage - filtre par puces', () => {

    beforeEach(() => {
        vi.clearAllMocks();
        (reloadBudget as any).mockImplementation((handleBudgetUpdate: (b: BudgetMensuelModel) => void) => {
            handleBudgetUpdate(budgetDeTest());
        });
    });

    test('sans filtre : 5 opérations, pas de barre de résultat, en-têtes de groupe Phase 3', () => {
        render(<Appli/>);
        expect(libelles()).toEqual(['Loyer', 'Courses', 'Salaire', 'Cafe', 'Annule']);
        expect(screen.queryByRole('status')).not.toBeInTheDocument();
        expect(titres()).toEqual(['À valider · 2 · -530,00 €', expect.stringMatching(/^Lun\. 02\/11 · \+1.995,65 €$/)]);
    });

    test('puce « À valider » : seules PREVUE + REPORTEE ; compteur, net et en-têtes cohérents', async () => {
        render(<Appli/>);
        await userEvent.click(puce('À valider'));
        expect(libelles()).toEqual(['Loyer', 'Courses']);
        expect(resultat()).toBe('2 opérations · net -530,00 € · Réinitialiser');
        expect(titres()).toEqual(['À valider · 2 · -530,00 €']);
    });

    test('puce « Réalisée » : en-tête de date recalculé sur les opérations visibles', async () => {
        render(<Appli/>);
        await userEvent.click(puce('Réalisée'));
        expect(libelles()).toEqual(['Salaire', 'Cafe']);
        expect(resultat()).toMatch(/^2 opérations · net \+1.995,65 €/);
        expect(titres()).toEqual([expect.stringMatching(/^Lun\. 02\/11 · \+1.995,65 €$/)]);
    });

    test('puce « Annulée » seule : opération visible mais net 0,00 € (annulées exclues du net et du sous-total)', async () => {
        render(<Appli/>);
        await userEvent.click(puce('Annulée'));
        expect(libelles()).toEqual(['Annule']);
        expect(resultat()).toMatch(/^1 opération · net 0,00 €/);
        expect(titres()).toEqual([expect.stringMatching(/^Lun\. 02\/11 · 0,00 €$/)]);
    });

    test('puce « Dépenses » : sous-totaux de chaque groupe sur les dépenses visibles', async () => {
        render(<Appli/>);
        await userEvent.click(puce('Dépenses'));
        expect(libelles()).toEqual(['Loyer', 'Courses', 'Cafe', 'Annule']);
        // 4 visibles (dont Annule), net = -500 -30 -4,35 (Annule exclue)
        expect(resultat()).toMatch(/^4 opérations · net -534,35 €/);
        expect(titres()).toEqual(['À valider · 2 · -530,00 €', expect.stringMatching(/^Lun\. 02\/11 · -4,35 €$/)]);
    });

    test('puce « Rentrées » : seul le salaire', async () => {
        render(<Appli/>);
        await userEvent.click(puce('Rentrées'));
        expect(libelles()).toEqual(['Salaire']);
        expect(resultat()).toMatch(/^1 opération · net \+2.000,00 €/);
    });

    test('combinaison État × Sens (ET) et OU intra-groupe', async () => {
        render(<Appli/>);
        await userEvent.click(puce('Réalisée'));
        await userEvent.click(puce('Dépenses'));
        expect(libelles()).toEqual(['Cafe']);
        await userEvent.click(puce('À valider'));
        expect(libelles()).toEqual(['Loyer', 'Courses', 'Cafe']);
    });

    test('texte + puce (ET) : « loy » + « À valider » ; texte + puce incompatibles = 0 opération', async () => {
        render(<Appli/>);
        await userEvent.type(screen.getByLabelText('Filtrage des opérations'), 'loy');
        expect(resultat()).toMatch(/^1 opération · net -500,00 €/);
        await userEvent.click(puce('À valider'));
        expect(libelles()).toEqual(['Loyer']);
        await userEvent.click(puce('Réalisée'));
        await userEvent.click(puce('À valider')); // retire « À valider » : reste « Réalisée » + texte « loy »
        expect(libelles()).toEqual([]);
        expect(resultat()).toMatch(/^0 opération · net 0,00 €/);
    });

    test('« Réinitialiser » vide texte ET puces et masque la barre de résultat', async () => {
        render(<Appli/>);
        await userEvent.type(screen.getByLabelText('Filtrage des opérations'), 'loy');
        await userEvent.click(puce('Dépenses'));
        await userEvent.click(screen.getByRole('button', {name: 'Réinitialiser'}));
        expect(screen.getByLabelText('Filtrage des opérations')).toHaveValue('');
        expect(puce('Dépenses')).toHaveAttribute('aria-pressed', 'false');
        expect(screen.queryByRole('status')).not.toBeInTheDocument();
        expect(libelles()).toEqual(['Loyer', 'Courses', 'Salaire', 'Cafe', 'Annule']);
    });

    test('croix ⊗ du champ texte : vide le texte, conserve les puces, refocus', async () => {
        render(<Appli/>);
        await userEvent.click(puce('Dépenses'));
        await userEvent.type(screen.getByLabelText('Filtrage des opérations'), 'loy');
        await userEvent.click(screen.getByRole('button', {name: 'Effacer le filtre'}));
        expect(screen.getByLabelText('Filtrage des opérations')).toHaveValue('');
        expect(screen.getByLabelText('Filtrage des opérations')).toHaveFocus();
        expect(puce('Dépenses')).toHaveAttribute('aria-pressed', 'true');
        expect(libelles()).toEqual(['Loyer', 'Courses', 'Cafe', 'Annule']);
    });

    test('persistance : démonter puis remonter BudgetPage (même Provider) conserve texte et puces', async () => {
        render(<Appli/>);
        await userEvent.type(screen.getByLabelText('Filtrage des opérations'), 'o');
        await userEvent.click(puce('Dépenses'));
        const avant = libelles();
        expect(avant).toEqual(['Loyer', 'Courses']);

        await userEvent.click(screen.getByRole('button', {name: 'bascule'})); // démonte
        expect(screen.queryByLabelText('Filtrage des opérations')).not.toBeInTheDocument();
        await userEvent.click(screen.getByRole('button', {name: 'bascule'})); // remonte

        expect(screen.getByLabelText('Filtrage des opérations')).toHaveValue('o');
        expect(puce('Dépenses')).toHaveAttribute('aria-pressed', 'true');
        expect(libelles()).toEqual(avant);
        expect(resultat()).toMatch(/^2 opérations · net -530,00 €/);
    });
});
