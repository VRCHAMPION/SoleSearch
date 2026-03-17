'use client';

import { useState, useEffect } from 'react';
import { SneakerAPI } from '@/services/api/sneakerAPI';
import type { SneakerProduct } from '@/services/api/types';

export function useMostPopular(limit: number = 20) {
    const [products, setProducts] = useState<SneakerProduct[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        SneakerAPI.getTrending(limit)
            .then(data => setProducts(data?.results || []))
            .catch(() => setError('Failed to load trending sneakers'))
            .finally(() => setLoading(false));
    }, [limit]);

    return { products, loading, error };
}
