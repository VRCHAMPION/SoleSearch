'use client';

import { useStore } from '@/store/store';
import { X, SlidersHorizontal } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const DEFAULT_BRANDS = ['Nike', 'adidas', 'Jordan', 'New Balance', 'Puma', 'ASICS', 'Converse', 'Reebok', 'Vans'];
const sizes = [6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 11.5, 12, 13, 14];

interface FilterPanelProps {
    brands?: string[];
}

export default function FilterPanel({ brands }: FilterPanelProps) {
    const {
        selectedBrands, toggleBrand, clearBrands,
        priceRange, setPriceRange,
        selectedSizes, toggleSize, clearSizes,
    } = useStore();
    const [mobileOpen, setMobileOpen] = useState(false);

    const allBrands = brands && brands.length > 0 ? brands : DEFAULT_BRANDS;

    const filterContent = (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {/* Brands */}
            <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <h4 style={{ fontSize: 13, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-secondary)' }}>
                        Brand
                    </h4>
                    {selectedBrands.length > 0 && (
                        <button onClick={clearBrands} style={{ background: 'none', border: 'none', fontSize: 11, color: 'var(--accent-primary)', cursor: 'pointer' }}>
                            Clear
                        </button>
                    )}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {allBrands.map((brand) => (
                        <label
                            key={brand}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 10,
                                padding: '8px 0',
                                cursor: 'pointer',
                                fontSize: 14,
                                color: selectedBrands.includes(brand) ? 'var(--text-primary)' : 'var(--text-secondary)',
                                transition: 'color 0.2s',
                            }}
                        >
                            <input
                                type="checkbox"
                                checked={selectedBrands.includes(brand)}
                                onChange={() => toggleBrand(brand)}
                                style={{ display: 'none' }}
                            />
                            <div
                                style={{
                                    width: 18,
                                    height: 18,
                                    borderRadius: 5,
                                    border: `1.5px solid ${selectedBrands.includes(brand) ? 'var(--accent-primary)' : 'var(--border)'}`,
                                    background: selectedBrands.includes(brand) ? 'var(--accent-primary)' : 'transparent',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    transition: 'all 0.2s',
                                    flexShrink: 0,
                                }}
                            >
                                {selectedBrands.includes(brand) && (
                                    <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                                        <path d="M1 4L3.5 6.5L9 1" stroke="#0A0A0A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                )}
                            </div>
                            {brand}
                        </label>
                    ))}
                </div>
            </div>

            {/* Price Range */}
            <div>
                <h4 style={{ fontSize: 13, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-secondary)', marginBottom: 12 }}>
                    Price Range
                </h4>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div
                        style={{
                            flex: 1,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 6,
                            background: 'var(--bg-secondary)',
                            borderRadius: 8,
                            padding: '8px 10px',
                            border: '1px solid var(--border)',
                        }}
                    >
                        <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>$</span>
                        <input
                            type="number"
                            value={priceRange[0]}
                            onChange={(e) => setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])}
                            style={{
                                width: '100%',
                                background: 'transparent',
                                border: 'none',
                                color: 'var(--text-primary)',
                                fontSize: 13,
                                outline: 'none',
                            }}
                        />
                    </div>
                    <span style={{ color: 'var(--text-secondary)', fontSize: 12 }}>to</span>
                    <div
                        style={{
                            flex: 1,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 6,
                            background: 'var(--bg-secondary)',
                            borderRadius: 8,
                            padding: '8px 10px',
                            border: '1px solid var(--border)',
                        }}
                    >
                        <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>$</span>
                        <input
                            type="number"
                            value={priceRange[1]}
                            onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value) || 2000])}
                            style={{
                                width: '100%',
                                background: 'transparent',
                                border: 'none',
                                color: 'var(--text-primary)',
                                fontSize: 13,
                                outline: 'none',
                            }}
                        />
                    </div>
                </div>
            </div>

            {/* Sizes */}
            <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <h4 style={{ fontSize: 13, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-secondary)' }}>
                        Size (US)
                    </h4>
                    {selectedSizes.length > 0 && (
                        <button onClick={clearSizes} style={{ background: 'none', border: 'none', fontSize: 11, color: 'var(--accent-primary)', cursor: 'pointer' }}>
                            Clear
                        </button>
                    )}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6 }}>
                    {sizes.map((size) => (
                        <button
                            key={size}
                            onClick={() => toggleSize(size)}
                            style={{
                                height: 36,
                                borderRadius: 8,
                                border: `1.5px solid ${selectedSizes.includes(size) ? 'var(--accent-primary)' : 'var(--border)'}`,
                                background: selectedSizes.includes(size) ? 'rgba(204, 255, 0, 0.08)' : 'transparent',
                                color: selectedSizes.includes(size) ? 'var(--accent-primary)' : 'var(--text-secondary)',
                                fontSize: 12,
                                fontWeight: 500,
                                cursor: 'pointer',
                                transition: 'all 0.15s',
                            }}
                        >
                            {size}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );

    return (
        <>
            {/* Desktop Sidebar */}
            <div
                className="filter-desktop"
                style={{
                    background: 'var(--surface)',
                    border: '1px solid var(--border)',
                    borderRadius: 16,
                    padding: 20,
                    position: 'sticky',
                    top: 96,
                }}
            >
                <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <SlidersHorizontal size={16} style={{ color: 'var(--accent-primary)' }} />
                    Filters
                </h3>
                {filterContent}
            </div>

            {/* Mobile Filter Button */}
            <button
                onClick={() => setMobileOpen(true)}
                className="filter-mobile-btn"
                style={{
                    display: 'none',
                    alignItems: 'center',
                    gap: 8,
                    padding: '10px 16px',
                    borderRadius: 10,
                    border: '1px solid var(--border)',
                    background: 'var(--surface)',
                    color: 'var(--text-primary)',
                    fontSize: 14,
                    fontWeight: 500,
                    cursor: 'pointer',
                    width: '100%',
                    justifyContent: 'center',
                    marginBottom: 16,
                }}
            >
                <SlidersHorizontal size={16} /> Filters
                {selectedBrands.length + selectedSizes.length > 0 && (
                    <span
                        style={{
                            background: 'var(--accent-primary)',
                            color: '#0A0A0A',
                            fontSize: 11,
                            fontWeight: 600,
                            width: 20,
                            height: 20,
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        {selectedBrands.length + selectedSizes.length}
                    </span>
                )}
            </button>

            {/* Mobile Filter Drawer */}
            <AnimatePresence>
                {mobileOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setMobileOpen(false)}
                            style={{
                                position: 'fixed',
                                inset: 0,
                                background: 'rgba(0,0,0,0.5)',
                                zIndex: 200,
                            }}
                        />
                        <motion.div
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ duration: 0.3, ease: 'easeInOut' }}
                            style={{
                                position: 'fixed',
                                top: 0,
                                left: 0,
                                bottom: 0,
                                width: '85%',
                                maxWidth: 340,
                                zIndex: 201,
                                background: 'var(--bg-secondary)',
                                padding: 24,
                                overflowY: 'auto',
                            }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                                <h3 style={{ fontSize: 18, fontWeight: 600 }}>Filters</h3>
                                <button
                                    onClick={() => setMobileOpen(false)}
                                    style={{
                                        width: 32,
                                        height: 32,
                                        borderRadius: 8,
                                        border: '1px solid var(--border)',
                                        background: 'transparent',
                                        color: 'var(--text-secondary)',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <X size={16} />
                                </button>
                            </div>
                            {filterContent}
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            <style jsx global>{`
                @media (max-width: 1024px) {
                    .filter-desktop { display: none !important; }
                    .filter-mobile-btn { display: flex !important; }
                }
            `}</style>
        </>
    );
}
