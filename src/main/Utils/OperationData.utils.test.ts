import {
    addEndingZeros,
    addLeadingZeros,
    compareCategories,
    compareNumberValues,
    compareStringValues,
    compareSubCategories,
    getEventTargetId,
    getCategoryTypeValue,
    operationIsIntercompteFromLibelle,
    sortLibellesCategories,
    sortLibellesSsCategories,
    sortOperations,
    sortPeriodicOperations
} from './OperationData.utils.ts';
import {PERIODES_MENSUALITE_ENUM} from './AppBusinessEnums.constants.ts';

describe('OperationData.utils', () => {

    test('ajoute des zéros en tête', () => {
        expect(addLeadingZeros(3)).toBe('03');
        expect(addLeadingZeros(12)).toBe('12');
    });

    test('ajoute des zéros en fin de partie décimale', () => {
        expect(addEndingZeros(12)).toBe('12,00');
        expect(addEndingZeros(12.3)).toBe('12,30');
    });

    test('retrouve id du target en remontant le DOM', () => {
        const target = {
            id: '',
            parentNode: {
                id: 'button-save'
            }
        };

        expect(getEventTargetId(target)).toBe('button-save');
        expect(getEventTargetId({id: 'direct-id'})).toBe('direct-id');
        expect(getEventTargetId(null)).toBeNull();
    });

    test('trie les catégories par libellé', () => {
        expect(sortLibellesCategories({libelle: 'B'} as any, {libelle: 'A'} as any)).toBe(1);
        expect(sortLibellesCategories({libelle: 'A'} as any, {libelle: 'B'} as any)).toBe(-1);
        expect(sortLibellesCategories({libelle: 'A'} as any, {libelle: 'A'} as any)).toBe(0);
        expect(sortLibellesCategories(null as any, {libelle: 'A'} as any)).toBe(0);
    });

    test('trie les sous-catégories par parent puis libellé', () => {
        const ss1 = {libelle: 'L2', categorieParente: {libelle: 'ParentA'}};
        const ss2 = {libelle: 'L1', categorieParente: {libelle: 'ParentA'}};
        const ss3 = {libelle: 'L1', categorieParente: {libelle: 'ParentB'}};

        expect(sortLibellesSsCategories(ss1 as any, ss2 as any)).toBe(1);
        expect(sortLibellesSsCategories(ss2 as any, ss3 as any)).toBe(-1);
        expect(sortLibellesCategories(ss1 as any, ss3 as any)).toBe(-1);
        expect(sortLibellesSsCategories({libelle: 'A', categorieParente: null} as any, {libelle: 'B', categorieParente: null} as any)).toBe(-1);
    });

    test('détecte les libellés intercompte', () => {
        expect(operationIsIntercompteFromLibelle('[vers Compte B]Virement')).toBeTruthy();
        expect(operationIsIntercompteFromLibelle('Achat CB')).toBeFalsy();
    });

    test('trie les opérations par date puis état puis date maj', () => {
        const opRecent = {
            etat: 'REALISEE',
            autresInfos: {dateOperation: '2026-02-10', dateMaj: '2026-02-11'}
        };
        const opOld = {
            etat: 'REALISEE',
            autresInfos: {dateOperation: '2026-02-01', dateMaj: '2026-02-02'}
        };
        const opSameDateHigherEtat = {
            etat: 'SUPPRIMEE',
            autresInfos: {dateOperation: '2026-02-10', dateMaj: '2026-02-11'}
        };
        const opSameDateSameEtatOlderMaj = {
            etat: 'REALISEE',
            autresInfos: {dateOperation: '2026-02-10', dateMaj: '2026-02-01'}
        };

        expect(sortOperations(opRecent as any, opOld as any)).toBe(-1);
        expect(sortOperations(opRecent as any, opSameDateHigherEtat as any)).toBe(-1);
        expect(sortOperations(opRecent as any, opSameDateSameEtatOlderMaj as any)).toBe(-1);
    });

    test('trie les opérations quand des dates sont absentes et couvre les rangs d état', () => {
        const opNoDate = {
            etat: 'REALISEE',
            autresInfos: {dateOperation: undefined, dateMaj: undefined}
        };
        const opWithDate = {
            etat: 'REALISEE',
            autresInfos: {dateOperation: '2026-02-01', dateMaj: undefined}
        };
        const opUnknownEtat1 = {
            etat: 'ETAT_INCONNU_1',
            autresInfos: {dateOperation: '2026-02-01', dateMaj: undefined}
        };
        const opUnknownEtat2 = {
            etat: 'ETAT_INCONNU_2',
            autresInfos: {dateOperation: '2026-02-01', dateMaj: undefined}
        };

        expect(sortOperations(opNoDate as any, opWithDate as any)).toBe(-1);
        expect(sortOperations(opWithDate as any, opNoDate as any)).toBe(1);
        expect(sortOperations(opUnknownEtat1 as any, opUnknownEtat2 as any)).toBe(0);
    });

    test('trie les opérations périodiques', () => {
        const opMensuelle = {
            mensualite: {periode: PERIODES_MENSUALITE_ENUM.MENSUELLE},
            libelle: 'B',
            autresInfos: {dateMaj: '2026-02-10'}
        };
        const opAnnuelle = {
            mensualite: {periode: PERIODES_MENSUALITE_ENUM.ANNUELLE},
            libelle: 'A',
            autresInfos: {dateMaj: '2026-02-11'}
        };
        const opMensuelleA = {
            mensualite: {periode: PERIODES_MENSUALITE_ENUM.MENSUELLE},
            libelle: 'A',
            autresInfos: {dateMaj: '2026-02-11'}
        };

        expect(sortPeriodicOperations(opMensuelle as any, opAnnuelle as any)).toBeLessThan(0);
        expect(sortPeriodicOperations(opMensuelle as any, opMensuelleA as any)).toBeGreaterThan(0);
    });

    test('trie les opérations périodiques avec périodes nulles et fallback sur date maj', () => {
        const opPeriodeNull = {
            mensualite: {periode: null},
            libelle: null,
            autresInfos: {dateMaj: '2026-02-10'}
        };
        const opPeriodeDefined = {
            mensualite: {periode: PERIODES_MENSUALITE_ENUM.MENSUELLE},
            libelle: null,
            autresInfos: {dateMaj: '2026-02-11'}
        };
        const opPeriodeNull2 = {
            mensualite: {periode: null},
            libelle: null,
            autresInfos: {dateMaj: '2026-02-09'}
        };
        const opPeriodeNullNoMaj = {
            mensualite: {periode: null},
            libelle: null,
            autresInfos: {dateMaj: undefined}
        };

        expect(sortPeriodicOperations(opPeriodeNull as any, opPeriodeDefined as any)).toBe(-1);
        expect(sortPeriodicOperations(opPeriodeDefined as any, opPeriodeNull as any)).toBe(1);
        expect(sortPeriodicOperations(opPeriodeNull as any, opPeriodeNull2 as any)).toBe(-1);
        expect(sortPeriodicOperations(opPeriodeNullNoMaj as any, opPeriodeNull as any)).toBe(0);
    });

    test('compare des chaînes selon la direction', () => {
        expect(compareStringValues('A', 'B', 'asc')).toBeLessThan(0);
        expect(compareStringValues('A', 'B', 'desc')).toBeGreaterThan(0);
        expect(compareStringValues('A', 'A', 'asc')).toBe(0);
    });

    test('compare des nombres selon la direction', () => {
        expect(compareNumberValues(1, 2, 'asc')).toBeLessThan(0);
        expect(compareNumberValues(1, 2, 'desc')).toBeGreaterThan(0);
        expect(compareNumberValues(3, 3, 'asc')).toBe(0);
    });

    test('extrait le type de catégorie pour le tri', () => {
        const category = {
            resumesSsCategories: {
                a: {ssCategorie: {type: null}},
                b: {ssCategorie: {type: 'ESSENTIEL'}}
            }
        };

        expect(getCategoryTypeValue(category as any)).toBe('ESSENTIEL');
        expect(getCategoryTypeValue({resumesSsCategories: {}} as any)).toBe('');
    });

    test('compare les catégories selon la colonne choisie', () => {
        const catA = {
            categorie: {libelle: 'A'},
            total: 10,
            nbTransactions: 2,
            pourcentage: 20,
            resumesSsCategories: {x: {ssCategorie: {type: 'ESSENTIEL'}}}
        };
        const catB = {
            categorie: {libelle: 'B'},
            total: 5,
            nbTransactions: 4,
            pourcentage: 40,
            resumesSsCategories: {x: {ssCategorie: {type: 'PLAISIR'}}}
        };

        expect(compareCategories(catA as any, catB as any, 'libelle', 'asc')).toBeLessThan(0);
        expect(compareCategories(catA as any, catB as any, 'somme', 'desc')).toBeLessThan(0);
        expect(compareCategories(catA as any, catB as any, 'operations', 'asc')).toBeLessThan(0);
        expect(compareCategories(catA as any, catB as any, 'pourcentage', 'asc')).toBeLessThan(0);
        expect(compareCategories(catA as any, catB as any, 'type', 'asc')).toBeLessThan(0);
    });

    test('compare les sous-catégories selon la colonne choisie', () => {
        const subA = {
            ssCategorie: {libelle: 'A', type: 'ESSENTIEL'},
            total: 10,
            nbTransactions: 2,
            pourcentage: 20
        };
        const subB = {
            ssCategorie: {libelle: 'B', type: 'PLAISIR'},
            total: 5,
            nbTransactions: 4,
            pourcentage: 40
        };

        expect(compareSubCategories(subA as any, subB as any, 'libelle', 'asc')).toBeLessThan(0);
        expect(compareSubCategories(subA as any, subB as any, 'somme', 'desc')).toBeLessThan(0);
        expect(compareSubCategories(subA as any, subB as any, 'operations', 'asc')).toBeLessThan(0);
        expect(compareSubCategories(subA as any, subB as any, 'pourcentage', 'asc')).toBeLessThan(0);
        expect(compareSubCategories(subA as any, subB as any, 'type', 'asc')).toBeLessThan(0);
    });
});
