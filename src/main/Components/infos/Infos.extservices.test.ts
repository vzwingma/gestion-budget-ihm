import type { Mock } from 'vitest';
import {fetchInfosFromMicroServices} from './Infos.extservices.ts';
import {call} from '../../Services/ClientHTTP.service.ts';

vi.mock('../../Services/ClientHTTP.service.ts', () => ({
    call: vi.fn()
}));

describe('Infos.extservices', () => {

    beforeEach(() => {
        vi.clearAllMocks();
    });

    test('agrège les infos des 4 microservices', async () => {
        (call as Mock).mockResolvedValue({nom: 'MS', version: '1.0.0'});

        const infos = await fetchInfosFromMicroServices();

        expect(call).toHaveBeenCalledTimes(4);
        expect(infos).toHaveLength(4);
        expect(infos.every(ms => ms.version === '1.0.0')).toBeTruthy();
    });

    test('ajoute une entrée N/A (nom du µS) en cas d erreur, sans rejeter', async () => {
        const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
        (call as Mock).mockRejectedValue(new Error('down'));

        const infos = await fetchInfosFromMicroServices();

        expect(infos).toHaveLength(4);
        expect(infos.every(ms => ms.version === 'N/A')).toBeTruthy();
        expect(infos.map(ms => ms.nom)).toContain('API Comptes');
        spy.mockRestore();
    });

    test('une erreur partielle ne dégrade que le µS concerné', async () => {
        const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
        (call as Mock)
            .mockResolvedValueOnce({nom: 'MS1', version: '1.0.0'})
            .mockRejectedValueOnce(new Error('down'))
            .mockResolvedValue({nom: 'MS', version: '2.0.0'});

        const infos = await fetchInfosFromMicroServices();

        expect(infos.filter(ms => ms.version === 'N/A')).toHaveLength(1);
        expect(infos).toHaveLength(4);
        spy.mockRestore();
    });
});
