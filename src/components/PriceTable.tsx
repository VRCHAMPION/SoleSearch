'use client';

import { useMemo } from 'react';
import type { SneakerProduct } from '@/services/api/types';
import { ExternalLink, CheckCircle } from 'lucide-react';

const RETAILERS = [
    { key: 'stockX', name: 'StockX' },
    { key: 'goat', name: 'GOAT' },
    { key: 'flightClub', name: 'Flight Club' },
    { key: 'stadiumGoods', name: 'Stadium Goods' },
] as const;

interface PriceTableProps {
    product: SneakerProduct;
    selectedSize?: string | null;
}

export default function PriceTable({ product, selectedSize }: PriceTableProps) {

    const comparison = useMemo(() => {
        return RETAILERS
            .map(r => {
                // If a size is selected and we have resellPrices, use per-size price
                // Otherwise fall back to lowestResellPrice
                let price: number | null = null;
                if (selectedSize && product.resellPrices?.[r.key]) {
                    price = product.resellPrices[r.key][selectedSize] || null;
                } else if (product.lowestResellPrice?.[r.key]) {
                    price = product.lowestResellPrice[r.key];
                }

                return {
                    ...r,
                    price: price && price > 0 ? price : null,
                    link: product.resellLinks?.[r.key] || null,
                };
            })
            .filter(r => r.price !== null)
            .sort((a, b) => (a.price as number) - (b.price as number))
            .map((r, i) => ({ ...r, isBest: i === 0 }));
    }, [product, selectedSize]);

    if (comparison.length === 0) {
        return (
            <div
                style={{
                    background: 'var(--surface)',
                    border: '1px solid var(--border)',
                    borderRadius: 16,
                    padding: 32,
                    textAlign: 'center',
                    color: 'var(--text-secondary)',
                    fontSize: 14,
                }}
            >
                No pricing data available{selectedSize ? ` for size ${selectedSize}` : ''}.
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {/* Desktop Table */}
            <div className="price-table-desktop">
                <table
                    style={{
                        width: '100%',
                        borderCollapse: 'separate',
                        borderSpacing: '0 6px',
                    }}
                >
                    <thead>
                        <tr>
                            <th style={{ textAlign: 'left', padding: '8px 16px', fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                                Retailer
                            </th>
                            <th style={{ textAlign: 'left', padding: '8px 16px', fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                                Price
                            </th>
                            <th style={{ textAlign: 'left', padding: '8px 16px', fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                                Status
                            </th>
                            <th style={{ textAlign: 'right', padding: '8px 16px' }} />
                        </tr>
                    </thead>
                    <tbody>
                        {comparison.map((r) => (
                            <tr
                                key={r.key}
                                style={{
                                    background: r.isBest ? 'rgba(50, 215, 75, 0.06)' : 'var(--surface)',
                                    transition: 'background 0.2s',
                                }}
                            >
                                <td
                                    style={{
                                        padding: '16px',
                                        borderRadius: '12px 0 0 12px',
                                        border: '1px solid',
                                        borderColor: r.isBest ? 'rgba(50, 215, 75, 0.2)' : 'var(--border)',
                                        borderRight: 'none',
                                    }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                        <span style={{ fontSize: 14, fontWeight: 600 }}>{r.name}</span>
                                    </div>
                                </td>
                                <td
                                    style={{
                                        padding: '16px',
                                        border: '1px solid',
                                        borderColor: r.isBest ? 'rgba(50, 215, 75, 0.2)' : 'var(--border)',
                                        borderRight: 'none',
                                        borderLeft: 'none',
                                    }}
                                >
                                    <span
                                        className="font-mono"
                                        style={{
                                            fontSize: 18,
                                            fontWeight: 700,
                                            color: r.isBest ? 'var(--success)' : 'var(--text-primary)',
                                        }}
                                    >
                                        ${r.price}
                                    </span>
                                </td>
                                <td
                                    style={{
                                        padding: '16px',
                                        border: '1px solid',
                                        borderColor: r.isBest ? 'rgba(50, 215, 75, 0.2)' : 'var(--border)',
                                        borderRight: 'none',
                                        borderLeft: 'none',
                                    }}
                                >
                                    {r.isBest ? (
                                        <span
                                            style={{
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                gap: 4,
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
                                            <CheckCircle size={12} /> Best Price
                                        </span>
                                    ) : (
                                        <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Available</span>
                                    )}
                                </td>
                                <td
                                    style={{
                                        padding: '16px',
                                        borderRadius: '0 12px 12px 0',
                                        border: '1px solid',
                                        borderColor: r.isBest ? 'rgba(50, 215, 75, 0.2)' : 'var(--border)',
                                        borderLeft: 'none',
                                        textAlign: 'right',
                                    }}
                                >
                                    {r.link && (
                                        <a
                                            href={r.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            style={{
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                gap: 6,
                                                padding: '8px 16px',
                                                borderRadius: 8,
                                                border: '1.5px solid var(--accent-primary)',
                                                background: 'transparent',
                                                color: 'var(--accent-primary)',
                                                fontSize: 13,
                                                fontWeight: 600,
                                                textDecoration: 'none',
                                                transition: 'all 0.2s',
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.background = 'rgba(204, 255, 0, 0.08)';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.background = 'transparent';
                                            }}
                                        >
                                            Go to Store <ExternalLink size={12} />
                                        </a>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile Cards */}
            <div className="price-table-mobile">
                {comparison.map((r) => (
                    <div
                        key={r.key}
                        style={{
                            background: r.isBest ? 'rgba(50, 215, 75, 0.06)' : 'var(--surface)',
                            border: `1px solid ${r.isBest ? 'rgba(50, 215, 75, 0.2)' : 'var(--border)'}`,
                            borderRadius: 14,
                            padding: 16,
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            gap: 12,
                        }}
                    >
                        <div>
                            <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>{r.name}</div>
                            {r.isBest && (
                                <span
                                    style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: 4,
                                        background: 'rgba(50, 215, 75, 0.15)',
                                        color: 'var(--success)',
                                        fontSize: 10,
                                        fontWeight: 600,
                                        padding: '3px 8px',
                                        borderRadius: 20,
                                        textTransform: 'uppercase',
                                    }}
                                >
                                    <CheckCircle size={10} /> Best
                                </span>
                            )}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <span
                                className="font-mono"
                                style={{
                                    fontSize: 18,
                                    fontWeight: 700,
                                    color: r.isBest ? 'var(--success)' : 'var(--text-primary)',
                                }}
                            >
                                ${r.price}
                            </span>
                            {r.link && (
                                <a
                                    href={r.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        width: 32,
                                        height: 32,
                                        borderRadius: 8,
                                        border: '1px solid var(--accent-primary)',
                                        color: 'var(--accent-primary)',
                                        textDecoration: 'none',
                                    }}
                                >
                                    <ExternalLink size={14} />
                                </a>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            <style jsx global>{`
                .price-table-mobile { display: none; }
                @media (max-width: 768px) {
                    .price-table-desktop { display: none; }
                    .price-table-mobile { display: flex; flex-direction: column; gap: 8px; }
                }
            `}</style>
        </div>
    );
}
