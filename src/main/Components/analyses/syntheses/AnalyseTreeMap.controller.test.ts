import {useAnalyseTreeMapData} from './AnalyseTreeMap.controller.ts';

describe('AnalyseTreeMap.controller', () => {

    test('retourne vide sans données', () => {
        expect(useAnalyseTreeMapData([], null)).toEqual({treemapData: [], selectedCategoryName: null});
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
        ] as any[];

        const result = useAnalyseTreeMapData(data as any, null);

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
        ] as any[];

        const result = useAnalyseTreeMapData(data as any, [{id: 'c1'}] as any);

        expect(result.treemapData).toHaveLength(2);
        expect(result.treemapData[0].name).toBe('Alpha');
        expect(result.selectedCategory.id).toBe('c1');
    });
});
