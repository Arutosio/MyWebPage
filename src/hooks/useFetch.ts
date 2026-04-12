import { useEffect, useState } from 'react';
import { toast } from '@/store/toast';

interface FetchResult<T> {
    data: T | null;
    error: boolean;
    loading: boolean;
}

const TTL_MS = 5 * 60 * 1000;
const cache = new Map<string, { data: unknown; ts: number }>();

/**
 * Minimal fetch hook with automatic cancellation on unmount and a
 * module-level 5-minute cache keyed by URL. Closing and reopening an app
 * that uses the same endpoint (e.g. Projects) now serves from cache,
 * which matters for rate-limited APIs like GitHub unauth.
 */
export function useFetch<T>(url: string): FetchResult<T> {
    const cached = cache.get(url);
    const fresh = cached && Date.now() - cached.ts < TTL_MS ? (cached.data as T) : null;

    const [data, setData] = useState<T | null>(fresh);
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(fresh === null);

    useEffect(() => {
        const entry = cache.get(url);
        if (entry && Date.now() - entry.ts < TTL_MS) {
            setData(entry.data as T);
            setError(false);
            setLoading(false);
            return;
        }

        const controller = new AbortController();
        setData(null);
        setError(false);
        setLoading(true);

        fetch(url, { signal: controller.signal })
            .then((r) => {
                if (!r.ok) throw new Error(r.statusText);
                return r.json();
            })
            .then((d: T) => {
                cache.set(url, { data: d, ts: Date.now() });
                setData(d);
                setLoading(false);
            })
            .catch((err) => {
                if (err?.name === 'AbortError') return;
                console.warn(`[useFetch] ${url} failed:`, err);
                setError(true);
                setLoading(false);
                toast.error('Fetch failed', url);
            });

        return () => controller.abort();
    }, [url]);

    return { data, error, loading };
}
