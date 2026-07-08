import type { Mock } from 'vitest';
import {getSoldesBudget} from './CompteItem.controller.ts';
import * as ClientHTTP from '../../../Services/ClientHTTP.service.ts';

vi.mock('../../../Services/ClientHTTP.service.ts', () => ({
    call: vi.fn()
}));

const flushPromises = () => new Promise(resolve => setTimeout(resolve, 0));

describe('CompteItem.controller', () => {

    beforeEach(() => {
        vi.clearAllMocks();
    });

    test('met à jour les soldes avec la valeur backend', async () => {
        const setSoldes = vi.fn();
        (ClientHTTP.call as Mock).mockResolvedValue([{soldes: {soldeAtMaintenant: 123.45}}]);

        getSoldesBudget({id: 'c1', libelle: 'Compte 1'} as any, new Date('2026-02-01'), setSoldes as any);
        await flushPromises();

        expect(setSoldes).toHaveBeenCalledWith(123.45);
    });

    test('met les soldes à null si backend vide', async () => {
        const setSoldes = vi.fn();
        (ClientHTTP.call as Mock).mockResolvedValue([]);

        getSoldesBudget({id: 'c1', libelle: 'Compte 1'} as any, new Date('2026-02-01'), setSoldes as any);
        await flushPromises();

        expect(setSoldes).toHaveBeenCalledWith(null);
    });

    test('met les soldes à undefined en cas d erreur', async () => {
        const setSoldes = vi.fn();
        (ClientHTTP.call as Mock).mockRejectedValue(new Error('ko'));

        getSoldesBudget({id: 'c1', libelle: 'Compte 1'} as any, new Date('2026-02-01'), setSoldes as any);
        await flushPromises();

        expect(setSoldes).toHaveBeenCalledWith(undefined);
    });

    test('ne fait rien si compte ou date manquant', () => {
        const setSoldes = vi.fn();

        getSoldesBudget(null as any, new Date('2026-02-01'), setSoldes as any);
        getSoldesBudget({id: 'c1'} as any, null as any, setSoldes as any);

        expect(ClientHTTP.call).not.toHaveBeenCalled();
    });
});
