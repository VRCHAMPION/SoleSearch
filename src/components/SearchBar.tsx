'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X } from 'lucide-react';
import { useAutocomplete } from '@/hooks/useAutocomplete';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SearchBar() {
    const [query, setQuery] = useState('');
    const [focused, setFocused] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();
    const { suggestions, loading } = useAutocomplete(query);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            router.push(`/search?q=${encodeURIComponent(query.trim())}`);
            setFocused(false);
        }
    };

    const handleSelect = (styleID: string) => {
        router.push(`/product/${styleID}`);
        setFocused(false);
        setQuery('');
    };

    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                inputRef.current?.focus();
            }
        };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, []);

    return (
        <section style={{ padding: '40px 24px 60px', position: 'relative', zIndex: 10 }}>
            <div style={{ maxWidth: 720, margin: '0 auto' }}>
                {/* Search Input */}
                <form onSubmit={handleSubmit}>
                    <motion.div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 12,
                            background: 'var(--surface)',
                            border: `2px solid ${focused ? 'var(--accent-primary)' : 'var(--border)'}`,
                            borderRadius: 16,
                            padding: '14px 20px',
                            transition: 'border-color 0.2s, box-shadow 0.2s',
                            boxShadow: focused ? '0 0 0 4px rgba(204, 255, 0, 0.08)' : 'none',
                        }}
                    >
                        <Search size={20} style={{ color: 'var(--text-secondary)', flexShrink: 0 }} />
                        <input
                            ref={inputRef}
                            type="text"
                            placeholder="Search any sneaker... e.g. 'Air Jordan 1 Retro High OG'"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onFocus={() => setFocused(true)}
                            onBlur={() => setTimeout(() => setFocused(false), 200)}
                            style={{
                                flex: 1,
                                background: 'transparent',
                                border: 'none',
                                color: 'var(--text-primary)',
                                fontSize: 15,
                                outline: 'none',
                                fontFamily: "'Inter', sans-serif",
                            }}
                        />
                        {query && (
                            <button
                                type="button"
                                onClick={() => setQuery('')}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    color: 'var(--text-secondary)',
                                    cursor: 'pointer',
                                    padding: 4,
                                }}
                            >
                                <X size={16} />
                            </button>
                        )}
                    </motion.div>
                </form>

                {/* Autocomplete Dropdown */}
                <AnimatePresence>
                    {focused && query.length >= 2 && (
                        <motion.div
                            initial={{ opacity: 0, y: -8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            transition={{ duration: 0.15 }}
                            style={{
                                marginTop: 8,
                                background: 'var(--surface)',
                                border: '1px solid var(--border)',
                                borderRadius: 16,
                                overflow: 'hidden',
                                boxShadow: '0 16px 48px rgba(0,0,0,0.4)',
                            }}
                        >
                            {loading ? (
                                <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: 14 }}>
                                    Searching...
                                </div>
                            ) : suggestions.length > 0 ? (
                                suggestions.map((suggestion) => (
                                    <button
                                        key={suggestion.styleID}
                                        onClick={() => handleSelect(suggestion.styleID)}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 14,
                                            padding: '12px 16px',
                                            width: '100%',
                                            textAlign: 'left',
                                            background: 'transparent',
                                            border: 'none',
                                            color: 'var(--text-primary)',
                                            transition: 'background 0.15s',
                                            borderBottom: '1px solid var(--border)',
                                            cursor: 'pointer',
                                        }}
                                        onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg-secondary)')}
                                        onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                                    >
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            src={suggestion.thumbnail}
                                            alt={suggestion.shoeName}
                                            style={{
                                                width: 44,
                                                height: 44,
                                                borderRadius: 8,
                                                objectFit: 'contain',
                                                background: 'var(--bg-secondary)',
                                            }}
                                        />
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontSize: 14, fontWeight: 600 }}>{suggestion.shoeName}</div>
                                            <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                                                {suggestion.brand} · {suggestion.colorway}
                                            </div>
                                        </div>
                                        <span
                                            className="font-mono"
                                            style={{ fontSize: 14, fontWeight: 600, color: 'var(--success)' }}
                                        >
                                            {suggestion.lowestPrice < Infinity ? `$${suggestion.lowestPrice}` : '—'}
                                        </span>
                                    </button>
                                ))
                            ) : (
                                <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: 14 }}>
                                    No sneakers found for &ldquo;{query}&rdquo;
                                </div>
                            )}

                            {/* View all link */}
                            {suggestions.length > 0 && (
                                <Link
                                    href={`/search?q=${encodeURIComponent(query)}`}
                                    style={{
                                        display: 'block',
                                        textAlign: 'center',
                                        padding: '12px',
                                        fontSize: 13,
                                        fontWeight: 600,
                                        color: 'var(--accent-primary)',
                                        textDecoration: 'none',
                                        transition: 'background 0.15s',
                                    }}
                                    onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg-secondary)')}
                                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                                >
                                    View all results →
                                </Link>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </section>
    );
}
