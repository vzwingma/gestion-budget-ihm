import {getValidPeriodesForCompte, loadBudget} from './Analyses.extservices.ts';
import {call} from '../../Services/ClientHTTP.service.ts';

jest.mock('../../Services/ClientHTTP.service.ts', () => ({
    call: jest.fn()
}));

describe('Analyses.extservices', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('charge le budget pour un compte et une date', async () => {
        (call as jest.Mock).mockResolvedValue({id: 'b1'});

        await expect(loadBudget({id: 'c1', libelle: 'Compte'} as any, new Date('2026-01-10')))
            .resolves.toEqual({id: 'b1'});
        expect(call).toHaveBeenCalledTimes(1);
    });

    test('retourne une période valide quand la réponse contient 2 dates', async () => {
        (call as jest.Mock).mockResolvedValue(['2026-01-01T00:00:00.000Z', '2026-01-31T00:00:00.000Z']);

        const result = await getValidPeriodesForCompte({id: 'c1', libelle: 'Compte'} as any);

        expect(result).toHaveLength(1);
        expect(result?.[0].debut).toEqual(new Date('2026-01-01T00:00:00.000Z'));
        expect(result?.[0].fin.getTime()).toBeGreaterThan(result?.[0].debut.getTime() ?? 0);
    });

    test('retourne un tableau vide quand aucun compte n est sélectionné', async () => {
        const result = await getValidPeriodesForCompte(null);

        expect(result).toEqual([]);
        expect(call).not.toHaveBeenCalled();
    });
});
