import {getLabelFRFromDate, getLabelISOFromDate, getLabelMonthFRFromDate, getMonthFromString} from './Date.utils.ts';

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
});
