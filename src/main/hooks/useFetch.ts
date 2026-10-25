import { DependencyList, useCallback, useEffect, useState } from "react";

interface UseFetchResult<T> {
    data: T | undefined;
    loading: boolean;
    error: unknown;
    /** Force un nouveau chargement (ex: bouton "Réessayer") **/
    refetch: () => void;
}

/**
 * Hook générique de data-fetching (AP 005 - T11), factorisant le triplet `useState`
 * (données/chargement/erreur) + `useEffect` + callback répété dans plusieurs composants
 * (Budget, Recurrents, AnalysesFiltrePeriode, Infos, MainPage, ProfileInfos, CompteItem).
 *
 * Usage :
 * ```ts
 * const { data: comptes, loading, error } = useFetch(() => loadComptesPromise(), [selectedDate]);
 * ```
 *
 * Nécessite un `fetcher` qui retourne une `Promise<T>` résolue avec la donnée (contrairement
 * à la majorité des `*.extservices.ts` actuels qui prennent un callback `setState` en paramètre).
 * T11 : infra livrée ; adoption par les 7 composants listés ci-dessus restante (reste de T11),
 * hors T20.
 *
 * @param fetcher fonction retournant la promesse de la donnée à charger
 * @param deps dépendances déclenchant un nouveau chargement (comme un `useEffect` classique)
 */
export function useFetch<T>(fetcher: () => Promise<T>, deps: DependencyList): UseFetchResult<T> {
    const [data, setData] = useState<T | undefined>(undefined);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<unknown>(null);
    const [refreshToken, setRefreshToken] = useState<number>(0);

    const refetch = useCallback(() => setRefreshToken((token) => token + 1), []);

    useEffect(() => {
        let cancelled = false;
        setLoading(true);
        setError(null);

        fetcher()
            .then((result) => {
                if (!cancelled) {
                    setData(result);
                }
            })
            .catch((e) => {
                if (!cancelled) {
                    setError(e);
                }
            })
            .finally(() => {
                if (!cancelled) {
                    setLoading(false);
                }
            });

        return () => {
            cancelled = true;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [...deps, refreshToken]);

    return { data, loading, error, refetch };
}
