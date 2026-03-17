'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { TrendingUp, ArrowUpRight } from 'lucide-react';
import { useMostPopular } from '@/hooks/useMostPopular';
import { getLowestPrice } from '@/lib/utils';
import SkeletonCard from '@/components/ui/SkeletonCard';
import HeartButton from '@/components/watchlist/HeartButton';

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.08 },
    },
};

const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function TrendingGrid() {
    const { products, loading, error } = useMostPopular(10);

    if (error) return null;

    return (
        <section
            style={{
                padding: '40px 24px 80px',
                maxWidth: 1400,
                margin: '0 auto',
            }}
        >
            {/* Section Header */}
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: 32,
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <TrendingUp size={22} style={{ color: 'var(--accent-primary)' }} />
                    <h2
                        className="font-display"
                        style={{
                            fontSize: 'clamp(24px, 3vw, 36px)',
                            fontWeight: 700,
                            letterSpacing: '-0.02em',
                        }}
                    >
                        Trending Now
                    </h2>
                </div>
                <Link
                    href="/trending"
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                        color: 'var(--accent-primary)',
                        textDecoration: 'none',
                        fontSize: 14,
                        fontWeight: 600,
                        transition: 'gap 0.2s',
                    }}
                >
                    View All <ArrowUpRight size={16} />
                </Link>
            </div>

            {/* Loading State */}
            {loading ? (
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                        gap: 16,
                    }}
                >
                    {Array.from({ length: 6 }).map((_, i) => (
                        <SkeletonCard key={i} />
                    ))}
                </div>
            ) : (
                /* Bento Grid */
                <motion.div
                    variants={container}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: '-100px' }}
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(12, 1fr)',
                        gridAutoRows: 'minmax(200px, auto)',
                        gap: 16,
                    }}
                    className="trending-bento"
                >
                    {(products || []).slice(0, 10).map((sneaker, i) => {
                        const lowest = getLowestPrice(sneaker);
                        const belowRetail = lowest && sneaker.retailPrice ? lowest < sneaker.retailPrice : false;

                        // Bento layout: first 2 are large (6 cols each), then 4 medium (3 cols), then 4 small (3 cols)
                        let gridColumn = 'span 3';
                        let gridRow = 'span 1';
                        let imgHeight = 180;

                        if (i < 2) {
                            gridColumn = 'span 6';
                            gridRow = 'span 2';
                            imgHeight = 280;
                        } else if (i < 6) {
                            gridColumn = 'span 3';
                            gridRow = 'span 1';
                            imgHeight = 180;
                        }

                        return (
                            <motion.div
                                key={sneaker.styleID || i}
                                variants={item}
                                style={{ gridColumn, gridRow }}
                                className="trending-card-wrapper"
                            >
                                <Link
                                    href={`/product/${sneaker.styleID}`}
                                    style={{ textDecoration: 'none', color: 'inherit', display: 'block', height: '100%' }}
                                >
                                    <div
                                        className="card"
                                        style={{
                                            height: '100%',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            cursor: 'pointer',
                                            overflow: 'hidden',
                                        }}
                                    >
                                        <div
                                            style={{
                                                height: imgHeight,
                                                position: 'relative',
                                                overflow: 'hidden',
                                                background: 'var(--bg-secondary)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                padding: 16,
                                                flexShrink: 0,
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
                                            {/* Heart Button */}
                                            <div className="absolute top-3 right-3 z-20">
                                                <HeartButton sneaker={sneaker} />
                                            </div>
                                            {/* Badges */}
                                            <div
                                                style={{
                                                    position: 'absolute',
                                                    top: 10,
                                                    left: 10,
                                                    display: 'flex',
                                                    gap: 6,
                                                }}
                                            >
                                                <span
                                                    style={{
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
                                                {belowRetail && (
                                                    <span
                                                        style={{
                                                            background: 'rgba(50, 215, 75, 0.15)',
                                                            color: 'var(--success)',
                                                            fontSize: 11,
                                                            fontWeight: 600,
                                                            padding: '4px 10px',
                                                            borderRadius: 20,
                                                        }}
                                                    >
                                                        Below Retail
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <div style={{ padding: 16, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                            <div>
                                                <div
                                                    style={{
                                                        fontSize: 11,
                                                        fontWeight: 600,
                                                        textTransform: 'uppercase',
                                                        letterSpacing: '0.06em',
                                                        color: 'var(--text-secondary)',
                                                        marginBottom: 4,
                                                    }}
                                                >
                                                    {sneaker.brand}
                                                </div>
                                                <h3
                                                    style={{
                                                        fontSize: i < 2 ? 18 : 14,
                                                        fontWeight: 600,
                                                        lineHeight: 1.3,
                                                        marginBottom: 6,
                                                        display: '-webkit-box',
                                                        WebkitLineClamp: 2,
                                                        WebkitBoxOrient: 'vertical',
                                                        overflow: 'hidden',
                                                    }}
                                                >
                                                    {sneaker.shoeName}
                                                </h3>
                                                <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                                                    {sneaker.colorway}
                                                </div>
                                            </div>
                                            <div
                                                style={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'flex-end',
                                                    marginTop: 12,
                                                    paddingTop: 12,
                                                    borderTop: '1px solid var(--border)',
                                                }}
                                            >
                                                <div>
                                                    <div style={{ fontSize: 10, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                                                        Lowest
                                                    </div>
                                                    <span
                                                        className="font-mono"
                                                        style={{
                                                            fontSize: i < 2 ? 22 : 18,
                                                            fontWeight: 700,
                                                            color: 'var(--success)',
                                                        }}
                                                    >
                                                        {lowest ? `$${lowest}` : '—'}
                                                    </span>
                                                </div>
                                                {sneaker.retailPrice > 0 && (
                                                    <div style={{ textAlign: 'right' }}>
                                                        <div style={{ fontSize: 10, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                                                            Retail
                                                        </div>
                                                        <span
                                                            className="font-mono"
                                                            style={{ fontSize: 14, color: 'var(--text-secondary)' }}
                                                        >
                                                            ${sneaker.retailPrice}
                                                        </span>
                                                    </div>
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

            <style jsx global>{`
                @media (max-width: 1024px) {
                    .trending-bento { grid-template-columns: repeat(6, 1fr) !important; }
                    .trending-card-wrapper { grid-column: span 3 !important; grid-row: span 1 !important; }
                }
                @media (max-width: 640px) {
                    .trending-bento { grid-template-columns: 1fr !important; }
                    .trending-card-wrapper { grid-column: span 1 !important; grid-row: span 1 !important; }
                }
            `}</style>
        </section>
    );
}
