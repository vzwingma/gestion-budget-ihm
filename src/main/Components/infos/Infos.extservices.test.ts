import type { Mock } from 'vitest';
import {getInfosFromMicroServices} from './Infos.extservices.ts';
import {call} from '../../Services/ClientHTTP.service.ts';

vi.mock('../../Services/ClientHTTP.service.ts', () => ({
    call: vi.fn()
}));

const flushPromises = () => new Promise(resolve => setTimeout(resolve, 0));

describe('Infos.extservices', () => {

    beforeEach(() => {
        vi.clearAllMocks();
    });

    test('agrège les infos des microservices', async () => {
        const setInfos = vi.fn();
        (call as Mock).mockResolvedValue({nom: 'MS', version: '1.0.0'});

        getInfosFromMicroServices(setInfos);
        await flushPromises();

        expect(call).toHaveBeenCalledTimes(4);
        expect(setInfos).toHaveBeenCalledTimes(1);
        expect(setInfos.mock.calls[0][0]).toHaveLength(4);
    });

    test('ajoute une entrée N/A en cas d erreur', async () => {
        const setInfos = vi.fn();
        (call as Mock).mockRejectedValue(new Error('down'));

        getInfosFromMicroServices(setInfos);
        await flushPromises();

        expect(call).toHaveBeenCalledTimes(4);
        expect(setInfos).toHaveBeenCalledTimes(1);
        expect(setInfos.mock.calls[0][0].every((ms: { version: string }) => ms.version === 'N/A')).toBeTruthy();
    });
});
