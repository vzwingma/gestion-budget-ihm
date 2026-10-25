import { afterEach, describe, expect, it, vi } from 'vitest';
import { debug, isDebugEnabled } from './Debug.utils';

describe('Debug.utils', () => {
    afterEach(() => {
        vi.unstubAllEnvs();
        vi.restoreAllMocks();
    });

    it('debug actif : console.log appelé', () => {
        vi.stubEnv('VITE_CONFIG_DEBUG', 'true');
        const spy = vi.spyOn(console, 'log').mockImplementation(() => {});
        debug('message', 1);
        expect(isDebugEnabled()).toBe(true);
        expect(spy).toHaveBeenCalledWith('message', 1);
    });

    it('debug inactif : console.log non appelé', () => {
        vi.stubEnv('VITE_CONFIG_DEBUG', '');
        const spy = vi.spyOn(console, 'log').mockImplementation(() => {});
        debug('message');
        expect(isDebugEnabled()).toBe(false);
        expect(spy).not.toHaveBeenCalled();
    });
});
