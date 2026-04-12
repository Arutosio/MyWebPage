import { useEffect, useState } from 'react';

interface FetchResult<T> {
    data: T | null;
    error: boolean;
    loading: boolean;
}

/**
 * Minimal fetch hook with automatic cancellation on unmount.
 * Replaces the duplicated fetch-with-cancelled-flag pattern in Projects and Donate.
 */
export function useFetch<T>(url: string): FetchResult<T> {
    const [data, setData] = useState<T | null>(null);
    const [error, setError] = useState(false);

    useEffect(() => {
        let cancelled = false;
        setData(null);
        setError(false);

        fetch(url)
            .then((r) => {
                if (!r.ok) throw new Error(r.statusText);
                return r.json();
            })
            .then((d: T) => {
                if (!cancelled) setData(d);
            })
            .catch((err) => {
                if (!cancelled) {
                    console.warn(`[useFetch] ${url} failed:`, err);
                    setError(true);
                }
            });

        return () => {
            cancelled = true;
        };
    }, [url]);

    return { data, error, loading: data === null && !error };
}
