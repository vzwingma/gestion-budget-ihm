import {describe, expect, test} from 'vitest';
import OperationModel from '../Models/budgets/Operation.model.ts';
import {OPERATION_ETATS_ENUM} from './AppBusinessEnums.constants.ts';
import {
    ETATS_PAR_PUCE,
    FILTRE_OPERATIONS_VIDE,
    isFiltreActif,
    matchesPuces,
    PUCE_ETAT_ENUM,
    PUCE_SENS_ENUM,
    togglePuce
} from './OperationsFilter.utils.ts';

const ope = (etat: OPERATION_ETATS_ENUM, valeur: number, date: Date | null = null): OperationModel =>
    ({id: 'x', etat, valeur, autresInfos: {dateOperation: date}}) as unknown as OperationModel;

const etats = (...e: PUCE_ETAT_ENUM[]) => ({etats: e, sens: []});
const sens = (...s: PUCE_SENS_ENUM[]) => ({etats: [], sens: s});

describe('FILTRE_OPERATIONS_VIDE / isFiltreActif', () => {
    test('filtre vide : texte vide, aucune puce, inactif', () => {
        expect(FILTRE_OPERATIONS_VIDE).toEqual({texte: '', etats: [], sens: []});
        expect(isFiltreActif(FILTRE_OPERATIONS_VIDE)).toBe(false);
    });
    test('texte null = inactif', () => {
        expect(isFiltreActif({texte: null, etats: [], sens: []})).toBe(false);
    });
    test('texte non vide = actif', () => {
        expect(isFiltreActif({texte: 'a', etats: [], sens: []})).toBe(true);
    });
    test('texte d espaces seuls = actif (comportement actuel : seul "" est vide)', () => {
        expect(isFiltreActif({texte: ' ', etats: [], sens: []})).toBe(true);
    });
    test('puce état seule = actif', () => {
        expect(isFiltreActif({texte: '', etats: [PUCE_ETAT_ENUM.ANNULEE], sens: []})).toBe(true);
    });
    test('puce sens seule = actif', () => {
        expect(isFiltreActif({texte: null, etats: [], sens: [PUCE_SENS_ENUM.RENTREES]})).toBe(true);
    });
});

describe('togglePuce', () => {
    test('ajoute une valeur absente', () => {
        expect(togglePuce([PUCE_ETAT_ENUM.A_VALIDER], PUCE_ETAT_ENUM.REALISEE)).toEqual([PUCE_ETAT_ENUM.A_VALIDER, PUCE_ETAT_ENUM.REALISEE]);
    });
    test('retire une valeur présente', () => {
        expect(togglePuce([PUCE_ETAT_ENUM.A_VALIDER, PUCE_ETAT_ENUM.REALISEE], PUCE_ETAT_ENUM.A_VALIDER)).toEqual([PUCE_ETAT_ENUM.REALISEE]);
    });
    test('ne mute pas le tableau d entrée', () => {
        const entree = [PUCE_SENS_ENUM.DEPENSES];
        const sortie = togglePuce(entree, PUCE_SENS_ENUM.RENTREES);
        expect(entree).toEqual([PUCE_SENS_ENUM.DEPENSES]);
        expect(sortie).not.toBe(entree);
        const retire = togglePuce(entree, PUCE_SENS_ENUM.DEPENSES);
        expect(entree).toEqual([PUCE_SENS_ENUM.DEPENSES]);
        expect(retire).toEqual([]);
    });
    test('tableau vide : ajoute', () => {
        expect(togglePuce([], PUCE_SENS_ENUM.DEPENSES)).toEqual([PUCE_SENS_ENUM.DEPENSES]);
    });
});

describe('ETATS_PAR_PUCE', () => {
    test('couverture des états par puce (état seul)', () => {
        expect(ETATS_PAR_PUCE[PUCE_ETAT_ENUM.A_VALIDER]).toEqual([OPERATION_ETATS_ENUM.PREVUE, OPERATION_ETATS_ENUM.REPORTEE]);
        expect(ETATS_PAR_PUCE[PUCE_ETAT_ENUM.REALISEE]).toEqual([OPERATION_ETATS_ENUM.REALISEE]);
        expect(ETATS_PAR_PUCE[PUCE_ETAT_ENUM.ANNULEE]).toEqual([OPERATION_ETATS_ENUM.ANNULEE]);
    });
});

describe('matchesPuces', () => {
    test('aucune puce : tout passe (y compris SUPPRIMEE et valeur 0)', () => {
        for (const e of Object.values(OPERATION_ETATS_ENUM)) {
            expect(matchesPuces(ope(e, 0), FILTRE_OPERATIONS_VIDE), e).toBe(true);
        }
    });

    describe('puce « À valider »', () => {
        const puces = etats(PUCE_ETAT_ENUM.A_VALIDER);
        test('PREVUE et REPORTEE, avec ou sans date', () => {
            const date = new Date(2026, 10, 2);
            expect(matchesPuces(ope(OPERATION_ETATS_ENUM.PREVUE, -1), puces)).toBe(true);
            expect(matchesPuces(ope(OPERATION_ETATS_ENUM.PREVUE, -1, date), puces)).toBe(true);
            expect(matchesPuces(ope(OPERATION_ETATS_ENUM.REPORTEE, -1), puces)).toBe(true);
            expect(matchesPuces(ope(OPERATION_ETATS_ENUM.REPORTEE, -1, date), puces)).toBe(true);
        });
        test('exclut REALISEE, ANNULEE, SUPPRIMEE', () => {
            expect(matchesPuces(ope(OPERATION_ETATS_ENUM.REALISEE, -1), puces)).toBe(false);
            expect(matchesPuces(ope(OPERATION_ETATS_ENUM.ANNULEE, -1), puces)).toBe(false);
            expect(matchesPuces(ope(OPERATION_ETATS_ENUM.SUPPRIMEE, -1), puces)).toBe(false);
        });
    });

    test('puce « Réalisée » = REALISEE seul', () => {
        const puces = etats(PUCE_ETAT_ENUM.REALISEE);
        expect(matchesPuces(ope(OPERATION_ETATS_ENUM.REALISEE, -1), puces)).toBe(true);
        expect(matchesPuces(ope(OPERATION_ETATS_ENUM.PREVUE, -1), puces)).toBe(false);
        expect(matchesPuces(ope(OPERATION_ETATS_ENUM.ANNULEE, -1), puces)).toBe(false);
    });

    test('puce « Annulée » = ANNULEE seul, jamais SUPPRIMEE', () => {
        const puces = etats(PUCE_ETAT_ENUM.ANNULEE);
        expect(matchesPuces(ope(OPERATION_ETATS_ENUM.ANNULEE, -1), puces)).toBe(true);
        expect(matchesPuces(ope(OPERATION_ETATS_ENUM.SUPPRIMEE, -1), puces)).toBe(false);
        expect(matchesPuces(ope(OPERATION_ETATS_ENUM.REALISEE, -1), puces)).toBe(false);
    });

    test('OU à l intérieur du groupe État', () => {
        const puces = etats(PUCE_ETAT_ENUM.A_VALIDER, PUCE_ETAT_ENUM.ANNULEE);
        expect(matchesPuces(ope(OPERATION_ETATS_ENUM.PREVUE, -1), puces)).toBe(true);
        expect(matchesPuces(ope(OPERATION_ETATS_ENUM.ANNULEE, -1), puces)).toBe(true);
        expect(matchesPuces(ope(OPERATION_ETATS_ENUM.REALISEE, -1), puces)).toBe(false);
    });

    describe('groupe Sens (signe de la valeur)', () => {
        test('Dépenses : valeur < 0 uniquement', () => {
            const puces = sens(PUCE_SENS_ENUM.DEPENSES);
            expect(matchesPuces(ope(OPERATION_ETATS_ENUM.REALISEE, -0.01), puces)).toBe(true);
            expect(matchesPuces(ope(OPERATION_ETATS_ENUM.REALISEE, 5), puces)).toBe(false);
            expect(matchesPuces(ope(OPERATION_ETATS_ENUM.REALISEE, 0), puces)).toBe(false);
        });
        test('Rentrées : valeur > 0 uniquement', () => {
            const puces = sens(PUCE_SENS_ENUM.RENTREES);
            expect(matchesPuces(ope(OPERATION_ETATS_ENUM.REALISEE, 0.01), puces)).toBe(true);
            expect(matchesPuces(ope(OPERATION_ETATS_ENUM.REALISEE, -5), puces)).toBe(false);
            expect(matchesPuces(ope(OPERATION_ETATS_ENUM.REALISEE, 0), puces)).toBe(false);
        });
        test('Dépenses + Rentrées (OU) : tout sauf valeur 0', () => {
            const puces = sens(PUCE_SENS_ENUM.DEPENSES, PUCE_SENS_ENUM.RENTREES);
            expect(matchesPuces(ope(OPERATION_ETATS_ENUM.REALISEE, -3), puces)).toBe(true);
            expect(matchesPuces(ope(OPERATION_ETATS_ENUM.REALISEE, 3), puces)).toBe(true);
            expect(matchesPuces(ope(OPERATION_ETATS_ENUM.REALISEE, 0), puces)).toBe(false);
        });
    });

    test('ET entre les groupes État × Sens', () => {
        const puces = {etats: [PUCE_ETAT_ENUM.A_VALIDER], sens: [PUCE_SENS_ENUM.DEPENSES]};
        expect(matchesPuces(ope(OPERATION_ETATS_ENUM.PREVUE, -10), puces)).toBe(true);
        expect(matchesPuces(ope(OPERATION_ETATS_ENUM.PREVUE, 10), puces)).toBe(false);
        expect(matchesPuces(ope(OPERATION_ETATS_ENUM.REALISEE, -10), puces)).toBe(false);
    });
});
