import type { Mock } from 'vitest';
import {getValidPeriodesForCompte, loadBudget} from './Analyses.extservices.ts';
import {call} from '../../Services/ClientHTTP.service.ts';
import { toast } from 'react-toastify';
import CompteBancaireModel from '../../Models/budgets/CompteBancaire.model.ts';

vi.mock('../../Services/ClientHTTP.service.ts', () => ({
    call: vi.fn()
}));
vi.mock('react-toastify', () => ({ toast: { error: vi.fn() } }));

describe('Analyses.extservices', () => {

    beforeEach(() => {
        vi.clearAllMocks();
    });

    test('charge le budget pour un compte et une date', async () => {
        (call as Mock).mockResolvedValue({id: 'b1'});

        await expect(loadBudget({id: 'c1', libelle: 'Compte'} as CompteBancaireModel, new Date('2026-01-10')))
            .resolves.toEqual({id: 'b1'});
        expect(call).toHaveBeenCalledTimes(1);
    });

    test('retourne une période valide quand la réponse contient 2 dates', async () => {
        (call as Mock).mockResolvedValue(['2026-01-01T00:00:00.000Z', '2026-01-31T00:00:00.000Z']);

        const result = await getValidPeriodesForCompte({id: 'c1', libelle: 'Compte'} as CompteBancaireModel);

        expect(result).toHaveLength(1);
        expect(result?.[0].debut).toEqual(new Date('2026-01-01T00:00:00.000Z'));
        expect(result?.[0].fin.getTime()).toBeGreaterThan(result?.[0].debut.getTime() ?? 0);
    });

    test('loadBudget sans compte ou sans date : undefined, aucun appel', async () => {
        await expect(loadBudget(null, new Date(2026, 0, 1))).resolves.toBeUndefined();
        await expect(loadBudget({id: 'c1', libelle: 'Compte'} as CompteBancaireModel, null as unknown as Date)).resolves.toBeUndefined();
        expect(call).not.toHaveBeenCalled();
    });

    test('loadBudget en échec : toast d erreur et undefined', async () => {
        const erreurConsole = vi.spyOn(console, 'error').mockImplementation(() => {});
        (call as Mock).mockRejectedValue(new Error('500'));

        await expect(loadBudget({id: 'c1', libelle: 'Compte'} as CompteBancaireModel, new Date(2026, 0, 10))).resolves.toBeUndefined();

        expect(toast.error).toHaveBeenCalledWith(expect.stringContaining('Compte'), expect.anything());
        expect(erreurConsole).toHaveBeenCalled();
        erreurConsole.mockRestore();
    });

    test('getValidPeriodesForCompte : réponse inattendue -> tableau vide', async () => {
        (call as Mock).mockResolvedValue(['pas une date', '2026-01-31T00:00:00.000Z']);

        await expect(getValidPeriodesForCompte({id: 'c1', libelle: 'Compte'} as CompteBancaireModel)).resolves.toEqual([]);
    });

    test('getValidPeriodesForCompte en échec : toast d erreur', async () => {
        const erreurConsole = vi.spyOn(console, 'error').mockImplementation(() => {});
        (call as Mock).mockRejectedValue(new Error('500'));

        await getValidPeriodesForCompte({id: 'c1', libelle: 'Compte'} as CompteBancaireModel);

        expect(toast.error).toHaveBeenCalledWith(expect.stringContaining('Compte'), expect.anything());
        erreurConsole.mockRestore();
    });

    test('retourne un tableau vide quand aucun compte n est sélectionné', async () => {
        const result = await getValidPeriodesForCompte(null);

        expect(result).toEqual([]);
        expect(call).not.toHaveBeenCalled();
    });
});
