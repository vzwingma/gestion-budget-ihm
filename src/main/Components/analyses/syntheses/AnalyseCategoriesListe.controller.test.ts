import {
    COLUMN_WIDTHS,
    getCategoriesDataForAnalyses,
    getCategoryTypeColor,
    getSortedSubCategories
} from './AnalyseCategoriesListe.controller.ts';
import {TYPES_CATEGORIES_OPERATION_ENUM} from '../../../Utils/AppBusinessEnums.constants.ts';

jest.mock('../../../Utils/renderers/CategorieItem.renderer.tsx', () => ({
    getCategorieColor: jest.fn((id: string) => `color-${id}`)
}));

describe('AnalyseCategoriesListe.controller', () => {

    test('retourne une couleur par défaut si type absent', () => {
        expect(getCategoryTypeColor(null)).toBe('#999999');
    });

    test('retourne une couleur css variable pour un type', () => {
        expect(getCategoryTypeColor(TYPES_CATEGORIES_OPERATION_ENUM.ESSENTIEL)).toBe('var(--color-type-essentiel-primary)');
    });

    test('retourne les sous-catégories triées par libellé', () => {
        const category = {
            resumesSsCategories: {
                b: {ssCategorie: {libelle: 'B'}},
                a: {ssCategorie: {libelle: 'A'}}
            }
        } as any;

        const sorted = getSortedSubCategories(category as any);

        expect(sorted[0].ssCategorie.libelle).toBe('A');
        expect(sorted[1].ssCategorie.libelle).toBe('B');
    });

    test('groupe les opérations par catégories/sous-catégories', () => {
        const operations = [
            {categorie: {id: 'c1', libelle: 'Alim'}, ssCategorie: {id: 's1', libelle: 'Courses'}, valeur: 10},
            {categorie: {id: 'c1', libelle: 'Alim'}, ssCategorie: {id: 's1', libelle: 'Courses'}, valeur: 20},
            {categorie: {id: 'c2', libelle: 'Loisir'}, ssCategorie: {id: 's2', libelle: 'Cinéma'}, valeur: -5}
        ] as any[];

        const result = getCategoriesDataForAnalyses(operations as any);

        expect(result).toHaveLength(2);
        expect(result[0].categorie.libelle).toBe('Alim');
        expect(result[0].nbTransactions).toBe(2);
        expect(result[0].total).toBe(30);
        expect(Object.values(result[0].resumesSsCategories)[0].nbTransactions).toBe(2);
    });

    test('expose les largeurs de colonnes attendues', () => {
        expect(COLUMN_WIDTHS.libelle).toBe('34%');
    });
});
