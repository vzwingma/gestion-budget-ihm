import { getLabelDate } from './../../../main/Utils/Date.utils';

describe('getLabelDate', () => {
    it('should return the correct French date label for a valid date string', () => {
        const dateStr = '2023-10-05';
        const result = getLabelDate(dateStr);
        expect(result).toBe('05/10/2023');
    });

    it('should return "Invalid Date" for an invalid date string', () => {
        const dateStr = 'invalid-date';
        const result = getLabelDate(dateStr);
        expect(result).toBe('Invalid Date');
    });

    it('should handle different date formats correctly', () => {
        const dateStr = 'October 5, 2023';
        const result = getLabelDate(dateStr);
        expect(result).toBe('05/10/2023');
    });

    it('should return the correct French date label for a date string with time', () => {
        const dateStr = '2023-10-05T14:48:00.000Z';
        const result = getLabelDate(dateStr);
        expect(result).toBe('05/10/2023');
    });
});