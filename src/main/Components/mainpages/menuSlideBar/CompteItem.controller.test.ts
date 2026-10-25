import type { Mock } from 'vitest';
import {fetchSoldesBudget} from './CompteItem.controller.ts';
import * as ClientHTTP from '../../../Services/ClientHTTP.service.ts';

vi.mock('../../../Services/ClientHTTP.service.ts', () => ({
    call: vi.fn()
}));

describe('CompteItem.controller', () => {

    beforeEach(() => {
        vi.clearAllMocks();
    });

    test('résout avec le solde à maintenant du backend (mois 1-based dans l appel)', async () => {
        (ClientHTTP.call as Mock).mockResolvedValue([{soldes: {soldeAtMaintenant: 123.45}}]);

        await expect(fetchSoldesBudget({id: 'c1', libelle: 'Compte 1'} as any, new Date(2026, 1, 1))).resolves.toBe(123.45);
        expect((ClientHTTP.call as Mock).mock.calls[0][3]).toEqual(['c1', '2026', '2']);
    });

    test('résout avec null si le backend renvoie une liste vide', async () => {
        (ClientHTTP.call as Mock).mockResolvedValue([]);

        await expect(fetchSoldesBudget({id: 'c1', libelle: 'Compte 1'} as any, new Date(2026, 1, 1))).resolves.toBeNull();
    });

    test('log puis rejette en cas d erreur backend', async () => {
        const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
        (ClientHTTP.call as Mock).mockRejectedValue(new Error('ko'));

        await expect(fetchSoldesBudget({id: 'c1', libelle: 'Compte 1'} as any, new Date(2026, 1, 1))).rejects.toThrow('ko');
        expect(spy).toHaveBeenCalled();
        spy.mockRestore();
    });

    test('résout avec undefined sans appel réseau si compte ou date manquant', async () => {
        await expect(fetchSoldesBudget(null as any, new Date(2026, 1, 1))).resolves.toBeUndefined();
        await expect(fetchSoldesBudget({id: 'c1'} as any, null as any)).resolves.toBeUndefined();

        expect(ClientHTTP.call).not.toHaveBeenCalled();
    });
});
