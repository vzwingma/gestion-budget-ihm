import {extractUniqueCategories, getMonthYearFromOperation, prepareGraphDataFromOperations} from './AnalyseEvolution.controller.ts';
import {OPERATION_ETATS_ENUM} from '../../../Utils/AppBusinessEnums.constants.ts';
import BudgetMensuelAnalyseConsolideModel from "../../../Models/budgets/BudgetMensuel.analyse.consolide.model.ts";

describe('AnalyseEvolution.controller', () => {

    test('retourne mois/année courant si date absente', () => {
        const [month, year] = getMonthYearFromOperation({autresInfos: {dateOperation: null}} as any);

        expect(month).toBeGreaterThanOrEqual(0);
        expect(year).toBeGreaterThan(2000);
    });

    test('prépare la vue mensuelle (date courante vs fin de mois)', () => {
        const operations = [
            {categorie: {libelle: 'Courses'}, valeur: 100, etat: OPERATION_ETATS_ENUM.REALISEE, autresInfos: {dateOperation: '2026-01-15'}},
            {categorie: {libelle: 'Courses'}, valeur: 50, etat: OPERATION_ETATS_ENUM.PREVUE, autresInfos: {dateOperation: '2026-01-20'}}
        ] as any[];

        const budgetConsolide = new BudgetMensuelAnalyseConsolideModel('test-budget');
        budgetConsolide.soldesParMois = {
            '2026-01': {
                soldeAtMaintenant: 500,
                soldeAtFinMoisCourant: 450,
                soldeAtFinMoisPrecedent: 600
            }
        };
        
        const result = prepareGraphDataFromOperations(budgetConsolide, operations as any, true);

        expect(result).toHaveLength(2);
        expect(result[0].Courses).toBe(100);
        expect(result[1].Courses).toBe(150);
        // Vérifier les soldes
        expect(result[0].solde).toBe(500); // currentDateData: soldeAtMaintenant
        expect(result[1].solde).toBe(450); // endOfMonthData: soldeAtFinMoisCourant
    });

    test('prépare la vue période regroupée par mois', () => {
        const operations = [
            {categorie: {libelle: 'Achat'}, valeur: 10, autresInfos: {dateOperation: '2026-01-10'}},
            {categorie: {libelle: 'Achat'}, valeur: 15, autresInfos: {dateOperation: '2026-01-20'}},
            {categorie: {libelle: 'Salaire'}, valeur: 1000, autresInfos: {dateOperation: '2026-02-05'}}
        ] as any[];

        const budgetConsolide = new BudgetMensuelAnalyseConsolideModel('test-budget');
        const result = prepareGraphDataFromOperations(budgetConsolide, operations as any, false);

        expect(result.length).toBeGreaterThanOrEqual(2);
        expect(result.some(item => item.Achat === 25)).toBeTruthy();
    });

    test('prépare la vue période avec évolution des soldes', () => {
        const operations = [
            {categorie: {libelle: 'Achat'}, valeur: 10, autresInfos: {dateOperation: '2026-01-10'}},
            {categorie: {libelle: 'Salaire'}, valeur: 1000, autresInfos: {dateOperation: '2026-02-05'}}
        ] as any[];

        const budgetConsolide = new BudgetMensuelAnalyseConsolideModel('test-budget');
        budgetConsolide.soldesParMois = {
            '2026-01': {
                soldeAtMaintenant: 100,
                soldeAtFinMoisCourant: 150,
                soldeAtFinMoisPrecedent: 50
            },
            '2026-02': {
                soldeAtMaintenant: 1100,
                soldeAtFinMoisCourant: 1150,
                soldeAtFinMoisPrecedent: 150
            }
        };

        const result = prepareGraphDataFromOperations(budgetConsolide, operations as any, false);

        expect(result.length).toBe(2);
        // Premier mois: utilise soldeAtFinMoisPrecedent
        expect(result[0].solde).toBe(50);
        // Deuxième mois: utilise soldeAtFinMoisCourant
        expect(result[1].solde).toBe(1150);
    });

    test('extrait les catégories uniques', () => {
        const operations = [
            {categorie: {id: 'c1', libelle: 'Achat'}},
            {categorie: {id: 'c1', libelle: 'Achat'}},
            {categorie: {id: 'c2', libelle: 'Salaire'}}
        ] as any[];

        const result = extractUniqueCategories(operations as any);

        expect(result).toHaveLength(2);
    });
});
