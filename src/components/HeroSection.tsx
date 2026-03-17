'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Zap } from 'lucide-react';
import Link from 'next/link';

export default function HeroSection() {
    return (
        <section
            style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                position: 'relative',
                overflow: 'hidden',
                paddingTop: 72,
            }}
        >
            {/* Animated Gradient Mesh Background */}
            <div className="gradient-mesh" />

            <div
                style={{
                    width: '100%',
                    maxWidth: 1400,
                    margin: '0 auto',
                    padding: '0 24px',
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: 48,
                    alignItems: 'center',
                    position: 'relative',
                    zIndex: 1,
                }}
                className="hero-grid"
            >
                {/* Left Content */}
                <motion.div
                    initial={{ opacity: 0, x: -40 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                >
                    {/* Trending badge */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        style={{ marginBottom: 24 }}
                    >
                        <span
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 8,
                                padding: '8px 16px',
                                borderRadius: 24,
                                border: '1px solid var(--border)',
                                background: 'var(--surface)',
                                fontSize: 13,
                                fontWeight: 500,
                                color: 'var(--text-secondary)',
                            }}
                        >
                            <Zap size={14} style={{ color: 'var(--accent-primary)' }} />
                            Aggregating prices from 50+ retailers
                        </span>
                    </motion.div>

                    <h1
                        className="font-display"
                        style={{
                            fontSize: 'clamp(48px, 6vw, 88px)',
                            fontWeight: 700,
                            lineHeight: 1.05,
                            letterSpacing: '-0.03em',
                            color: 'var(--text-primary)',
                            marginBottom: 24,
                        }}
                    >
                        Find the Best
                        <br />
                        Sneaker Price.
                        <br />
                        <span style={{ color: 'var(--accent-primary)' }}>Instantly.</span>
                    </h1>

                    <p
                        style={{
                            fontSize: 18,
                            lineHeight: 1.6,
                            color: 'var(--text-secondary)',
                            maxWidth: 480,
                            marginBottom: 40,
                        }}
                    >
                        Compare prices across StockX, GOAT, Nike, Adidas, and 50+ retailers.
                        Never overpay for sneakers again.
                    </p>

                    <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
                        <Link href="/search">
                            <motion.button
                                className="btn-primary"
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.98 }}
                                style={{ fontSize: 16, padding: '16px 36px' }}
                            >
                                Start Searching
                                <ArrowRight size={18} />
                            </motion.button>
                        </Link>
                        <span
                            style={{
                                fontSize: 13,
                                color: 'var(--text-secondary)',
                                fontFamily: "'JetBrains Mono', monospace",
                            }}
                        >
                            ⌘K to quick search
                        </span>
                    </div>

                    {/* Stats */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(3, 1fr)',
                            gap: 32,
                            marginTop: 64,
                            paddingTop: 32,
                            borderTop: '1px solid var(--border)',
                        }}
                        className="hero-stats"
                    >
                        {[
                            { value: '50K+', label: 'Sneakers Tracked' },
                            { value: '12', label: 'Retailers' },
                            { value: '24/7', label: 'Price Updates' },
                        ].map((stat, i) => (
                            <div key={i}>
                                <div
                                    className="font-mono"
                                    style={{
                                        fontSize: 28,
                                        fontWeight: 600,
                                        color: 'var(--accent-primary)',
                                        marginBottom: 4,
                                    }}
                                >
                                    {stat.value}
                                </div>
                                <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{stat.label}</div>
                            </div>
                        ))}
                    </motion.div>
                </motion.div>

                {/* Right - 3D Sneaker / Hero Image */}
                <motion.div
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative',
                    }}
                    className="hero-visual"
                >
                    {/* Glow circle behind sneaker */}
                    <div
                        style={{
                            position: 'absolute',
                            width: '80%',
                            aspectRatio: '1',
                            borderRadius: '50%',
                            background: 'radial-gradient(circle, rgba(204,255,0,0.08) 0%, transparent 70%)',
                            filter: 'blur(40px)',
                        }}
                    />

                    {/* Floating sneaker image */}
                    <motion.div
                        className="animate-float"
                        style={{
                            position: 'relative',
                            width: '100%',
                            maxWidth: 520,
                            aspectRatio: '1',
                        }}
                    >
                        <div
                            style={{
                                width: '100%',
                                height: '100%',
                                borderRadius: 24,
                                overflow: 'hidden',
                                background: 'var(--surface)',
                                border: '1px solid var(--border)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                position: 'relative',
                            }}
                        >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src="https://images.unsplash.com/photo-1600269452121-4f2416e55c28?w=600&h=600&fit=crop"
                                alt="Featured sneaker"
                                style={{
                                    width: '85%',
                                    height: '85%',
                                    objectFit: 'cover',
                                    borderRadius: 16,
                                    transition: 'transform 0.3s',
                                }}
                            />
                            {/* Price tag overlay */}
                            <div
                                style={{
                                    position: 'absolute',
                                    bottom: 20,
                                    right: 20,
                                    background: 'var(--surface)',
                                    border: '1px solid var(--border)',
                                    borderRadius: 12,
                                    padding: '10px 16px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: 2,
                                    backdropFilter: 'blur(12px)',
                                }}
                            >
                                <span style={{ fontSize: 11, color: 'var(--text-secondary)', fontWeight: 500 }}>BEST PRICE</span>
                                <span
                                    className="font-mono"
                                    style={{
                                        fontSize: 22,
                                        fontWeight: 600,
                                        color: 'var(--success)',
                                    }}
                                >
                                    $238
                                </span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Floating cards around the sneaker */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 }}
                        style={{
                            position: 'absolute',
                            top: '10%',
                            right: '-5%',
                            background: 'var(--surface)',
                            border: '1px solid var(--border)',
                            borderRadius: 12,
                            padding: '10px 14px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 8,
                            fontSize: 13,
                            boxShadow: 'var(--card-shadow)',
                        }}
                        className="floating-card"
                    >
                        <span style={{ color: 'var(--success)', fontWeight: 600 }}>↓ 12%</span>
                        <span style={{ color: 'var(--text-secondary)' }}>Price Drop</span>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.0 }}
                        style={{
                            position: 'absolute',
                            bottom: '15%',
                            left: '-5%',
                            background: 'var(--surface)',
                            border: '1px solid var(--border)',
                            borderRadius: 12,
                            padding: '10px 14px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 8,
                            fontSize: 13,
                            boxShadow: 'var(--card-shadow)',
                        }}
                        className="floating-card"
                    >
                        <span style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>🔥</span>
                        <span style={{ color: 'var(--text-secondary)' }}>Trending #1</span>
                    </motion.div>
                </motion.div>
            </div>

            {/* CSS for responsive hero */}
            <style jsx global>{`
        @media (max-width: 1024px) {
          .hero-grid { grid-template-columns: 1fr !important; text-align: center; }
          .hero-grid p { margin-left: auto; margin-right: auto; }
          .hero-grid > div:first-child { display: flex; flex-direction: column; align-items: center; }
          .hero-visual { display: none !important; }
          .hero-stats { max-width: 400px; margin-left: auto; margin-right: auto; }
        }
        @media (max-width: 768px) {
          .hero-stats { grid-template-columns: 1fr !important; text-align: center; gap: 20px !important; }
          .floating-card { display: none !important; }
        }
      `}</style>
        </section>
    );
}
