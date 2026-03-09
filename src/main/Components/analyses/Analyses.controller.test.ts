import {applyFiltersToOperations, loadBudgetsPeriodes} from './Analyses.controller.ts';
import {loadBudget} from './Analyses.extservices.ts';
import {toast} from 'react-toastify';

jest.mock('./Analyses.extservices.ts', () => ({
    loadBudget: jest.fn()
}));

jest.mock('react-toastify', () => ({
    toast: {
        error: jest.fn()
    }
}));

const flushPromises = () => new Promise(resolve => setTimeout(resolve, 0));

describe('Analyses.controller', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('retourne une erreur si aucun compte n est sélectionné', () => {
        loadBudgetsPeriodes(null, {periodeDebut: new Date('2026-01-01'), periodeFin: new Date('2026-02-01')} as any, jest.fn());

        expect(toast.error).toHaveBeenCalledTimes(1);
        expect(loadBudget).not.toHaveBeenCalled();
    });

    test('charge les budgets de la période et consolide les opérations', async () => {
        const handleDataCalculationResult = jest.fn();
        (loadBudget as jest.Mock)
            .mockResolvedValueOnce({
                listeOperations: [{categorie: {id: 'c2', libelle: 'B'}, autresInfos: {dateOperation: new Date('2026-01-15')}}],
                soldes: {
                    soldeAtMaintenant: 100,
                    soldeAtFinMoisCourant: 120,
                    soldeAtFinMoisPrecedent: 80
                }
            })
            .mockResolvedValueOnce({
                listeOperations: [{categorie: {id: 'c1', libelle: 'A'}, autresInfos: {dateOperation: new Date('2026-02-10')}}],
                soldes: {
                    soldeAtMaintenant: 200,
                    soldeAtFinMoisCourant: 220,
                    soldeAtFinMoisPrecedent: 180
                }
            });

        loadBudgetsPeriodes(
            {id: 'compte-1', libelle: 'Compte 1'} as any,
            {periodeDebut: new Date('2026-01-01'), periodeFin: new Date('2026-02-01')} as any,
            handleDataCalculationResult
        );
        await flushPromises();
        await flushPromises();

        expect(loadBudget).toHaveBeenCalledTimes(2);
        expect(handleDataCalculationResult).toHaveBeenCalledTimes(1);
        expect(handleDataCalculationResult.mock.calls[0][0].listeOperations).toHaveLength(2);
        expect(handleDataCalculationResult.mock.calls[0][0].soldesParMois).toEqual({
            '2026-01': {
                soldeAtMaintenant: 100,
                soldeAtFinMoisCourant: 120,
                soldeAtFinMoisPrecedent: 80
            },
            '2026-02': {
                soldeAtMaintenant: 200,
                soldeAtFinMoisCourant: 220,
                soldeAtFinMoisPrecedent: 180
            }
        });
        expect(handleDataCalculationResult.mock.calls[0][1].map((cat: { libelle: string }) => cat.libelle)).toEqual(['A', 'B']);
    });

    test('applique les filtres sur les opérations', () => {
        const operations = [
            {
                ssCategorie: {type: 'ESSENTIEL'},
                etat: 'REALISEE',
                typeOperation: 'DEPENSE',
                categorie: {id: 'cat-1'}
            },
            {
                ssCategorie: {type: 'PLAISIR'},
                etat: 'PREVUE',
                typeOperation: 'CREDIT',
                categorie: {id: 'cat-2'}
            }
        ] as any[];

        const filters = {
            selectedTypes: ['ESSENTIEL'],
            selectedOperationEtats: ['REALISEE'],
            selectedOperationTypes: ['DEPENSE'],
            selectedCategories: [{id: 'cat-1'}]
        } as any;

        const filtered = applyFiltersToOperations(operations as any, filters);

        expect(filtered).toHaveLength(1);
        expect(filtered[0].categorie.id).toBe('cat-1');
    });
});
