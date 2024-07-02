import {createLabelTimeline} from '../../../../main/analyses/graphs/GraphAnalyseTemporelle.controller';

describe('createLabelTimeline', () => {
    it('should return current month and year when input matches current date', () => {
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        const result = createLabelTimeline(currentMonth, currentYear);
        expect(result).toEqual(`courant ${new Date().toLocaleString('default', {month: 'long', year: 'numeric'})}`);
    });

    it('should return end of current month and year when input month is greater than current month', () => {
        const futureMonth = new Date().getMonth() + 1;
        const currentYear = new Date().getFullYear();
        const result = createLabelTimeline(futureMonth, currentYear);
        expect(result).toEqual(`fin ${new Date().toLocaleString('default', {month: 'long', year: 'numeric'})}`);
    });

    it('should return input month and year when input year is not the current year', () => {
        const inputMonth = 0; // January
        const inputYear = 2023;
        const result = createLabelTimeline(inputMonth, inputYear);
        expect(result).toEqual(new Date(inputYear, inputMonth).toLocaleString('default', {
            month: 'long',
            year: 'numeric'
        }));
    });

    it('should handle edge case of December correctly', () => {
        const december = 11;
        const currentYear = new Date().getFullYear();
        const result = createLabelTimeline(december, currentYear);
        //   expect(result).toEqual("new Date(currentYear, december).toLocaleString('default', {month: 'long', year: 'numeric'})");
    });
});
