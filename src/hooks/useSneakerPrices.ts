'use client';

import { useState, useEffect } from 'react';
import { SneakerAPI } from '@/services/api/sneakerAPI';
import type { SneakerProduct, BestDeal } from '@/services/api/types';

export function useSneakerPrices(styleID: string | null) {
    const [product, setProduct] = useState<SneakerProduct | null>(null);
    const [bestDeal, setBestDeal] = useState<BestDeal | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!styleID) return;

        let cancelled = false;
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setLoading(true);
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setError(null);

        SneakerAPI.getProduct(styleID)
            .then((data) => {
                if (!cancelled) {
                    setProduct(data.product);
                    setBestDeal(data.bestDeal);
                }
            })
            .catch(() => {
                if (!cancelled) setError('Failed to load product');
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });

        return () => { cancelled = true; };
    }, [styleID]);

    return { product, bestDeal, loading, error };
}
