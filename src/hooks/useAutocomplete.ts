'use client';

import { useState, useEffect, useRef } from 'react';
import { SneakerAPI } from '@/services/api/sneakerAPI';
import type { AutocompleteSuggestion } from '@/services/api/types';

export function useAutocomplete(query: string, delay = 300) {
    const [suggestions, setSuggestions] = useState<AutocompleteSuggestion[]>([]);
    const [loading, setLoading] = useState(false);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

    useEffect(() => {
        if (query.length < 2) {
            setSuggestions([]);
            return;
        }

        clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(async () => {
            setLoading(true);
            try {
                const data = await SneakerAPI.autocomplete(query);
                setSuggestions(data.results);
            } catch {
                setSuggestions([]);
            } finally {
                setLoading(false);
            }
        }, delay);

        return () => clearTimeout(timeoutRef.current);
    }, [query, delay]);

    return { suggestions, loading };
}
