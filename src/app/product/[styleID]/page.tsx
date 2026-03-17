'use client';

import { useParams } from 'next/navigation';
import { useSneakerPrices } from '@/hooks/useSneakerPrices';
import { useStore } from '@/store/store';
import { getLowestPrice, generatePriceHistory, formatRetailerName } from '@/lib/utils';
import PriceTable from '@/components/PriceTable';
import PriceChart from '@/components/PriceChart';
import SkeletonCard from '@/components/ui/SkeletonCard';
import { motion } from 'framer-motion';
import { Heart, Share2, TrendingDown, ArrowLeft, ShoppingBag, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { useState, useMemo } from 'react';
import HeartButton from '@/components/watchlist/HeartButton';

export default function ProductDetailPage() {
    const params = useParams();
    const styleID = params.styleID as string;
    const { product, bestDeal, loading, error } = useSneakerPrices(styleID);
    const { watchlist, addToWatchlist, removeFromWatchlist } = useStore();
    const [selectedSize, setSelectedSize] = useState<string | null>(null);

    const isWatchlisted = watchlist.includes(styleID);

    // Get available sizes from resellPrices
    const availableSizes = useMemo(() => {
        if (!product?.resellPrices) return [];
        const sizeSet = new Set<string>();
        Object.values(product.resellPrices).forEach(priceMap => {
            if (priceMap) {
                Object.keys(priceMap).forEach(size => sizeSet.add(size));
            }
        });
        return [...sizeSet].sort((a, b) => parseFloat(a) - parseFloat(b));
    }, [product]);

    // Generate price history based on lowest price
    const priceHistory = useMemo(() => {
        if (!product) return [];
        const lowest = getLowestPrice(product);
        return generatePriceHistory(lowest || product.retailPrice || 200);
    }, [product]);

    if (loading) {
        return (
            <div style={{ paddingTop: 96, maxWidth: 1400, margin: '0 auto', padding: '96px 24px 40px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48 }} className="pdp-grid">
                    <SkeletonCard />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        <div className="skeleton" style={{ height: 20, width: '40%', borderRadius: 6 }} />
                        <div className="skeleton" style={{ height: 40, width: '80%', borderRadius: 8 }} />
                        <div className="skeleton" style={{ height: 16, width: '50%', borderRadius: 6 }} />
                        <div className="skeleton" style={{ height: 120, borderRadius: 16, marginTop: 16 }} />
                    </div>
                </div>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div style={{ paddingTop: 120, textAlign: 'center', minHeight: '60vh' }}>
                <h1 className="font-display" style={{ fontSize: 32, marginBottom: 16 }}>
                    {error || 'Product not found'}
                </h1>
                <Link href="/" className="btn-primary">
                    Back to Home
                </Link>
            </div>
        );
    }

    const lowestPrice = getLowestPrice(product);
    const belowRetail = lowestPrice && product.retailPrice ? lowestPrice < product.retailPrice : false;

    return (
        <div style={{ paddingTop: 96 }}>
            <div style={{ maxWidth: 1400, margin: '0 auto', padding: '0 24px' }}>
                {/* Breadcrumb */}
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ marginBottom: 32 }}
                >
                    <Link
                        href="/"
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 8,
                            color: 'var(--text-secondary)',
                            textDecoration: 'none',
                            fontSize: 14,
                            transition: 'color 0.2s',
                        }}
                    >
                        <ArrowLeft size={16} /> Back to Home
                    </Link>
                </motion.div>

                {/* Main Content */}
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: 48,
                    }}
                    className="pdp-grid"
                >
                    {/* Left - Image */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div
                            style={{
                                borderRadius: 20,
                                overflow: 'hidden',
                                background: 'var(--surface)',
                                border: '1px solid var(--border)',
                                position: 'relative',
                                aspectRatio: '1',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                padding: 24,
                            }}
                        >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={product.thumbnail}
                                alt={product.shoeName}
                                style={{
                                    maxWidth: '100%',
                                    maxHeight: '100%',
                                    objectFit: 'contain',
                                }}
                            />
                            {/* Overlay badges */}
                            {belowRetail && (
                                <div style={{ position: 'absolute', top: 16, left: 16 }}>
                                    <span
                                        style={{
                                            background: 'rgba(50, 215, 75, 0.15)',
                                            color: 'var(--success)',
                                            fontSize: 11,
                                            fontWeight: 600,
                                            padding: '6px 12px',
                                            borderRadius: 20,
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.05em',
                                        }}
                                    >
                                        ✓ Below Retail
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Additional Images */}
                        {product.imageLinks && product.imageLinks.length > 0 && (
                            <div style={{ display: 'flex', gap: 10, marginTop: 12, flexWrap: 'wrap' }}>
                                {[product.thumbnail, ...product.imageLinks].slice(0, 5).map((img, i) => (
                                    <div
                                        key={i}
                                        style={{
                                            width: 72,
                                            height: 72,
                                            borderRadius: 10,
                                            overflow: 'hidden',
                                            border: i === 0 ? '2px solid var(--accent-primary)' : '1px solid var(--border)',
                                            cursor: 'pointer',
                                            transition: 'border-color 0.2s',
                                            background: 'var(--bg-secondary)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            padding: 4,
                                        }}
                                    >
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src={img} alt="" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                                    </div>
                                ))}
                            </div>
                        )}
                    </motion.div>

                    {/* Right - Details */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        {/* Brand */}
                        <span
                            style={{
                                fontSize: 13,
                                fontWeight: 600,
                                textTransform: 'uppercase',
                                letterSpacing: '0.08em',
                                color: 'var(--accent-primary)',
                                marginBottom: 8,
                                display: 'block',
                            }}
                        >
                            {product.brand}
                        </span>

                        {/* Name */}
                        <h1
                            className="font-display"
                            style={{
                                fontSize: 'clamp(28px, 3.5vw, 42px)',
                                fontWeight: 700,
                                lineHeight: 1.15,
                                letterSpacing: '-0.02em',
                                marginBottom: 6,
                            }}
                        >
                            {product.shoeName}
                        </h1>

                        {/* Colorway & Style ID */}
                        <p style={{ fontSize: 16, color: 'var(--text-secondary)', marginBottom: 4 }}>
                            {product.colorway}
                        </p>
                        <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 24, fontFamily: "'JetBrains Mono', monospace" }}>
                            {product.styleID}
                        </p>

                        {/* Price Block */}
                        <div
                            style={{
                                background: 'var(--surface)',
                                border: '1px solid var(--border)',
                                borderRadius: 16,
                                padding: 24,
                                marginBottom: 24,
                            }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                                <div>
                                    <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 6 }}>
                                        {bestDeal ? 'Best Deal' : 'Lowest Price'}
                                    </div>
                                    <div
                                        className="font-mono"
                                        style={{
                                            fontSize: 36,
                                            fontWeight: 700,
                                            color: 'var(--success)',
                                        }}
                                    >
                                        {bestDeal ? `$${bestDeal.price}` : lowestPrice ? `$${lowestPrice}` : '—'}
                                    </div>
                                </div>
                                {product.retailPrice > 0 && (
                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 4 }}>Retail Price</div>
                                        <div
                                            className="font-mono"
                                            style={{ fontSize: 18, color: 'var(--text-secondary)', textDecoration: 'line-through' }}
                                        >
                                            ${product.retailPrice}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {bestDeal && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'var(--text-secondary)' }}>
                                    via {formatRetailerName(bestDeal.retailer)} · Size {bestDeal.size}
                                    {bestDeal.link && (
                                        <a
                                            href={bestDeal.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            style={{
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                gap: 4,
                                                color: 'var(--accent-primary)',
                                                textDecoration: 'none',
                                                marginLeft: 8,
                                            }}
                                        >
                                            Buy <ExternalLink size={12} />
                                        </a>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Size Selector */}
                        {availableSizes.length > 0 && (
                            <div style={{ marginBottom: 24 }}>
                                <h4 style={{ fontSize: 13, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-secondary)', marginBottom: 12 }}>
                                    Select Size
                                </h4>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                                    {availableSizes.map((size) => (
                                        <button
                                            key={size}
                                            onClick={() => setSelectedSize(selectedSize === size ? null : size)}
                                            style={{
                                                width: 52,
                                                height: 42,
                                                borderRadius: 10,
                                                border: `1.5px solid ${selectedSize === size ? 'var(--accent-primary)' : 'var(--border)'}`,
                                                background: selectedSize === size ? 'rgba(204, 255, 0, 0.08)' : 'transparent',
                                                color: selectedSize === size ? 'var(--accent-primary)' : 'var(--text-primary)',
                                                fontSize: 13,
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
                        )}

                        {/* Action Buttons */}
                        <div style={{ display: 'flex', gap: 12, marginBottom: 32 }}>
                            <div className="flex-1 flex justify-center items-center py-2 rounded-xl border border-gray-800 bg-[#1A1A1A]">
                                <HeartButton sneaker={product} className="w-full flex justify-center py-2 bg-transparent border-none hover:bg-transparent !p-0" />
                                <span className="ml-2 text-sm font-medium text-white">Watchlist</span>
                            </div>

                            <button
                                className="btn-secondary"
                                style={{ padding: '14px 20px' }}
                            >
                                <Share2 size={16} />
                            </button>
                        </div>

                        {/* Description */}
                        {product.description && (
                            <div style={{ marginBottom: 32 }}>
                                <h4 style={{ fontSize: 13, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-secondary)', marginBottom: 10 }}>
                                    Description
                                </h4>
                                <p
                                    style={{ fontSize: 14, lineHeight: 1.7, color: 'var(--text-secondary)' }}
                                    dangerouslySetInnerHTML={{ __html: product.description }}
                                />
                            </div>
                        )}

                        {/* Release Date */}
                        {product.releaseDate && (
                            <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                                Release Date: {product.releaseDate}
                            </div>
                        )}
                    </motion.div>
                </div>

                {/* Price Comparison */}
                <motion.section
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    style={{ marginTop: 64 }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
                        <ShoppingBag size={18} style={{ color: 'var(--accent-primary)' }} />
                        <h2
                            className="font-display"
                            style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-0.02em' }}
                        >
                            Price Comparison
                        </h2>
                        {selectedSize && (
                            <span style={{ fontSize: 13, color: 'var(--text-secondary)', marginLeft: 'auto' }}>
                                Size {selectedSize}
                            </span>
                        )}
                    </div>
                    <PriceTable product={product} selectedSize={selectedSize} />
                </motion.section>

                {/* Price History Chart */}
                <motion.section
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    style={{ marginTop: 64, marginBottom: 40 }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
                        <TrendingDown size={18} style={{ color: 'var(--success)' }} />
                        <h2
                            className="font-display"
                            style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-0.02em' }}
                        >
                            Price History
                        </h2>
                        <span style={{ fontSize: 13, color: 'var(--text-secondary)', marginLeft: 'auto' }}>Last 30 days</span>
                    </div>
                    <div
                        style={{
                            background: 'var(--surface)',
                            border: '1px solid var(--border)',
                            borderRadius: 16,
                            padding: 24,
                        }}
                    >
                        <PriceChart data={priceHistory} height={300} />
                    </div>
                </motion.section>
            </div>

            <style jsx global>{`
        @media (max-width: 1024px) {
          .pdp-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
        </div>
    );
}
