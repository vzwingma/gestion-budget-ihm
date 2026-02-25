import {getDefaultAnalysesFilters} from './AnalysesFilters.model.ts';
import AnalyseCategoriesModel from './syntheses/AnalyseCategories.model.ts';
import AnalyseSsCategoriesModel from './syntheses/AnalyseSsCategories.model.ts';
import AnalyseSoldesCategorie from './syntheses/AnalyseSoldesCategorie.model.ts';
import {OPERATION_ETATS_ENUM, TYPES_CATEGORIES_OPERATION_ENUM, TYPES_OPERATION_ENUM} from '../../Utils/AppBusinessEnums.constants.ts';

describe('Analyses models', () => {

    test('retourne les filtres analyses par défaut', () => {
        const filters = getDefaultAnalysesFilters();

        expect(filters.selectedTypes).toContain(TYPES_CATEGORIES_OPERATION_ENUM.ESSENTIEL);
        expect(filters.selectedOperationEtats).toEqual([OPERATION_ETATS_ENUM.PREVUE, OPERATION_ETATS_ENUM.REALISEE]);
        expect(filters.selectedOperationTypes).toEqual([TYPES_OPERATION_ENUM.DEPENSE, TYPES_OPERATION_ENUM.CREDIT]);
        expect(filters.selectedCategories).toEqual([]);
        expect(filters.selectedSubcategories).toEqual([]);
    });

    test('initialise AnalyseCategoriesModel avec les valeurs par défaut', () => {
        const model = new AnalyseCategoriesModel();

        expect(model.categorie.id).toBe('defaultId');
        expect(model.couleurCategorie).toBe('#808080');
        expect(model.nbTransactions).toBe(0);
        expect(model.total).toBe(0);
        expect(model.resumesSsCategories).toEqual({});
    });

    test('initialise AnalyseSsCategoriesModel avec les valeurs par défaut', () => {
        const model = new AnalyseSsCategoriesModel();

        expect(model.ssCategorie.id).toBe('defaultId');
        expect(model.couleurSsCategorie).toBe('#808080');
        expect(model.nbTransactions).toBe(0);
        expect(model.total).toBe(0);
    });

    test('initialise AnalyseSoldesCategorie via son constructeur', () => {
        const model = new AnalyseSoldesCategorie('Essentiel', 250, 200, 2, 2026);

        expect(model.libelleCategorie).toBe('Essentiel');
        expect(model.totalAtFinMoisCourant).toBe(250);
        expect(model.totalAtMaintenant).toBe(200);
        expect(model.mois).toBe(2);
        expect(model.annee).toBe(2026);
    });
});
