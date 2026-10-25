import {afterEach, describe, expect, test, vi} from 'vitest';
import {renderHook} from '@testing-library/react';
import {useIsTouchDevice} from './useIsTouchDevice.ts';

const TOUCH_QUERY = '(hover: none) and (pointer: coarse)';

/** jsdom n'implémente pas matchMedia : stub dont `matches` dépend de la requête demandée. */
const stubMatchMedia = (touch: boolean, requetes: string[] = []) => {
    vi.stubGlobal('matchMedia', (query: string) => {
        requetes.push(query);
        return {
            matches: touch && query === TOUCH_QUERY,
            media: query,
            addEventListener: vi.fn(),
            removeEventListener: vi.fn(),
            addListener: vi.fn(),
            removeListener: vi.fn(),
        };
    });
};

afterEach(() => {
    vi.unstubAllGlobals();
});

describe('useIsTouchDevice', () => {
    test('retourne true quand (hover: none) and (pointer: coarse) correspond', () => {
        stubMatchMedia(true);
        const {result} = renderHook(() => useIsTouchDevice());
        expect(result.current).toBe(true);
    });

    test('retourne false quand la requête ne correspond pas (souris)', () => {
        stubMatchMedia(false);
        const {result} = renderHook(() => useIsTouchDevice());
        expect(result.current).toBe(false);
    });

    test('interroge exactement la requête hover:none + pointer:coarse (pas un breakpoint)', () => {
        const requetes: string[] = [];
        stubMatchMedia(true, requetes);
        renderHook(() => useIsTouchDevice());
        expect(requetes).toContain(TOUCH_QUERY);
    });

    test('sans matchMedia (jsdom par défaut) : false', () => {
        const {result} = renderHook(() => useIsTouchDevice());
        expect(result.current).toBe(false);
    });
});
