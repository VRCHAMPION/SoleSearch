'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { TrendingUp } from 'lucide-react';
import { useMostPopular } from '@/hooks/useMostPopular';
import { getLowestPrice } from '@/lib/utils';
import SkeletonCard from '@/components/ui/SkeletonCard';

export default function TrendingPage() {
    const { products, loading, error } = useMostPopular(40);

    return (
        <div style={{ paddingTop: 96, minHeight: '100vh' }}>
            <div style={{ maxWidth: 1400, margin: '0 auto', padding: '0 24px' }}>
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ marginBottom: 40 }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                        <TrendingUp size={28} style={{ color: 'var(--accent-primary)' }} />
                        <h1
                            className="font-display"
                            style={{
                                fontSize: 'clamp(32px, 4vw, 48px)',
                                fontWeight: 700,
                                letterSpacing: '-0.02em',
                            }}
                        >
                            Trending Now
                        </h1>
                    </div>
                    <p style={{ fontSize: 16, color: 'var(--text-secondary)' }}>
                        The most popular sneakers right now, curated by market activity.
                    </p>
                </motion.div>

                {/* Grid */}
                {loading ? (
                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                            gap: 20,
                        }}
                    >
                        {Array.from({ length: 12 }).map((_, i) => (
                            <SkeletonCard key={i} />
                        ))}
                    </div>
                ) : error ? (
                    <div style={{ textAlign: 'center', padding: '80px 24px', color: 'var(--text-secondary)' }}>
                        <h3 style={{ fontSize: 20, fontWeight: 600, marginBottom: 8, color: 'var(--text-primary)' }}>
                            {error}
                        </h3>
                        <p>Try refreshing the page.</p>
                    </div>
                ) : (
                    <motion.div
                        style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                            gap: 20,
                        }}
                    >
                        {products.map((sneaker, i) => {
                            const lowest = getLowestPrice(sneaker);
                            const belowRetail = lowest && sneaker.retailPrice ? lowest < sneaker.retailPrice : false;

                            return (
                                <motion.div
                                    key={sneaker.styleID || i}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.04 }}
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
                                                {belowRetail && (
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
                                                        }}
                                                    >
                                                        Below Retail
                                                    </span>
                                                )}
                                                <span
                                                    style={{
                                                        position: 'absolute',
                                                        top: 10,
                                                        right: 10,
                                                        background: 'rgba(204, 255, 0, 0.12)',
                                                        color: 'var(--accent-primary)',
                                                        fontSize: 11,
                                                        fontWeight: 600,
                                                        padding: '4px 10px',
                                                        borderRadius: 20,
                                                    }}
                                                >
                                                    #{i + 1}
                                                </span>
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
                                                        {lowest ? `$${lowest}` : '—'}
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
                            );
                        })}
                    </motion.div>
                )}
            </div>
        </div>
    );
}
