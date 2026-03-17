'use client';

import { useEffect } from 'react';
import { useStore } from '@/store/store';

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
    const theme = useStore((s) => s.theme);

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
    }, [theme]);

    // Sync with system preference on mount
    useEffect(() => {
        const stored = localStorage.getItem('solesearch-store');
        if (!stored) {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            useStore.getState().setTheme(prefersDark ? 'dark' : 'light');
        }
    }, []);

    return <>{children}</>;
}
