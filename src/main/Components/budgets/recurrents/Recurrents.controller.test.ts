import {getOperationsRecurrentesGroupedByPeriodicity} from './Recurrents.controller.ts';
import {OPERATION_STATUS_ENUM, PERIODES_MENSUALITE_ENUM} from '../../../Utils/AppBusinessEnums.constants.ts';

jest.mock('../../../Utils/OperationData.utils.ts', () => ({
    sortPeriodicOperations: jest.fn(() => 0)
}));

jest.mock('../operations/recurrentes/details/OperationRecurrenteDetailPage.constants.ts', () => ({
    isDerniereEcheanceRO: jest.fn((operation: { id: string }) => operation.id === 'op-last')
}));

describe('Recurrents.controller', () => {

    test('retourne vide si liste vide ou nulle', () => {
        expect(getOperationsRecurrentesGroupedByPeriodicity([], 'b1')).toEqual({});
        expect(getOperationsRecurrentesGroupedByPeriodicity(null as any, 'b1')).toEqual({});
    });

    test('groupe les opérations récurrentes par période et calcule le statut', () => {
        const operations = [
            {id: 'op-1', mensualite: {periode: PERIODES_MENSUALITE_ENUM.MENSUELLE}, statuts: []},
            {id: 'op-last', mensualite: {periode: PERIODES_MENSUALITE_ENUM.MENSUELLE}, statuts: []},
            {id: 'op-2', mensualite: {periode: PERIODES_MENSUALITE_ENUM.ANNUELLE}, statuts: []},
            {id: 'op-ponctuelle', mensualite: {periode: PERIODES_MENSUALITE_ENUM.PONCTUELLE}, statuts: []}
        ] as any[];

        const grouped = getOperationsRecurrentesGroupedByPeriodicity(operations as any, 'budget-1');

        expect(Object.keys(grouped)).toEqual(expect.arrayContaining([PERIODES_MENSUALITE_ENUM.MENSUELLE, PERIODES_MENSUALITE_ENUM.ANNUELLE]));
        expect(grouped[PERIODES_MENSUALITE_ENUM.MENSUELLE]).toHaveLength(2);
        expect(grouped[PERIODES_MENSUALITE_ENUM.ANNUELLE]).toHaveLength(1);
        expect(grouped[PERIODES_MENSUALITE_ENUM.MENSUELLE].find(op => op.id === 'op-last')?.statuts)
            .toBeDefined();
    });
});
