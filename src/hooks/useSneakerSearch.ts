'use client';

import { useState, useCallback, useRef } from 'react';
import { SneakerAPI } from '@/services/api/sneakerAPI';
import type { SneakerProduct } from '@/services/api/types';

export function useSneakerSearch() {
    const [results, setResults] = useState<SneakerProduct[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const abortRef = useRef<AbortController | null>(null);

    const search = useCallback(async (query: string, limit = 20) => {
        if (abortRef.current) abortRef.current.abort();
        abortRef.current = new AbortController();

        setLoading(true);
        setError(null);
        try {
            const data = await SneakerAPI.search(query, limit);
            setResults(data?.results || []);
        } catch (err: unknown) {
            if (err instanceof Error && err.name !== 'CanceledError') {
                setError('Failed to search sneakers');
            }
        } finally {
            setLoading(false);
        }
    }, []);

    const clear = useCallback(() => {
        setResults([]);
        setError(null);
    }, []);

    return { results, loading, error, search, clear };
}
