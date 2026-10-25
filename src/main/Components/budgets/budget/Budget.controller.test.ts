import {GROUPE_A_VALIDER, getOperationsGroupedByDateOperation, populateAllCategories, updateOperationsStatus} from './Budget.controller.ts';
import {getLabelFRFromDate} from '../../../Utils/Date.utils.ts';
import {OPERATION_ETATS_ENUM, OPERATION_STATUS_ENUM} from '../../../Utils/AppBusinessEnums.constants.ts';

describe('Budget.controller', () => {

    test('met à jour le statut EN_RETARD et nettoie le libellé legacy', () => {
        const operations = [{libelle: `${OPERATION_STATUS_ENUM.EN_RETARD_LEGACY} Facture`, statuts: []}] as any[];

        updateOperationsStatus(operations as any);

        expect(operations[0].statuts).toContain(OPERATION_STATUS_ENUM.EN_RETARD);
        expect(operations[0].libelle).toBe(' Facture');
    });

    describe('getOperationsGroupedByDateOperation', () => {
        const ope = (id: string, etat: OPERATION_ETATS_ENUM, date: Date | null) =>
            ({id, etat, valeur: -1, autresInfos: {dateOperation: date}}) as any;
        const ids = (ops: any[] | undefined) => (ops ?? []).map(o => o.id);
        const d20 = new Date(2026, 1, 20, 12);
        const d19 = new Date(2026, 1, 19, 12);
        const lbl = (d: Date) => getLabelFRFromDate(d);

        test('groupe par date, ignore les planifiées, REALISEE sans date sous "null"', () => {
            const grouped = getOperationsGroupedByDateOperation([
                ope('r', OPERATION_ETATS_ENUM.REALISEE, d20),
                ope('pl', OPERATION_ETATS_ENUM.PLANIFIEE, d19),
                ope('p', OPERATION_ETATS_ENUM.PREVUE, null),
                ope('rn', OPERATION_ETATS_ENUM.REALISEE, null),
            ]);
            expect(Object.keys(grouped).sort()).toEqual([GROUPE_A_VALIDER, lbl(d20), 'null'].sort());
            expect(ids(grouped[GROUPE_A_VALIDER])).toEqual(['p']);
            expect(ids(grouped.null)).toEqual(['rn']);
        });

        test('PREVUE sans date -> A_VALIDER en première clé', () => {
            const grouped = getOperationsGroupedByDateOperation([
                ope('r', OPERATION_ETATS_ENUM.REALISEE, d20),
                ope('p', OPERATION_ETATS_ENUM.PREVUE, null),
            ]);
            expect(Object.keys(grouped)[0]).toBe(GROUPE_A_VALIDER);
            expect(ids(grouped[GROUPE_A_VALIDER])).toEqual(['p']);
        });

        test('REPORTEE sans date -> A_VALIDER (avec les PREVUE sans date)', () => {
            const grouped = getOperationsGroupedByDateOperation([
                ope('rep', OPERATION_ETATS_ENUM.REPORTEE, null),
                ope('p', OPERATION_ETATS_ENUM.PREVUE, null),
            ]);
            expect(ids(grouped[GROUPE_A_VALIDER]).sort()).toEqual(['p', 'rep']);
            expect(grouped.null).toBeUndefined();
        });

        test('PREVUE avec date -> groupe de date, pas A_VALIDER', () => {
            const grouped = getOperationsGroupedByDateOperation([ope('p', OPERATION_ETATS_ENUM.PREVUE, d20)]);
            expect(grouped[GROUPE_A_VALIDER]).toBeUndefined();
            expect(ids(grouped[lbl(d20)])).toEqual(['p']);
        });

        test('REPORTEE avec date -> groupe de date, pas A_VALIDER', () => {
            const grouped = getOperationsGroupedByDateOperation([ope('rep', OPERATION_ETATS_ENUM.REPORTEE, d20)]);
            expect(grouped[GROUPE_A_VALIDER]).toBeUndefined();
            expect(ids(grouped[lbl(d20)])).toEqual(['rep']);
        });

        test('clé A_VALIDER absente si aucune opération à valider', () => {
            const grouped = getOperationsGroupedByDateOperation([ope('r', OPERATION_ETATS_ENUM.REALISEE, d20)]);
            expect(Object.keys(grouped)).not.toContain(GROUPE_A_VALIDER);
        });

        test.each([OPERATION_ETATS_ENUM.REALISEE, OPERATION_ETATS_ENUM.ANNULEE, OPERATION_ETATS_ENUM.SUPPRIMEE])(
            'état %s sans date -> clé "null", pas A_VALIDER', (etat) => {
                const grouped = getOperationsGroupedByDateOperation([ope('x', etat, null)]);
                expect(Object.keys(grouped)).toEqual(['null']);
                expect(ids(grouped.null)).toEqual(['x']);
            });

        test('PLANIFIEE exclue (avec ou sans date)', () => {
            const grouped = getOperationsGroupedByDateOperation([
                ope('a', OPERATION_ETATS_ENUM.PLANIFIEE, null),
                ope('b', OPERATION_ETATS_ENUM.PLANIFIEE, d20),
            ]);
            expect(grouped).toEqual({});
        });

        test('ordre des groupes de date inchangé : A_VALIDER, puis dates décroissantes', () => {
            const grouped = getOperationsGroupedByDateOperation([
                ope('o19', OPERATION_ETATS_ENUM.REALISEE, d19),
                ope('o20', OPERATION_ETATS_ENUM.REALISEE, d20),
                ope('p', OPERATION_ETATS_ENUM.PREVUE, null),
            ]);
            expect(Object.keys(grouped)).toEqual([GROUPE_A_VALIDER, lbl(d20), lbl(d19)]);
        });

        test('transition : même opération sans date puis datée change de groupe', () => {
            const o = ope('p', OPERATION_ETATS_ENUM.PREVUE, null);
            const avant = getOperationsGroupedByDateOperation([o]);
            expect(ids(avant[GROUPE_A_VALIDER])).toEqual(['p']);

            o.autresInfos.dateOperation = d20;
            const apres = getOperationsGroupedByDateOperation([o]);
            expect(apres[GROUPE_A_VALIDER]).toBeUndefined();
            expect(ids(apres[lbl(d20)])).toEqual(['p']);

            o.autresInfos.dateOperation = null;
            expect(ids(getOperationsGroupedByDateOperation([o])[GROUPE_A_VALIDER])).toEqual(['p']);
        });
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

        expect(result[0]?.listeSSCategories?.[0]?.categorieParente).toBe(result[0]);
    });
});
