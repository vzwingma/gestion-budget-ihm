import {useAnalyseTreeMapData} from './AnalyseTreeMap.controller.ts';
import AnalyseCategoriesModel from '../../../Models/analyses/syntheses/AnalyseCategories.model.ts';
import CategorieOperationModel from '../../../Models/budgets/CategorieOperation.model.ts';

describe('AnalyseTreeMap.controller', () => {

    test('retourne vide sans données', () => {
        expect(useAnalyseTreeMapData([], null)).toEqual({treemapData: [], selectedCategory: null});
    });

    test('retourne la vue globale triée par pourcentage', () => {
        const data = [
            {
                categorie: {id: 'c1', libelle: 'Cat 1'},
                pourcentage: 20,
                couleurCategorie: '#ff0000',
                total: 10,
                nbTransactions: 1,
                resumesSsCategories: {}
            },
            {
                categorie: {id: 'c2', libelle: 'Cat 2'},
                pourcentage: 50,
                couleurCategorie: '#00ff00',
                total: 20,
                nbTransactions: 2,
                resumesSsCategories: {}
            }
        ] as unknown as AnalyseCategoriesModel[];

        const result = useAnalyseTreeMapData(data, null);

        expect(result.treemapData).toHaveLength(2);
        expect(result.treemapData[0].categoryId).toBe('c2');
        expect(result.selectedCategory).toBeNull();
    });

    test('retourne les sous-catégories de la catégorie sélectionnée', () => {
        const data = [
            {
                categorie: {id: 'c1', libelle: 'Cat 1'},
                pourcentage: 100,
                couleurCategorie: '#ff0000',
                total: 10,
                nbTransactions: 1,
                resumesSsCategories: {
                    a: {ssCategorie: {libelle: 'Zeta'}, pourcentage: 10, total: 1, nbTransactions: 1},
                    b: {ssCategorie: {libelle: 'Alpha'}, pourcentage: 90, total: 9, nbTransactions: 2}
                }
            }
        ] as unknown as AnalyseCategoriesModel[];

        const result = useAnalyseTreeMapData(data, [{id: 'c1'}] as unknown as CategorieOperationModel[]);

        expect(result.treemapData).toHaveLength(2);
        expect(result.treemapData[0].name).toBe('Alpha');
        expect(result.selectedCategory?.id).toBe('c1');
    });
});
