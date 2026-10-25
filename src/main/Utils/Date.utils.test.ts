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
