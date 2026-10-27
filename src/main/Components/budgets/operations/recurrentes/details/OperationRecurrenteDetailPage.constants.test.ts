import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';

import {
    createEmptyEditForm,
    createEmptyErrors,
    getProchaineEcheance
} from './OperationRecurrenteDetailPage.constants.ts';
import { getLabelFRFromDate } from '../../../../../Utils/Date.utils.ts';

describe('OperationRecurrenteDetailPage.constants', () => {

    test('formulaire vide : aucun champ en édition, validation désactivée', () => {
        expect(createEmptyEditForm()).toEqual({ dateFin: false, formValidationEnabled: false });
    });

    test('erreurs vides : aucune erreur de date de fin', () => {
        expect(createEmptyErrors()).toEqual({ dateFin: null });
    });

    test('formulaires et erreurs : nouvel objet à chaque appel (pas d état partagé)', () => {
        expect(createEmptyEditForm()).not.toBe(createEmptyEditForm());
        expect(createEmptyErrors()).not.toBe(createEmptyErrors());
    });

    describe('getProchaineEcheance', () => {

        beforeEach(() => {
            vi.useFakeTimers({ toFake: ['Date'] });
            vi.setSystemTime(new Date(2026, 5, 15, 12, 0));
        });

        afterEach(() => {
            vi.useRealTimers();
        });

        test('échéance négative : "Aucune"', () => {
            expect(getProchaineEcheance(new Date(2026, 0, 10), -1)).toBe('Aucune');
        });

        test('à partir de la date d opération : décalage en mois (texte formaté via la même fonction)', () => {
            const attendu = getLabelFRFromDate(new Date(2026, 3, 10));

            expect(getProchaineEcheance(new Date(2026, 0, 10), 3)).toBe(attendu);
        });

        test('sans date d opération : décalage à partir d aujourd hui', () => {
            const attendu = getLabelFRFromDate(new Date(2026, 7, 15, 12, 0));

            expect(getProchaineEcheance(null, 2)).toBe(attendu);
        });

        test('échéance 0 : la date de départ elle-même, sans modifier la date reçue', () => {
            const date = new Date(2026, 0, 10);

            expect(getProchaineEcheance(date, 0)).toBe(getLabelFRFromDate(new Date(2026, 0, 10)));
            expect(date).toEqual(new Date(2026, 0, 10));
        });
    });
});
