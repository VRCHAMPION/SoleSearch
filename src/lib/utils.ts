import type { SneakerProduct, EnrichedSneaker, PricePoint } from '@/services/api/types';

/**
 * Enrich products with computed lowest price, best retailer, below-retail flag
 */
export function enrichProducts(products: SneakerProduct[]): EnrichedSneaker[] {
    return products.map(p => {
        const prices = Object.values(p.lowestResellPrice || {}).filter(v => v > 0);
        const lowestPrice = prices.length > 0 ? Math.min(...prices) : Infinity;
        const bestRetailerKey = Object.entries(p.lowestResellPrice || {})
            .filter(([, v]) => v > 0)
            .sort(([, a], [, b]) => a - b)[0]?.[0] || '';

        return {
            ...p,
            _lowestPrice: lowestPrice,
            _bestRetailer: bestRetailerKey,
            _belowRetail: p.retailPrice ? lowestPrice < p.retailPrice : false,
            _savingsPercent: p.retailPrice
                ? Math.round(((p.retailPrice - lowestPrice) / p.retailPrice) * 100)
                : 0,
        };
    });
}

/**
 * Sort enriched products by different criteria
 */
export function sortProducts(
    products: EnrichedSneaker[],
    sortBy: string
): EnrichedSneaker[] {
    const sorted = [...products];
    switch (sortBy) {
        case 'price-low':
            return sorted.sort((a, b) => a._lowestPrice - b._lowestPrice);
        case 'price-high':
            return sorted.sort((a, b) => b._lowestPrice - a._lowestPrice);
        case 'price-drop':
            return sorted.sort((a, b) => b._savingsPercent - a._savingsPercent);
        case 'newest':
            return sorted.sort((a, b) =>
                new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime());
        case 'popular':
        default:
            return sorted; // Already ordered by StockX popularity
    }
}

/**
 * Filter enriched products by brands, price range, below-retail only
 */
export function filterProducts(
    products: EnrichedSneaker[],
    filters: {
        brands?: string[];
        priceRange?: [number, number];
        belowRetailOnly?: boolean;
        query?: string;
    }
): EnrichedSneaker[] {
    return products.filter(p => {
        if (filters.brands?.length && !filters.brands.includes(p.brand)) return false;
        if (filters.priceRange) {
            if (p._lowestPrice < filters.priceRange[0] || p._lowestPrice > filters.priceRange[1])
                return false;
        }
        if (filters.belowRetailOnly && !p._belowRetail) return false;
        if (filters.query) {
            const q = filters.query.toLowerCase();
            const matchesQuery =
                p.shoeName.toLowerCase().includes(q) ||
                p.brand.toLowerCase().includes(q) ||
                (p.colorway || '').toLowerCase().includes(q);
            if (!matchesQuery) return false;
        }
        return true;
    });
}

/**
 * Map retailer key to display name
 */
export function formatRetailerName(key: string): string {
    const map: Record<string, string> = {
        stockX: 'StockX',
        flightClub: 'Flight Club',
        goat: 'GOAT',
        stadiumGoods: 'Stadium Goods',
    };
    return map[key] || key;
}

/**
 * Get the lowest price from a sneaker's lowestResellPrice map
 */
export function getLowestPrice(product: SneakerProduct): number | null {
    const prices = Object.values(product.lowestResellPrice || {}).filter(v => v > 0);
    return prices.length > 0 ? Math.min(...prices) : null;
}

/**
 * Generate fake price history for chart (API doesn't provide historical data)
 */
export function generatePriceHistory(basePrice: number, days: number = 30): PricePoint[] {
    const points: PricePoint[] = [];
    const now = new Date();
    for (let i = days; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        const variance = (Math.random() - 0.5) * basePrice * 0.15;
        points.push({
            date: date.toISOString().split('T')[0],
            price: Math.round(basePrice + variance),
        });
    }
    return points;
}
