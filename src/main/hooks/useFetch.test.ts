import { renderHook, waitFor, act } from '@testing-library/react';
import { describe, test, expect, vi } from 'vitest';
import { useFetch } from './useFetch.ts';

describe('useFetch', () => {

    test('état initial : loading, sans donnée ni erreur', () => {
        const { result } = renderHook(() => useFetch(() => new Promise<string>(() => {}), []));
        expect(result.current.loading).toBe(true);
        expect(result.current.data).toBeUndefined();
        expect(result.current.error).toBeNull();
    });

    test('succès : expose la donnée et loading=false', async () => {
        const { result } = renderHook(() => useFetch(() => Promise.resolve([1, 2]), []));
        await waitFor(() => expect(result.current.loading).toBe(false));
        expect(result.current.data).toEqual([1, 2]);
        expect(result.current.error).toBeNull();
    });

    test("erreur : expose l'erreur et loading=false", async () => {
        const err = new Error('boom');
        const { result } = renderHook(() => useFetch(() => Promise.reject(err), []));
        await waitFor(() => expect(result.current.loading).toBe(false));
        expect(result.current.error).toBe(err);
        expect(result.current.data).toBeUndefined();
    });

    test('recharge quand les deps changent', async () => {
        const fetcher = vi.fn((id: number) => Promise.resolve('d' + id));
        const { result, rerender } = renderHook(({ id }) => useFetch(() => fetcher(id), [id]), { initialProps: { id: 1 } });
        await waitFor(() => expect(result.current.data).toBe('d1'));
        rerender({ id: 2 });
        await waitFor(() => expect(result.current.data).toBe('d2'));
        expect(fetcher).toHaveBeenCalledTimes(2);
    });

    test('refetch relance le chargement', async () => {
        const fetcher = vi.fn().mockResolvedValueOnce('a').mockResolvedValueOnce('b');
        const { result } = renderHook(() => useFetch(fetcher, []));
        await waitFor(() => expect(result.current.data).toBe('a'));
        act(() => result.current.refetch());
        await waitFor(() => expect(result.current.data).toBe('b'));
        expect(fetcher).toHaveBeenCalledTimes(2);
    });

    test("efface l'erreur au rechargement réussi", async () => {
        const fetcher = vi.fn().mockRejectedValueOnce(new Error('x')).mockResolvedValueOnce('ok');
        const { result } = renderHook(() => useFetch(fetcher, []));
        await waitFor(() => expect(result.current.error).toBeTruthy());
        act(() => result.current.refetch());
        await waitFor(() => expect(result.current.data).toBe('ok'));
        expect(result.current.error).toBeNull();
    });

    test("ignore le résultat d'une requête résolue après démontage", async () => {
        let resolve!: (v: string) => void;
        const { result, unmount } = renderHook(() => useFetch(() => new Promise<string>((r) => { resolve = r; }), []));
        unmount();
        await act(async () => { resolve('tard'); });
        expect(result.current.data).toBeUndefined();
        expect(result.current.loading).toBe(true);
    });

    test('ignore le résultat périmé quand les deps changent avant la résolution', async () => {
        const resolvers: Record<number, (v: string) => void> = {};
        const { result, rerender } = renderHook(({ id }) =>
            useFetch(() => new Promise<string>((r) => { resolvers[id] = r; }), [id]), { initialProps: { id: 1 } });
        rerender({ id: 2 });
        await act(async () => { resolvers[1]('vieux'); });
        expect(result.current.data).toBeUndefined();
        await act(async () => { resolvers[2]('frais'); });
        expect(result.current.data).toBe('frais');
    });
});
