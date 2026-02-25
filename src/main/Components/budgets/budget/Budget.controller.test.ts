import {getOperationsGroupedByDateOperation, populateAllCategories, updateOperationsStatus} from './Budget.controller.ts';
import {OPERATION_ETATS_ENUM, OPERATION_STATUS_ENUM} from '../../../Utils/AppBusinessEnums.constants.ts';

describe('Budget.controller', () => {

    test('met à jour le statut EN_RETARD et nettoie le libellé legacy', () => {
        const operations = [{libelle: `${OPERATION_STATUS_ENUM.EN_RETARD_LEGACY} Facture`, statuts: []}] as any[];

        updateOperationsStatus(operations as any);

        expect(operations[0].statuts).toContain(OPERATION_STATUS_ENUM.EN_RETARD);
        expect(operations[0].libelle).toBe(' Facture');
    });

    test('groupe les opérations par date et ignore les planifiées', () => {
        const operations = [
            {
                etat: OPERATION_ETATS_ENUM.REALISEE,
                autresInfos: {dateOperation: '2026-02-20T00:00:00.000Z'}
            },
            {
                etat: OPERATION_ETATS_ENUM.PLANIFIEE,
                autresInfos: {dateOperation: '2026-02-21T00:00:00.000Z'}
            },
            {
                etat: OPERATION_ETATS_ENUM.PREVUE,
                autresInfos: {dateOperation: null}
            }
        ] as any[];

        const grouped = getOperationsGroupedByDateOperation(operations as any);

        expect(Object.keys(grouped).length).toBe(2);
        expect(grouped.null).toHaveLength(1);
    });

    test('rattache la catégorie parente aux sous-catégories', () => {
        const categories = [
            {
                id: 'cat-1',
                libelle: 'Catégorie 1',
                listeSSCategories: [{id: 'ss-1', libelle: 'Sous 1'}]
            }
        ] as any[];

        const result = populateAllCategories(categories as any);

        expect(result[0].listeSSCategories[0].categorieParente).toBe(result[0]);
    });
});
