import { afterEach } from 'vitest';
import {getLabelJourSemaineFRFromDate, getLabelFRFromDate, getLabelISOFromDate, getLabelMonthFRFromDate, getMonthFromString} from './Date.utils.ts';

describe('Date.utils', () => {

    test('retourne un label FR pour une date', () => {
        const date = new Date(2026, 1, 25, 12, 0, 0);

        expect(getLabelFRFromDate(date)).toBe(date.toLocaleDateString('fr-FR'));
    });

    test('retourne un label FR mois/année', () => {
        const date = new Date(2026, 1, 25, 12, 0, 0);

        expect(getLabelMonthFRFromDate(date)).toBe(
            date.toLocaleDateString('fr-FR', {year: 'numeric', month: 'long'})
        );
    });

    test('retourne un label ISO', () => {
        expect(getLabelISOFromDate(new Date('2026-02-25T10:00:00.000Z'))).toBe('2026-02-25');
    });

    test('label ISO : composantes locales, pas de décalage de jour tôt le matin (00h30 le 1er mars)', () => {
        expect(getLabelISOFromDate(new Date(2026, 2, 1, 0, 30))).toBe('2026-03-01');
    });

    test('label ISO : fin de journée locale sans décalage (23h30 le 28 février)', () => {
        expect(getLabelISOFromDate(new Date(2026, 1, 28, 23, 30))).toBe('2026-02-28');
    });

    test('label ISO : fin d année et début d année, mois et jour sur 2 chiffres', () => {
        expect(getLabelISOFromDate(new Date(2026, 11, 31, 23, 59))).toBe('2026-12-31');
        expect(getLabelISOFromDate(new Date(2027, 0, 1, 0, 0))).toBe('2027-01-01');
        expect(getLabelISOFromDate(new Date(2026, 0, 5, 12, 0))).toBe('2026-01-05');
    });

    describe('label ISO : indépendant du fuseau du runtime', () => {
        const tzInitial = process.env.TZ;
        afterEach(() => {
            if (tzInitial === undefined) delete process.env.TZ; else process.env.TZ = tzInitial;
        });

        // Fuseaux d'avance (UTC+12/+14) et de retard (UTC-10) : l'ancienne implémentation (toISOString, UTC) décalait le jour
        test.each(['Pacific/Auckland', 'Pacific/Kiritimati', 'Pacific/Honolulu', 'UTC'])('fuseau %s', (tz) => {
            process.env.TZ = tz;

            expect(getLabelISOFromDate(new Date(2026, 2, 1, 0, 30))).toBe('2026-03-01');
            expect(getLabelISOFromDate(new Date(2026, 1, 28, 23, 30))).toBe('2026-02-28');
        });
    });

    test('convertit un nom de mois en numéro', () => {
        expect(getMonthFromString('February')).toBe(2);
        expect(getMonthFromString('August')).toBe(8);
    });

    test.each([
        [2026, 10, 2, 'Lun.'],   // lundi 02/11/2026
        [2026, 10, 3, 'Mar.'],
        [2026, 10, 4, 'Mer.'],
        [2026, 10, 5, 'Jeu.'],
        [2026, 10, 6, 'Ven.'],
        [2026, 10, 7, 'Sam.'],
        [2026, 10, 1, 'Dim.'],
    ])('jour de semaine abrégé FR (date locale %i-%i-%i) : %s', (y, m, d, attendu) => {
        // Dates locales (heure 0 et 23) : pas de dérive UTC
        expect(getLabelJourSemaineFRFromDate(new Date(y, m, d, 0, 0))).toBe(attendu);
        expect(getLabelJourSemaineFRFromDate(new Date(y, m, d, 23, 30))).toBe(attendu);
    });
});
