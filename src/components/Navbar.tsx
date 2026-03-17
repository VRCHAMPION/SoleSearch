'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Sun, Moon, Menu, X, Heart, TrendingUp, Compass, Info, LogIn } from 'lucide-react';
import { useStore } from '@/store/store';
import { SignInButton, SignUpButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs';

const navLinks = [
    { href: '/search', label: 'Search', icon: Compass },
    { href: '/trending', label: 'Trending', icon: TrendingUp },
    { href: '/watchlist', label: 'Watchlist', icon: Heart },
    { href: '/#about', label: 'About', icon: Info },
];

export default function Navbar() {
    const { theme, toggleTheme, searchOpen, setSearchOpen, searchQuery, setSearchQuery } = useStore();
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                setSearchOpen(!searchOpen);
            }
            if (e.key === 'Escape') setSearchOpen(false);
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [searchOpen, setSearchOpen]);

    return (
        <>
            <nav
                className="glass"
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    zIndex: 100,
                    padding: '0 24px',
                    height: 72,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    transition: 'box-shadow 0.3s ease',
                    boxShadow: scrolled ? '0 4px 30px rgba(0,0,0,0.3)' : 'none',
                }}
            >
                {/* Logo */}
                <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
                    <div
                        style={{
                            width: 36,
                            height: 36,
                            borderRadius: 10,
                            background: 'var(--accent-primary)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontFamily: "'Space Grotesk', sans-serif",
                            fontWeight: 700,
                            fontSize: 20,
                            color: '#0A0A0A',
                        }}
                    >
                        S
                    </div>
                    <span
                        className="font-display"
                        style={{
                            fontSize: 22,
                            fontWeight: 700,
                            color: 'var(--text-primary)',
                            letterSpacing: '-0.02em',
                        }}
                    >
                        Sole<span style={{ color: 'var(--accent-primary)' }}>Search</span>
                    </span>
                </Link>

                {/* Center Nav Links (Desktop) */}
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 32,
                    }}
                    className="nav-links-desktop"
                >
                    {navLinks.map((link) => (
                        <Link
                            key={link.label}
                            href={link.href}
                            style={{
                                color: 'var(--text-secondary)',
                                textDecoration: 'none',
                                fontSize: 14,
                                fontWeight: 500,
                                transition: 'color 0.2s',
                                letterSpacing: '0.01em',
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-primary)')}
                            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>

                {/* Right Actions */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    {/* Search Toggle */}
                    <button
                        onClick={() => setSearchOpen(!searchOpen)}
                        aria-label="Toggle search"
                        style={{
                            width: 40,
                            height: 40,
                            borderRadius: 10,
                            border: '1px solid var(--border)',
                            background: 'transparent',
                            color: 'var(--text-secondary)',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all 0.2s',
                            position: 'relative',
                        }}
                    >
                        <Search size={18} />
                        <span
                            style={{
                                position: 'absolute',
                                bottom: -6,
                                right: -6,
                                fontSize: 9,
                                fontFamily: "'JetBrains Mono', monospace",
                                background: 'var(--surface)',
                                border: '1px solid var(--border)',
                                borderRadius: 4,
                                padding: '1px 4px',
                                color: 'var(--text-secondary)',
                            }}
                        >
                            ⌘K
                        </span>
                    </button>

                    {/* Theme Toggle */}
                    <button
                        onClick={toggleTheme}
                        aria-label="Toggle theme"
                        style={{
                            width: 40,
                            height: 40,
                            borderRadius: 10,
                            border: '1px solid var(--border)',
                            background: 'transparent',
                            color: 'var(--text-secondary)',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all 0.2s',
                        }}
                    >
                        <motion.div
                            key={theme}
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                        </motion.div>
                    </button>

                    <SignedIn>
                        <UserButton
                            afterSignOutUrl="/"
                            appearance={{
                                elements: {
                                    userButtonAvatarBox: "w-9 h-9 border border-gray-800"
                                }
                            }}
                        />
                    </SignedIn>

                    <SignedOut>
                        <div className="hidden sm:flex items-center gap-3">
                            <SignInButton mode="modal">
                                <button style={{
                                    color: 'var(--text-secondary)',
                                    fontSize: 14,
                                    fontWeight: 500,
                                    background: 'transparent',
                                    border: 'none',
                                    cursor: 'pointer',
                                    transition: 'color 0.2s',
                                }}
                                    onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-primary)')}
                                    onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
                                >
                                    Sign In
                                </button>
                            </SignInButton>
                            <SignUpButton mode="modal">
                                <button style={{
                                    background: 'linear-gradient(135deg, var(--accent-primary), var(--link))',
                                    color: '#0A0A0A',
                                    fontSize: 14,
                                    fontWeight: 600,
                                    border: 'none',
                                    borderRadius: 8,
                                    padding: '6px 14px',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 6,
                                    transition: 'transform 0.2s, box-shadow 0.2s',
                                }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = 'translateY(-1px)';
                                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(168, 255, 120, 0.3)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = 'translateY(0)';
                                        e.currentTarget.style.boxShadow = 'none';
                                    }}
                                >
                                    <LogIn size={14} />
                                    Get Started
                                </button>
                            </SignUpButton>
                        </div>
                    </SignedOut>

                    {/* Mobile Menu Toggle */}
                    <button
                        onClick={() => setMobileOpen(!mobileOpen)}
                        aria-label="Toggle mobile menu"
                        className="mobile-menu-btn"
                        style={{
                            width: 40,
                            height: 40,
                            borderRadius: 10,
                            border: '1px solid var(--border)',
                            background: 'transparent',
                            color: 'var(--text-secondary)',
                            cursor: 'pointer',
                            alignItems: 'center',
                            justifyContent: 'center',
                            display: 'none',
                        }}
                    >
                        {mobileOpen ? <X size={18} /> : <Menu size={18} />}
                    </button>
                </div>
            </nav>

            {/* Search Overlay */}
            <AnimatePresence>
                {searchOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        onClick={() => setSearchOpen(false)}
                        style={{
                            position: 'fixed',
                            inset: 0,
                            zIndex: 200,
                            background: 'rgba(0,0,0,0.6)',
                            backdropFilter: 'blur(8px)',
                            display: 'flex',
                            alignItems: 'flex-start',
                            justifyContent: 'center',
                            paddingTop: 120,
                        }}
                    >
                        <motion.div
                            initial={{ y: -20, opacity: 0, scale: 0.95 }}
                            animate={{ y: 0, opacity: 1, scale: 1 }}
                            exit={{ y: -20, opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                            onClick={(e) => e.stopPropagation()}
                            style={{
                                width: '100%',
                                maxWidth: 680,
                                background: 'var(--surface)',
                                borderRadius: 16,
                                border: '1px solid var(--border)',
                                padding: '8px',
                                boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 12px' }}>
                                <Search size={20} style={{ color: 'var(--text-secondary)', flexShrink: 0 }} />
                                <input
                                    type="text"
                                    placeholder="Search any sneaker... e.g. 'Air Jordan 1 Retro High OG'"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    autoFocus
                                    style={{
                                        flex: 1,
                                        background: 'transparent',
                                        border: 'none',
                                        color: 'var(--text-primary)',
                                        fontSize: 16,
                                        outline: 'none',
                                        fontFamily: "'Inter', sans-serif",
                                    }}
                                />
                                <span
                                    style={{
                                        fontSize: 11,
                                        color: 'var(--text-secondary)',
                                        background: 'var(--bg-secondary)',
                                        padding: '4px 8px',
                                        borderRadius: 6,
                                        fontFamily: "'JetBrains Mono', monospace",
                                    }}
                                >
                                    ESC
                                </span>
                            </div>
                            {searchQuery && (
                                <div style={{ borderTop: '1px solid var(--border)', padding: '8px 0', maxHeight: 320, overflowY: 'auto' }}>
                                    {/* Search results would go here - using mock data */}
                                    <div style={{ padding: '8px 16px', color: 'var(--text-secondary)', fontSize: 13 }}>
                                        Press Enter to search for &ldquo;{searchQuery}&rdquo;
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        initial={{ opacity: 0, x: '100%' }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: '100%' }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        style={{
                            position: 'fixed',
                            top: 0,
                            right: 0,
                            bottom: 0,
                            width: '80%',
                            maxWidth: 320,
                            zIndex: 150,
                            background: 'var(--bg-secondary)',
                            borderLeft: '1px solid var(--border)',
                            padding: '88px 24px 24px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 8,
                        }}
                    >
                        {navLinks.map((link) => (
                            <Link
                                key={link.label}
                                href={link.href}
                                onClick={() => setMobileOpen(false)}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 12,
                                    padding: '14px 16px',
                                    borderRadius: 12,
                                    color: 'var(--text-primary)',
                                    textDecoration: 'none',
                                    fontSize: 16,
                                    fontWeight: 500,
                                    transition: 'background 0.2s',
                                }}
                            >
                                <link.icon size={20} style={{ color: 'var(--accent-primary)' }} />
                                {link.label}
                            </Link>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* CSS for responsive */}
            <style jsx global>{`
        @media (max-width: 768px) {
          .nav-links-desktop { display: none !important; }
          .avatar-desktop { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
      `}</style>
        </>
    );
}
