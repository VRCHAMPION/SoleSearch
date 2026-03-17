'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState, Suspense } from 'react';
import { motion } from 'framer-motion';
import { useSneakerSearch } from '@/hooks/useSneakerSearch';
import { enrichProducts, sortProducts, filterProducts } from '@/lib/utils';
import { useStore } from '@/store/store';
import FilterPanel from '@/components/FilterPanel';
import SortBar from '@/components/SortBar';
import SkeletonCard from '@/components/ui/SkeletonCard';
import Link from 'next/link';
import { Grid3X3, LayoutList, Search } from 'lucide-react';

function SearchContent() {
    const searchParams = useSearchParams();
    const queryParam = searchParams.get('q') || '';
    const { results, loading, error, search } = useSneakerSearch();
    const { selectedBrands, priceRange, sortBy } = useStore();
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [localQuery, setLocalQuery] = useState(queryParam);

    useEffect(() => {
        if (queryParam) {
            search(queryParam, 40);
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setLocalQuery(queryParam);
        }
    }, [queryParam, search]);

    const handleLocalSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (localQuery.trim()) {
            search(localQuery.trim(), 40);
        }
    };

    const enriched = useMemo(() => enrichProducts(results), [results]);

    const filtered = useMemo(() => {
        const f = filterProducts(enriched, {
            brands: selectedBrands,
            priceRange,
        });
        return sortProducts(f, sortBy);
    }, [enriched, selectedBrands, priceRange, sortBy]);

    return (
        <div style={{ paddingTop: 96, minHeight: '100vh' }}>
            <div style={{ maxWidth: 1400, margin: '0 auto', padding: '0 24px' }}>
                {/* Page Header */}
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ marginBottom: 32 }}
                >
                    <h1
                        className="font-display"
                        style={{
                            fontSize: 'clamp(32px, 4vw, 48px)',
                            fontWeight: 700,
                            letterSpacing: '-0.02em',
                            marginBottom: 8,
                        }}
                    >
                        {queryParam ? `Results for "${queryParam}"` : 'Search Sneakers'}
                    </h1>
                    <p style={{ fontSize: 16, color: 'var(--text-secondary)' }}>
                        {loading ? 'Searching...' : `${filtered.length} sneakers found`}
                    </p>
                </motion.div>

                {/* Search + Controls Bar */}
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12,
                        marginBottom: 24,
                        flexWrap: 'wrap',
                    }}
                >
                    <form
                        onSubmit={handleLocalSearch}
                        style={{
                            flex: 1,
                            minWidth: 200,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 10,
                            background: 'var(--surface)',
                            border: '1px solid var(--border)',
                            borderRadius: 10,
                            padding: '10px 14px',
                        }}
                    >
                        <Search size={16} style={{ color: 'var(--text-secondary)' }} />
                        <input
                            type="text"
                            placeholder="Search sneakers..."
                            value={localQuery}
                            onChange={(e) => setLocalQuery(e.target.value)}
                            style={{
                                flex: 1,
                                background: 'transparent',
                                border: 'none',
                                color: 'var(--text-primary)',
                                fontSize: 14,
                                outline: 'none',
                            }}
                        />
                    </form>

                    <SortBar />

                    {/* View Mode Toggle */}
                    <div style={{ display: 'flex', gap: 4, background: 'var(--surface)', borderRadius: 10, padding: 4, border: '1px solid var(--border)' }}>
                        <button
                            onClick={() => setViewMode('grid')}
                            style={{
                                width: 36, height: 36, borderRadius: 8, border: 'none',
                                background: viewMode === 'grid' ? 'var(--accent-primary)' : 'transparent',
                                color: viewMode === 'grid' ? '#0A0A0A' : 'var(--text-secondary)',
                                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}
                        >
                            <Grid3X3 size={16} />
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            style={{
                                width: 36, height: 36, borderRadius: 8, border: 'none',
                                background: viewMode === 'list' ? 'var(--accent-primary)' : 'transparent',
                                color: viewMode === 'list' ? '#0A0A0A' : 'var(--text-secondary)',
                                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}
                        >
                            <LayoutList size={16} />
                        </button>
                    </div>

                    <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                        {filtered.length} results
                    </span>
                </div>

                {/* Main Layout: Sidebar + Grid */}
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: '260px 1fr',
                        gap: 32,
                    }}
                    className="explore-layout"
                >
                    {/* Filter Sidebar */}
                    <div>
                        <FilterPanel brands={[...new Set(results.map(r => r.brand).filter(Boolean))]} />
                    </div>

                    {/* Results */}
                    <div>
                        {loading ? (
                            <div
                                style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
                                    gap: 16,
                                }}
                            >
                                {Array.from({ length: 8 }).map((_, i) => (
                                    <SkeletonCard key={i} />
                                ))}
                            </div>
                        ) : error ? (
                            <div style={{ textAlign: 'center', padding: '80px 24px', color: 'var(--text-secondary)' }}>
                                <h3 style={{ fontSize: 20, fontWeight: 600, marginBottom: 8, color: 'var(--text-primary)' }}>
                                    {error}
                                </h3>
                                <p>Try again in a moment.</p>
                            </div>
                        ) : viewMode === 'grid' ? (
                            <motion.div
                                style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
                                    gap: 16,
                                }}
                            >
                                {filtered.map((sneaker, i) => (
                                    <motion.div
                                        key={sneaker.styleID}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                    >
                                        <Link href={`/product/${sneaker.styleID}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                            <div className="card" style={{ cursor: 'pointer' }}>
                                                <div
                                                    style={{
                                                        height: 200,
                                                        position: 'relative',
                                                        overflow: 'hidden',
                                                        background: 'var(--bg-secondary)',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        padding: 16,
                                                    }}
                                                >
                                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                                    <img
                                                        src={sneaker.thumbnail}
                                                        alt={sneaker.shoeName}
                                                        style={{
                                                            maxWidth: '100%',
                                                            maxHeight: '100%',
                                                            objectFit: 'contain',
                                                            transition: 'transform 0.4s ease',
                                                        }}
                                                        onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
                                                        onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                                                    />
                                                    {sneaker._belowRetail && (
                                                        <span
                                                            style={{
                                                                position: 'absolute',
                                                                top: 10,
                                                                left: 10,
                                                                background: 'rgba(50, 215, 75, 0.15)',
                                                                color: 'var(--success)',
                                                                fontSize: 11,
                                                                fontWeight: 600,
                                                                padding: '4px 10px',
                                                                borderRadius: 20,
                                                                textTransform: 'uppercase',
                                                                letterSpacing: '0.05em',
                                                            }}
                                                        >
                                                            Below Retail
                                                        </span>
                                                    )}
                                                </div>
                                                <div style={{ padding: 16 }}>
                                                    <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginBottom: 4, fontWeight: 500 }}>
                                                        {sneaker.brand}
                                                    </div>
                                                    <h3 style={{
                                                        fontSize: 15,
                                                        fontWeight: 600,
                                                        marginBottom: 4,
                                                        whiteSpace: 'nowrap',
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                    }}>
                                                        {sneaker.shoeName}
                                                    </h3>
                                                    <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 12 }}>
                                                        {sneaker.colorway}
                                                    </div>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                        <span className="font-mono" style={{ fontSize: 18, fontWeight: 600, color: 'var(--success)' }}>
                                                            {sneaker._lowestPrice < Infinity ? `$${sneaker._lowestPrice}` : '—'}
                                                        </span>
                                                        {sneaker.retailPrice > 0 && (
                                                            <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                                                                Retail ${sneaker.retailPrice}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    </motion.div>
                                ))}
                            </motion.div>
                        ) : (
                            /* List View */
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                {filtered.map((sneaker, i) => (
                                    <motion.div
                                        key={sneaker.styleID}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.03 }}
                                    >
                                        <Link href={`/product/${sneaker.styleID}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                            <div
                                                className="card"
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: 20,
                                                    padding: 16,
                                                    cursor: 'pointer',
                                                }}
                                            >
                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                <img
                                                    src={sneaker.thumbnail}
                                                    alt={sneaker.shoeName}
                                                    style={{
                                                        width: 80,
                                                        height: 80,
                                                        borderRadius: 12,
                                                        objectFit: 'contain',
                                                        background: 'var(--bg-secondary)',
                                                    }}
                                                />
                                                <div style={{ flex: 1 }}>
                                                    <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginBottom: 2 }}>
                                                        {sneaker.brand}
                                                    </div>
                                                    <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 4 }}>
                                                        {sneaker.shoeName}
                                                    </div>
                                                    <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                                                        {sneaker.colorway}
                                                    </div>
                                                </div>
                                                <div style={{ textAlign: 'right' }}>
                                                    <span className="font-mono" style={{ fontSize: 22, fontWeight: 700, color: 'var(--success)' }}>
                                                        {sneaker._lowestPrice < Infinity ? `$${sneaker._lowestPrice}` : '—'}
                                                    </span>
                                                    {sneaker._bestRetailer && (
                                                        <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 4 }}>
                                                            via {sneaker._bestRetailer}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </Link>
                                    </motion.div>
                                ))}
                            </div>
                        )}

                        {!loading && filtered.length === 0 && !error && (
                            <div style={{ textAlign: 'center', padding: '80px 24px', color: 'var(--text-secondary)' }}>
                                <div style={{ fontSize: 48, marginBottom: 16 }}>👟</div>
                                <h3 style={{ fontSize: 20, fontWeight: 600, marginBottom: 8, color: 'var(--text-primary)' }}>
                                    No sneakers found
                                </h3>
                                <p>Try adjusting your filters or search query.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <style jsx global>{`
        @media (max-width: 1024px) {
          .explore-layout { grid-template-columns: 1fr !important; }
        }
      `}</style>
        </div>
    );
}

export default function SearchPage() {
    return (
        <Suspense fallback={
            <div style={{ paddingTop: 96, minHeight: '100vh' }}>
                <div style={{ maxWidth: 1400, margin: '0 auto', padding: '0 24px' }}>
                    <h1 className="font-display" style={{ fontSize: 36, fontWeight: 700, letterSpacing: '-0.02em' }}>
                        Searching...
                    </h1>
                </div>
            </div>
        }>
            <SearchContent />
        </Suspense>
    );
}
