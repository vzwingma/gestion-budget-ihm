import {getMonthFromString} from "../../../main/Utils/Date.utils";

describe('getMonthFromString', () => {
    it('should return 1 for January', () => {
        const result = getMonthFromString('January');
        expect(result).toEqual(1);
    });

    it('should return 12 for December', () => {
        const result = getMonthFromString('December');
        expect(result).toEqual(12);
    });

    it('should return NaN for non-month string', () => {
        const result = getMonthFromString('NotAMonth');
        expect(result).toBeNaN();
    });

    it('should be case insensitive', () => {
        const result = getMonthFromString('january');
        expect(result).toEqual(1);
    });

    it('should return NaN for empty string', () => {
        const result = getMonthFromString('');
        expect(result).toBeNaN();
    });
});
