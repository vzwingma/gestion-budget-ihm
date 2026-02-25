import {extractUniqueCategories, getMonthYearFromOperation, prepareGraphDataFromOperations} from './AnalyseEvolution.controller.ts';
import {OPERATION_ETATS_ENUM} from '../../../Utils/AppBusinessEnums.constants.ts';

describe('AnalyseEvolution.controller', () => {

    test('retourne mois/année courant si date absente', () => {
        const [month, year] = getMonthYearFromOperation({autresInfos: {dateOperation: null}} as any);

        expect(month).toBeGreaterThanOrEqual(0);
        expect(year).toBeGreaterThan(2000);
    });

    test('prépare la vue mensuelle (date courante vs fin de mois)', () => {
        const operations = [
            {categorie: {libelle: 'Courses'}, valeur: 100, etat: OPERATION_ETATS_ENUM.REALISEE},
            {categorie: {libelle: 'Courses'}, valeur: 50, etat: OPERATION_ETATS_ENUM.PREVUE}
        ] as any[];

        const result = prepareGraphDataFromOperations(operations as any, true);

        expect(result).toHaveLength(2);
        expect(result[0].Courses).toBe(100);
        expect(result[1].Courses).toBe(150);
    });

    test('prépare la vue période regroupée par mois', () => {
        const operations = [
            {categorie: {libelle: 'Achat'}, valeur: 10, autresInfos: {dateOperation: '2026-01-10'}},
            {categorie: {libelle: 'Achat'}, valeur: 15, autresInfos: {dateOperation: '2026-01-20'}},
            {categorie: {libelle: 'Salaire'}, valeur: 1000, autresInfos: {dateOperation: '2026-02-05'}}
        ] as any[];

        const result = prepareGraphDataFromOperations(operations as any, false);

        expect(result.length).toBeGreaterThanOrEqual(2);
        expect(result.some(item => item.Achat === 25)).toBeTruthy();
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
