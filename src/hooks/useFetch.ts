import { useEffect, useState } from 'react';
import { toast } from '@/store/toast';

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
    const [loading, setLoading] = useState(true);

    useEffect(() => {
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
