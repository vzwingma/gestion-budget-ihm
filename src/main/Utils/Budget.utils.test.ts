import { describe, expect, test } from 'vitest';
import BudgetMensuelModel from '../Models/budgets/BudgetMensuel.model.ts';
import { estBudgetDuMois, libelleMoisAnneeBudget } from './Budget.utils.ts';

/**
 * IHM AP011 T1.4 : champs `mois`/`annee` (ADR 008 serverless), repli sur l'id, cas inertes.
 */
describe('Budget.utils', () => {

    describe('estBudgetDuMois', () => {

        test('mois/annee renseignés (forme nom Java) : mois demandé', () => {
            const budget = new BudgetMensuelModel('ignore', 'Budget');
            budget.mois = 'MARCH';
            budget.annee = 2026;

            expect(estBudgetDuMois(budget, new Date(2026, 2, 1))).toBe(true);
        });

        test('mois/annee renseignés (forme numérique 1-12) : mois demandé', () => {
            const budget = new BudgetMensuelModel('ignore', 'Budget');
            budget.mois = 3;
            budget.annee = 2026;

            expect(estBudgetDuMois(budget, new Date(2026, 2, 1))).toBe(true);
        });

        test('mois/annee renseignés : mois différent', () => {
            const budget = new BudgetMensuelModel('ignore', 'Budget');
            budget.mois = 'FEBRUARY';
            budget.annee = 2026;

            expect(estBudgetDuMois(budget, new Date(2026, 2, 1))).toBe(false);
        });

        test('mois absent : repli sur le suffixe _AAAA_MM de l\'id, mois demandé', () => {
            const budget = new BudgetMensuelModel('c1_2026_03', 'Budget');

            expect(estBudgetDuMois(budget, new Date(2026, 2, 1))).toBe(true);
        });

        test('mois absent : repli sur l\'id, mois différent', () => {
            const budget = new BudgetMensuelModel('c1_2025_11', 'Budget');

            expect(estBudgetDuMois(budget, new Date(2026, 2, 1))).toBe(false);
        });

        test('ni champs ni id exploitable : inerte (true, pas de bandeau à tort)', () => {
            const budget = new BudgetMensuelModel('analyses-consolide', 'Budget');

            expect(estBudgetDuMois(budget, new Date(2026, 2, 1))).toBe(true);
        });

        test('mois non reconnu (chaîne inattendue) : repli sur l\'id', () => {
            const budget = new BudgetMensuelModel('c1_2026_03', 'Budget');
            budget.mois = 'NIMPORTEQUOI';
            budget.annee = 2026;

            expect(estBudgetDuMois(budget, new Date(2026, 2, 1))).toBe(true);
        });
    });

    describe('libelleMoisAnneeBudget', () => {

        test('mois/annee renseignés (forme nom Java)', () => {
            const budget = new BudgetMensuelModel('ignore', 'Budget');
            budget.mois = 'NOVEMBER';
            budget.annee = 2025;

            expect(libelleMoisAnneeBudget(budget)).toBe('11/2025');
        });

        test('mois/annee renseignés (forme numérique)', () => {
            const budget = new BudgetMensuelModel('ignore', 'Budget');
            budget.mois = 1;
            budget.annee = 2026;

            expect(libelleMoisAnneeBudget(budget)).toBe('01/2026');
        });

        test('mois absent : repli sur le suffixe de l\'id', () => {
            const budget = new BudgetMensuelModel('c1_2025_11', 'Budget');

            expect(libelleMoisAnneeBudget(budget)).toBe('11/2025');
        });

        test('ni champs ni id exploitable : chaîne vide', () => {
            const budget = new BudgetMensuelModel('analyses-consolide', 'Budget');

            expect(libelleMoisAnneeBudget(budget)).toBe('');
        });
    });
});
