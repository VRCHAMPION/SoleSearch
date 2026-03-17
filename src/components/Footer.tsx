'use client';

import { Heart, Instagram, Twitter, Youtube, Send } from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
    return (
        <footer
            style={{
                borderTop: '1px solid var(--border)',
                background: 'var(--bg-secondary)',
                padding: '60px 24px 32px',
                marginTop: 80,
            }}
        >
            <div
                style={{
                    maxWidth: 1400,
                    margin: '0 auto',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: 40,
                }}
            >
                {/* Brand */}
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                        <div
                            style={{
                                width: 32,
                                height: 32,
                                borderRadius: 8,
                                background: 'var(--accent-primary)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontFamily: "'Space Grotesk', sans-serif",
                                fontWeight: 700,
                                fontSize: 16,
                                color: '#0A0A0A',
                            }}
                        >
                            S
                        </div>
                        <span className="font-display" style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)' }}>
                            Sole<span style={{ color: 'var(--accent-primary)' }}>Search</span>
                        </span>
                    </div>
                    <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, maxWidth: 280 }}>
                        The smartest way to find the best sneaker deals. Comparing prices across 50+ retailers in real-time.
                    </p>
                    <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
                        {[Instagram, Twitter, Youtube].map((Icon, i) => (
                            <a
                                key={i}
                                href="#"
                                style={{
                                    width: 36,
                                    height: 36,
                                    borderRadius: 10,
                                    border: '1px solid var(--border)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'var(--text-secondary)',
                                    transition: 'all 0.2s',
                                }}
                            >
                                <Icon size={16} />
                            </a>
                        ))}
                    </div>
                </div>

                {/* Quick Links */}
                <div>
                    <h4 style={{ fontSize: 13, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-secondary)', marginBottom: 16 }}>
                        Quick Links
                    </h4>
                    {['Explore', 'Trending', 'New Drops', 'Watchlist'].map((link) => (
                        <Link
                            key={link}
                            href="/explore"
                            style={{
                                display: 'block',
                                color: 'var(--text-secondary)',
                                textDecoration: 'none',
                                fontSize: 14,
                                padding: '6px 0',
                                transition: 'color 0.2s',
                            }}
                        >
                            {link}
                        </Link>
                    ))}
                </div>

                {/* Brands */}
                <div>
                    <h4 style={{ fontSize: 13, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-secondary)', marginBottom: 16 }}>
                        Top Brands
                    </h4>
                    {['Nike', 'Adidas', 'New Balance', 'ASICS', 'Puma'].map((brand) => (
                        <Link
                            key={brand}
                            href="/explore"
                            style={{
                                display: 'block',
                                color: 'var(--text-secondary)',
                                textDecoration: 'none',
                                fontSize: 14,
                                padding: '6px 0',
                                transition: 'color 0.2s',
                            }}
                        >
                            {brand}
                        </Link>
                    ))}
                </div>

                {/* Newsletter */}
                <div>
                    <h4 style={{ fontSize: 13, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-secondary)', marginBottom: 16 }}>
                        Stay Updated
                    </h4>
                    <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 12, lineHeight: 1.5 }}>
                        Get price drop alerts & new release notifications.
                    </p>
                    <div style={{ display: 'flex', gap: 8 }}>
                        <input
                            type="email"
                            placeholder="your@email.com"
                            style={{
                                flex: 1,
                                padding: '10px 14px',
                                borderRadius: 10,
                                border: '1px solid var(--border)',
                                background: 'var(--surface)',
                                color: 'var(--text-primary)',
                                fontSize: 13,
                                outline: 'none',
                                fontFamily: "'Inter', sans-serif",
                            }}
                        />
                        <button
                            style={{
                                padding: '10px 14px',
                                borderRadius: 10,
                                border: 'none',
                                background: 'var(--accent-primary)',
                                color: '#0A0A0A',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                            }}
                        >
                            <Send size={16} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div
                style={{
                    maxWidth: 1400,
                    margin: '40px auto 0',
                    paddingTop: 24,
                    borderTop: '1px solid var(--border)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: 16,
                }}
            >
                <p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                    © 2025 SoleSearch. Prices are scraped in real-time. Not affiliated with any retailer.
                </p>
                <p style={{ fontSize: 12, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 4 }}>
                    Made with <Heart size={12} style={{ color: 'var(--accent-secondary)' }} /> for sneakerheads
                </p>
            </div>
        </footer>
    );
}
