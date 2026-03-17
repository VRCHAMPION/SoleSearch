'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SoleSearchState {
    theme: 'dark' | 'light';
    toggleTheme: () => void;
    setTheme: (theme: 'dark' | 'light') => void;

    watchlist: string[];
    addToWatchlist: (id: string) => void;
    removeFromWatchlist: (id: string) => void;
    isInWatchlist: (id: string) => boolean;

    searchQuery: string;
    setSearchQuery: (q: string) => void;

    selectedBrands: string[];
    toggleBrand: (brand: string) => void;
    clearBrands: () => void;

    priceRange: [number, number];
    setPriceRange: (range: [number, number]) => void;

    selectedSizes: number[];
    toggleSize: (size: number) => void;
    clearSizes: () => void;

    selectedConditions: string[];
    toggleCondition: (condition: string) => void;

    sortBy: string;
    setSortBy: (sort: string) => void;

    searchOpen: boolean;
    setSearchOpen: (open: boolean) => void;
}

export const useStore = create<SoleSearchState>()(
    persist(
        (set, get) => ({
            theme: 'dark',
            toggleTheme: () => set((s) => ({ theme: s.theme === 'dark' ? 'light' : 'dark' })),
            setTheme: (theme) => set({ theme }),

            watchlist: [],
            addToWatchlist: (id) => set((s) => ({ watchlist: [...s.watchlist, id] })),
            removeFromWatchlist: (id) => set((s) => ({ watchlist: s.watchlist.filter((w) => w !== id) })),
            isInWatchlist: (id) => get().watchlist.includes(id),

            searchQuery: '',
            setSearchQuery: (q) => set({ searchQuery: q }),

            selectedBrands: [],
            toggleBrand: (brand) =>
                set((s) => ({
                    selectedBrands: s.selectedBrands.includes(brand)
                        ? s.selectedBrands.filter((b) => b !== brand)
                        : [...s.selectedBrands, brand],
                })),
            clearBrands: () => set({ selectedBrands: [] }),

            priceRange: [0, 2000],
            setPriceRange: (range) => set({ priceRange: range }),

            selectedSizes: [],
            toggleSize: (size) =>
                set((s) => ({
                    selectedSizes: s.selectedSizes.includes(size)
                        ? s.selectedSizes.filter((sz) => sz !== size)
                        : [...s.selectedSizes, size],
                })),
            clearSizes: () => set({ selectedSizes: [] }),

            selectedConditions: [],
            toggleCondition: (condition) =>
                set((s) => ({
                    selectedConditions: s.selectedConditions.includes(condition)
                        ? s.selectedConditions.filter((c) => c !== condition)
                        : [...s.selectedConditions, condition],
                })),

            sortBy: 'price-low',
            setSortBy: (sort) => set({ sortBy: sort }),

            searchOpen: false,
            setSearchOpen: (open) => set({ searchOpen: open }),
        }),
        {
            name: 'solesearch-store',
            partialize: (state) => ({ theme: state.theme, watchlist: state.watchlist }),
        }
    )
);
