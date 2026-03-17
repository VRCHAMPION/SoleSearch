'use client';

import { useStore } from '@/store/store';
import { ChevronDown } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

const sortOptions = [
    { value: 'price-low', label: '💰 Lowest Price', description: 'Best deal first' },
    { value: 'price-high', label: '💰 Highest Price', description: 'For resale scouting' },
    { value: 'popular', label: '🔥 Most Popular', description: 'By search volume' },
    { value: 'price-drop', label: '📈 Biggest Price Drop', description: 'Largest decrease' },
    { value: 'newest', label: '🆕 Newest Listed', description: 'Recently listed' },
    { value: 'rating', label: '⭐ Retailer Rating', description: 'By reliability' },
];

export default function SortBar() {
    const { sortBy, setSortBy } = useStore();
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    const current = sortOptions.find((o) => o.value === sortBy) || sortOptions[0];

    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        };
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, []);

    return (
        <div ref={ref} style={{ position: 'relative' }}>
            <button
                onClick={() => setOpen(!open)}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '10px 16px',
                    borderRadius: 10,
                    border: '1px solid var(--border)',
                    background: 'var(--surface)',
                    color: 'var(--text-primary)',
                    cursor: 'pointer',
                    fontSize: 13,
                    fontWeight: 500,
                    transition: 'border-color 0.2s',
                }}
            >
                Sort: {current.label}
                <ChevronDown
                    size={14}
                    style={{
                        transition: 'transform 0.2s',
                        transform: open ? 'rotate(180deg)' : 'rotate(0)',
                    }}
                />
            </button>

            {open && (
                <div
                    style={{
                        position: 'absolute',
                        top: 'calc(100% + 8px)',
                        right: 0,
                        width: 260,
                        background: 'var(--surface)',
                        border: '1px solid var(--border)',
                        borderRadius: 12,
                        overflow: 'hidden',
                        boxShadow: '0 12px 40px rgba(0,0,0,0.4)',
                        zIndex: 50,
                    }}
                >
                    {sortOptions.map((option) => (
                        <button
                            key={option.value}
                            onClick={() => {
                                setSortBy(option.value);
                                setOpen(false);
                            }}
                            style={{
                                width: '100%',
                                textAlign: 'left',
                                padding: '12px 16px',
                                border: 'none',
                                background:
                                    sortBy === option.value
                                        ? 'rgba(204, 255, 0, 0.06)'
                                        : 'transparent',
                                cursor: 'pointer',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 2,
                                transition: 'background 0.15s',
                                borderLeft:
                                    sortBy === option.value
                                        ? '3px solid var(--accent-primary)'
                                        : '3px solid transparent',
                            }}
                            onMouseEnter={(e) => {
                                if (sortBy !== option.value) e.currentTarget.style.background = 'var(--bg-secondary)';
                            }}
                            onMouseLeave={(e) => {
                                if (sortBy !== option.value) e.currentTarget.style.background = 'transparent';
                            }}
                        >
                            <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)' }}>
                                {option.label}
                            </span>
                            <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>
                                {option.description}
                            </span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
