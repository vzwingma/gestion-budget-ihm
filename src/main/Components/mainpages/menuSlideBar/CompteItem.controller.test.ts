import {getSoldesBudget} from './CompteItem.controller.ts';
import * as ClientHTTP from '../../../Services/ClientHTTP.service.ts';

jest.mock('../../../Services/ClientHTTP.service.ts', () => ({
    call: jest.fn()
}));

const flushPromises = () => new Promise(resolve => setTimeout(resolve, 0));

describe('CompteItem.controller', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('met à jour les soldes avec la valeur backend', async () => {
        const setSoldes = jest.fn();
        (ClientHTTP.call as jest.Mock).mockResolvedValue([{soldes: {soldeAtMaintenant: 123.45}}]);

        getSoldesBudget({id: 'c1', libelle: 'Compte 1'} as any, new Date('2026-02-01'), setSoldes as any);
        await flushPromises();

        expect(setSoldes).toHaveBeenCalledWith(123.45);
    });

    test('met les soldes à null si backend vide', async () => {
        const setSoldes = jest.fn();
        (ClientHTTP.call as jest.Mock).mockResolvedValue([]);

        getSoldesBudget({id: 'c1', libelle: 'Compte 1'} as any, new Date('2026-02-01'), setSoldes as any);
        await flushPromises();

        expect(setSoldes).toHaveBeenCalledWith(null);
    });

    test('met les soldes à undefined en cas d erreur', async () => {
        const setSoldes = jest.fn();
        (ClientHTTP.call as jest.Mock).mockRejectedValue(new Error('ko'));

        getSoldesBudget({id: 'c1', libelle: 'Compte 1'} as any, new Date('2026-02-01'), setSoldes as any);
        await flushPromises();

        expect(setSoldes).toHaveBeenCalledWith(undefined);
    });

    test('ne fait rien si compte ou date manquant', () => {
        const setSoldes = jest.fn();

        getSoldesBudget(null as any, new Date('2026-02-01'), setSoldes as any);
        getSoldesBudget({id: 'c1'} as any, null as any, setSoldes as any);

        expect(ClientHTTP.call).not.toHaveBeenCalled();
    });
});
