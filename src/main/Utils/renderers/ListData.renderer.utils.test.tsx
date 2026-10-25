import {afterEach, beforeEach, describe, expect, test, vi} from 'vitest';
import {FILTER_BAR_HEIGHT, getHeightList} from './ListData.renderer.utils.tsx';

describe('getHeightList', () => {
    beforeEach(() => {
        vi.stubGlobal('innerHeight', 1000);
    });
    afterEach(() => {
        vi.unstubAllGlobals();
    });

    test('défaut (reservedHeight = 0) inchangé : desktop -140, mobile -95', () => {
        expect(getHeightList(false)).toBe(860);
        expect(getHeightList(true)).toBe(905);
    });

    test('retranche reservedHeight', () => {
        expect(getHeightList(false, 48)).toBe(812);
        expect(getHeightList(true, 48)).toBe(857);
        expect(getHeightList(false, 0)).toBe(getHeightList(false));
    });

    test('FILTER_BAR_HEIGHT = 48', () => {
        expect(FILTER_BAR_HEIGHT).toBe(48);
    });
});
